import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
dotenv.config();
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as cookie from 'cookie';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Security middleware
  app.use(helmet());
  app.use(cookieParser());

  // CSRF protection middleware
  const csrfProtection = csurf({
    cookie: {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    },
  });

  // Middleware to send CSRF token to client and apply CSRF protection
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api-docs')) {
      return next(); // Skip CSRF protection for Swagger UI
    }

    csrfProtection(req, res, (err) => {
      if (err) {
        return next(err); // Handle CSRF errors
      }

      // Set the CSRF token in a cookie
      res.cookie('XSRF-TOKEN', req.csrfToken(), {
        httpOnly: false,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });

      next();
    });
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription(
      `
      ## Getting Started
      Follow these steps to interact with the API:
      1. **Retrieve CSRF Token:**
         - Run the \`GET /api/csrf-token\` endpoint to retrieve the CSRF token. This token is automatically set in a cookie.
      2. **Register a User:**
         - Use the \`POST /auth/register\` endpoint to register a new user.
      3. **Log In:**
         - Log in using the \`POST /auth/login\` endpoint. The response will include a JWT token.
      4. **Authorize Requests:**
         - Copy the JWT token from the login response.
         - Click the green **Authorize** button in the top-right corner of Swagger UI.
         - Enter the token as \`Bearer <your-token>\`.
      5. **Access Protected Endpoints:**
         - Now you can access protected endpoints such as:
           - \`GET /users/profile\` - Fetch user profile.
           - \`PUT /users/profile\` - Update user profile.
           - \`PUT /users/change-password\` - Update user password.

      **Note:** Ensure the CSRF token and Authorization header are set correctly for all protected endpoints.
    `,
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt',
    )
    .addTag('CSRF')
    .addTag('Authentication')
    .addTag('Users')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      requestInterceptor: (request) => {
        // Parse cookies for CSRF only
        const cookies = window.document.cookie
          .split(';')
          .reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          }, {});

        // Retrieve CSRF token
        const csrfToken = cookies['XSRF-TOKEN'];

        if (csrfToken) {
          request.headers['X-CSRF-Token'] = csrfToken; // Set only CSRF token in headers
        }

        return request;
      },
    },
  });

  const logger = new Logger('Bootstrap');
  logger.log('Application is starting...');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
}

// Function to get CSRF token from cookies
function getCsrfTokenFromCookie(req: any) {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies['XSRF-TOKEN'];
}

bootstrap();
