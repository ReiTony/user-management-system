import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { BadRequestException } from '@nestjs/common';

const mockAuthService = {
  registerUser: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.registerUser and return the result', async () => {
      const dto: RegisterDto = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password',
      };
      mockAuthService.registerUser.mockResolvedValue({
        id: '1',
        username: 'testuser',
        email: 'test@test.com',
      });
  
      const result = await controller.register(dto);
      expect(result).toEqual({
        id: '1',
        username: 'testuser',
        email: 'test@test.com',
      });
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(dto);
    });
  
    it('should throw BadRequestException if registration fails', async () => {
      const dto: RegisterDto = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password',
      };
      mockAuthService.registerUser.mockRejectedValue(new BadRequestException('Registration failed'));
  
      await expect(controller.register(dto)).rejects.toThrow(BadRequestException);
    });
  
    it('should throw BadRequestException for invalid input', async () => {
      const dto = {}; 
      await expect(controller.register(dto as RegisterDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should call AuthService.login and return the result', async () => {
      const dto: LoginDto = {
        email: 'test@test.com',
        password: 'password',
      };
      mockAuthService.login.mockResolvedValue({ token: 'mockToken' });
  
      const result = await controller.login(dto);
      expect(result).toEqual({ token: 'mockToken' });
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  
    it('should throw BadRequestException if login fails', async () => {
      const dto: LoginDto = {
        email: 'test@test.com',
        password: 'password',
      };
      mockAuthService.login.mockRejectedValue(new BadRequestException('Login failed'));
  
      await expect(controller.login(dto)).rejects.toThrow(BadRequestException);
    });
  
    it('should throw BadRequestException for invalid input', async () => {
      const dto = {}; 
      await expect(controller.login(dto as LoginDto)).rejects.toThrow(BadRequestException);
    });
  });
});
