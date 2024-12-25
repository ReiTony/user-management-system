import {
  Body,
  Controller,
  Post,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}
  // Register User Route
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Invalid CSRF Token.' })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    this.logger.log('Registering a new user');
    if (!body.username || !body.email || !body.password) {
      throw new BadRequestException(
        'Username, email, and password must be provided',
      );
    }
    return await this.authService.registerUser(body);
  }

  // Login User Route
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('login')
  async login(@Body() body: LoginDto) {
    this.logger.log('User attempting to log in');
    if (!body.email || !body.password) {
      throw new BadRequestException('Email and password must be provided');
    }
    return await this.authService.login(body);
  }
}
