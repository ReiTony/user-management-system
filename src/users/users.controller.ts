import {
  Controller,
  Get,
  Put,
  Req,
  Body,
  UseGuards,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('jwt')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  // Show User Profile Route
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile fetched successfully.',
    schema: {
      example: {
        id: 'uuid',
        username: 'string',
        email: 'string@gmail.com',
        createdAt: '2024-12-25T00:00:00.000Z',
        updatedAt: '2024-12-25T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('profile')
  async getProfile(@Req() req: any) {
    this.logger.log('Fetching user profile');
    const userId = req.user?.id;
    if (!userId) {
      this.logger.warn('No user ID found in request');
      throw new Error('User ID is missing in the request');
    }
    return this.usersService.findUserById(userId);
  }

  // Update User Profile Route
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Put('profile')
  async updateProfile(@Req() req: any, @Body() body: UpdateUserDto) {
    this.logger.log('Updating user profile');
    const userId = req.user?.id;
    if (!userId) {
      this.logger.warn('No user ID found in request');
      throw new Error('User ID is missing in the request');
    }
    if (!body.username && !body.email) {
      throw new BadRequestException(
        'At least one field (username or email) must be provided',
      );
    }
    return this.usersService.updateUserProfile(userId, body);
  }

  // Change Password Route
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Put('change-password')
  async changePassword(@Req() req: any, @Body() body: ChangePasswordDto) {
    this.logger.log('Changing user password');
    const userId = req.user?.id;
    if (!userId) {
      this.logger.warn('No user ID found in request');
      throw new Error('User ID is missing in the request');
    }
    if (!body.oldPassword || !body.newPassword) {
      throw new BadRequestException('Both old and new passwords are required');
    }
    return this.usersService.changePassword(
      userId,
      body.oldPassword,
      body.newPassword,
    );
  }
}
