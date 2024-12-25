import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Find a user by ID and return a subset of the user object
  async findUserById(userId: string) {
    this.logger.debug(`Fetching user by ID: ${userId}`);
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'email', 'created_at'],
    });
    if (!user) {
      this.logger.warn(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Update a user's profile with new username or email
  async updateUserProfile(userId: string, data: UpdateUserDto) {
    this.logger.debug(`Updating user profile for ID: ${userId}`);

    if (!data.username && !data.email) {
      throw new BadRequestException(
        'At least one field (username or email) must be provided',
      );
    }

    if (data.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: data.email },
      });
      if (existingUser && existingUser.id !== userId) {
        this.logger.warn(
          `Email ${data.email} is already in use by another user`,
        );
        throw new BadRequestException('Email already in use');
      }
    }

    await this.usersRepository.update(userId, {
      username: data.username || undefined,
      email: data.email || undefined,
    });

    this.logger.log(`User profile updated successfully for ID: ${userId}`);
    return this.findUserById(userId);
  }
  // Update a user's password
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    if (!oldPassword || !newPassword) {
      this.logger.error('Both old and new passwords are required');
      throw new BadRequestException('Both old and new passwords are required');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.warn(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      this.logger.warn(`Invalid old password for user ID: ${userId}`);
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(userId, { password: hashedPassword });

    this.logger.log(`Password updated successfully for user ID: ${userId}`);
    return { message: 'Password updated successfully' };
  }
}
