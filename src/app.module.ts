import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { CsrfModule } from './csrf/csrf.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER ?? 'testuser',
      password: process.env.DATABASE_PASSWORD ?? 'testpassword',
      database: process.env.DATABASE_NAME ?? 'testdb',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    CsrfModule,
  ],
})
export class AppModule {}
