import { Test, TestingModule } from '@nestjs/testing';
import { CsrfController } from './csrf.controller';
import { Request } from 'express';

describe('CsrfController', () => {
  let controller: CsrfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsrfController],
    }).compile();

    controller = module.get<CsrfController>(CsrfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCsrfToken', () => {
    it('should return a CSRF token', () => {
      // Mock the request object
      const req = {
        csrfToken: jest.fn().mockReturnValue('mocked_csrf_token'),
      } as unknown as Request;

      const result = controller.getCsrfToken(req);
      expect(result).toEqual({ token: 'mocked_csrf_token' });
      expect(req.csrfToken).toHaveBeenCalled();
    });
  });
});