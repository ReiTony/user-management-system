import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerUser', () => {
    it('should hash password and save user', async () => {
      mockUserRepository.create.mockImplementation((data) => data);
      mockUserRepository.save.mockResolvedValueOnce({
        id: '1',
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashedPassword', 
      });

      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');

      const result = await service.registerUser({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password',
      });

      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'hashedPassword',
        }),
      );

      const { password, ...filteredResult } = result;
      
      expect(filteredResult).toEqual({
        id: '1',
        username: 'testuser',
        email: 'test@test.com',
      });
    });

    it('should throw BadRequestException if user exists', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce({
        username: 'testuser',
      });

      await expect(
        service.registerUser({
          username: 'testuser',
          email: 'test@test.com',
          password: 'password',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid input data', async () => {
       await expect(service.registerUser({})).rejects.toThrow(BadRequestException); 
     });
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
       const user = { id:'1', username:'testuser', password:'hashedPassword' };
       mockUserRepository.findOne.mockResolvedValue(user);
       jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
       mockJwtService.sign.mockReturnValue('mockToken');

       const result = await service.login({ email:'test@test.com', password:'password' });
       
       expect(result).toEqual({ token:'mockToken' });
       expect(mockJwtService.sign).toHaveBeenCalledWith({ sub:user.id, username:user.username });
     });

     it('should throw BadRequestException if user not found or password is incorrect', async () => {
       // Test case where user is not found
       mockUserRepository.findOne.mockResolvedValue(null);

       await expect(service.login({ email:'nonexistent@test.com', password:'password' })).rejects.toThrow(BadRequestException);

       // Test case where password is incorrect
       const user = { id:'1', username:'testuser', password:'hashedPassword' };
       mockUserRepository.findOne.mockResolvedValue(user);
       jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

       await expect(service.login({ email:'test@test.com', password:'wrongPassword' })).rejects.toThrow(BadRequestException);
     });
   });
});
