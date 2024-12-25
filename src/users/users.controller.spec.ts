import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockUsersService = {
  findUserById: jest.fn(),
  updateUserProfile: jest.fn(),
  changePassword: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      mockUsersService.findUserById.mockResolvedValueOnce({
        id: '1',
        username: 'testuser',
        email: 'test@test.com',
      });

      const result = await controller.getProfile({ user: { id: '1' } });

      expect(result).toEqual({
        id: '1',
        username: 'testuser',
        email: 'test@test.com',
      });
    });

    it('should throw an error if user ID is missing', async () => {
      await expect(controller.getProfile({ user: {} })).rejects.toThrow('User ID is missing in the request');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const dto: UpdateUserDto = { username: 'updatedUser' };
      mockUsersService.updateUserProfile.mockResolvedValueOnce({
        id: '1',
        username: 'updatedUser',
        email: 'test@test.com',
      });

      const result = await controller.updateProfile(
        { user: { id: '1' } },
        dto,
      );

      expect(result).toEqual({
        id: '1',
        username: 'updatedUser',
        email: 'test@test.com',
      });
    });

    it('should throw an error if user ID is missing', async () => {
      const dto: UpdateUserDto = { username: 'updatedUser' };
      await expect(controller.updateProfile({ user: {} }, dto)).rejects.toThrow('User ID is missing in the request');
    });

    it('should throw BadRequestException for invalid input', async () => {
      const dto = {}; 
      await expect(controller.updateProfile({ user: { id: '1' } }, dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('changePassword', () => {
    it('should change user password', async () => {
      const dto: ChangePasswordDto = {
        oldPassword: 'oldPass',
        newPassword: 'newPass',
      };
      mockUsersService.changePassword.mockResolvedValueOnce({
        message: 'Password updated successfully',
      });

      const result = await controller.changePassword(
        { user: { id: '1' } },
        dto,
      );

      expect(result).toEqual({
        message: 'Password updated successfully',
      });
    });

    it('should throw an error if user ID is missing', async () => {
      const dto: ChangePasswordDto = {
        oldPassword: 'oldPass',
        newPassword: 'newPass',
      };
      await expect(controller.changePassword({ user: {} }, dto)).rejects.toThrow('User ID is missing in the request');
    });

    it('should throw BadRequestException if old password is incorrect', async () => {
      const dto = {
        oldPassword: '',
        newPassword: '',
      };
      
      await expect(controller.changePassword({ user: { id: '1' } }, dto)).rejects.toThrow(BadRequestException);
    });
  });
});
