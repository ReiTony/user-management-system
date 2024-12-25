# User Management System

## Overview

The **User Management System** is a server-side application built using the [NestJS](https://nestjs.com) framework. It provides robust user authentication, CSRF protection, and a fully documented API using Swagger. This project demonstrates best practices in API development and deployment using modern tools like PostgreSQL.

---

## Features

- **Authentication**: JWT-based authentication for secure user sessions.
- **CSRF Protection**: Secure application against cross-site request forgery attacks.
- **Validation**: Input validation using `class-validator` and `class-transformer`.
- **API Documentation**: Interactive API documentation via Swagger.
- **Database**: PostgreSQL integration with TypeORM for data management.
- **Security**:
    - `Helmet` for HTTP headers.
    - `CSRF` and other middleware for added protection.

---

## Technologies Used

- **Framework**: [NestJS](https://nestjs.com)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT
- **API Documentation**: Swagger

---

## Getting Started

### Prerequisites

- **Node.js** (v16 or later)
- **npm** (v8 or later)
- **PostgreSQL**

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/ReiTony/user-management-system.git
cd user-management-system
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file and add the following:

```
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=<your-db-user>
DATABASE_PASSWORD=<your-db-password>
DATABASE_NAME=<your-db-name>
JWT_SECRET=<your-jwt-secret>
NODE_ENV=development
```

#### 4. Set Up PostgreSQL
1. Install PostgreSQL: Download and install PostgreSQL from https://www.postgresql.org/download/.
2. Create a Database: Open the PostgreSQL shell or a GUI tool (e.g., pgAdmin) and create a database:
```bash
CREATE DATABASE your_db_name;
CREATE USER your_db_user WITH PASSWORD 'your_db_password';
GRANT ALL PRIVILEGES ON DATABASE your_db_name TO your_db_user;
```

#### 5.  Start the Application

```
npm run start

```
#### 6.  Start the Application
Once the application is running, access the API documentation at:
```
http://localhost:3000/api-docs
```

---

## Using the API

### Retrieving the CSRF Token

1. Call the `/api/csrf-token` endpoint using the Swagger UI.
2. Use the returned token in the `X-XSRF-TOKEN` header for subsequent requests.

### Key API Endpoints

#### Authentication

- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Authenticate a user.

#### Users

- `GET /users`: Fetch all users (Admin only).
- `PUT /users/:id`: Update a user profile.

#### CSRF

- `GET /csrf-token`: Retrieve the CSRF token.

---

## Testing

Run tests to ensure the application is functioning correctly. An `env.test` file is also available for test-specific configurations.

```bash
npm run test
```

---

## Security Best Practices

- **Helmet**: Secures HTTP headers.
- **CSRF Protection**: Ensures safe data transactions.
- **Validation**: Prevents malicious input through `class-validator` and `class-transformer`.

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Swagger Documentation](https://swagger.io/docs/)
- [TypeORM Documentation](https://typeorm.io/)

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact [antoncarino.work@gmail.com](mailto:antoncarino.work@gmail.com) or [reimerstony@gmail.com](mailto:reimerstony@gmail.com).
