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
- **Docker** and **Docker Compose**

### Setup Instructions
#### IMPT: Make Sure to run VS Code in administrator
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
DATABASE_HOST=db # Must match the service name in docker-compose.yml
DATABASE_PORT=5432
DATABASE_USER=<your-db-user>
DATABASE_PASSWORD=<your-db-password>
DATABASE_NAME=<your-db-name>
JWT_SECRET=<your-jwt-secret>
NODE_ENV=development
```
Note: If you're using Docker, set DATABASE_HOST to db, which matches the name of the database service defined in docker-compose.yml. If you're running PostgreSQL locally without Docker, set DATABASE_HOST to localhost.

#### 4. Start the Application (Setup Docker or Postgresql First)

```bash
npm start
```

#### 5. Access the Swagger UI

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

## Docker Deployment
### No Need to Install PostgreSQL Manually
Docker Compose will automatically set up a PostgreSQL container for you. Simply run the following commands to start the application and database. The PostgreSQL service is fully configured in the docker-compose.yml file, so there's no need to install PostgreSQL locally.
### 1. Build and Start Containers

```bash
docker-compose up --build
```

### 2. Access the Application

The application will be accessible at:

```
http://localhost:3000
```
## Configuring PostgreSQL Locally

If you prefer not to use Docker for PostgreSQL, you can set up PostgreSQL manually on your machine. Follow these steps:

### 1. Install PostgreSQL

Download and install PostgreSQL from [https://www.postgresql.org/](https://www.postgresql.org/).

### 2. Start PostgreSQL

Ensure the PostgreSQL service is running.

### 3. Create a Database

Open the PostgreSQL shell or a GUI tool (e.g., pgAdmin) and create a database:
```
CREATE DATABASE your_db_name;
```
### 4. Update .env File:

Use the configuration provided for local PostgreSQL in the .env example above.

### 5. Run the Application:

Follow the steps in "Start the Application" above.

---

## Security Best Practices

- **Helmet**: Secures HTTP headers.
- **CSRF Protection**: Ensures safe data transactions.
- **Validation**: Prevents malicious input through `class-validator` and `class-transformer`.

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Swagger Documentation](https://swagger.io/docs/)
- [TypeORM Documentation](https://typeorm.io/)
- [Docker Documentation](https://docs.docker.com/)

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact [antoncarino.work@gmail.com](mailto:antoncarino.work@gmail.com) or [reimerstony@gmail.com](mailto:reimerstony@gmail.com).
