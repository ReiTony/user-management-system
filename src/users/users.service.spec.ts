import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUserById', () => {
    it('should return a user if found', async () => {
      const user = { id: '1', username: 'testuser', email: 'test@test.com' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findUserById('1');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.findUserById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const user = {
        id: '1',
        username: 'updatedUser',
        email: 'updated@test.com',
      };

      mockUserRepository.findOne.mockResolvedValueOnce(null); // Check for email existence
      mockUserRepository.update.mockResolvedValueOnce(user);
      mockUserRepository.findOne.mockResolvedValueOnce(user);

      const result = await service.updateUserProfile('1', {
        username: 'updatedUser',
        email: 'updated@test.com',
      });

      expect(result).toEqual(user);
    });

    it('should throw BadRequestException if email is already in use', async () => {
      const existingUser = { id: '2', email: 'existing@test.com' };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(
        service.updateUserProfile('1', {
          username: 'user',
          email: 'existing@test.com',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid input data', async () => {
      await expect(service.updateUserProfile('1', {})).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const user = { id: '1', password: await bcrypt.hash('oldPass', 10) }; // Using bcrypt to hash old password

      // Mocking to find the user
      mockUserRepository.findOne.mockResolvedValue(user);

      // Mocking bcrypt compare and hash
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);
      jest
        .spyOn(require('bcrypt'), 'hash')
        .mockResolvedValue('newHashedPassword');

      const result = await service.changePassword('1', 'oldPass', 'newPass');

      expect(mockUserRepository.update).toHaveBeenCalledWith('1', {
        password: 'newHashedPassword',
      });
      expect(result).toEqual({ message: 'Password updated successfully' });
    });

    it('should throw BadRequestException if old password is incorrect', async () => {
      const user = { id: '1', password: 'hashedPassword' };

      // Mocking to find the user
      mockUserRepository.findOne.mockResolvedValue(user);

      // Mocking bcrypt compare to return false
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(false);

      await expect(
        service.changePassword('1', 'wrongOldPass', 'newPass'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if passwords are empty or invalid input provided.', async () => {
      await expect(service.changePassword('1', 'oldPass', '')).rejects.toThrow(
        BadRequestException,
      ); // New password is empty
      await expect(service.changePassword('', '', '')).rejects.toThrow(
        BadRequestException,
      ); // Both passwords are empty
    });
  });
});
