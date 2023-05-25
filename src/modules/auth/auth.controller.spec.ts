// ```yarn test -- src/modules/auth/auth.controller.spec.ts --verbose``` to run test
import {Test, TestingModule} from '@nestjs/testing';
import {CACHE_MANAGER, HttpStatus} from '@nestjs/common';
import * as argon2 from 'argon2';
import {Causes} from '../../config/exception/causes';
import {EmptyObject} from '../../shared/response/emptyObject.dto';
import {AuthService} from './auth.service';
import {JwtAuthGuard} from './jwt-auth.guard';
import {AuthController} from './auth.controller';
import {JwtService} from '@nestjs/jwt';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Admin} from '../../database/entities';
import {AuthRepository} from './auth.repository';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  const data = {
    username: 'test',
    password: 'password',
    email: 'email@test.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        AuthRepository,
        {
          provide: getRepositoryToken(Admin), // assuming you're using TypeORM
          useClass: Repository, // assuming this is the actual repository class
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => jest.fn(),
            set: () => jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({CanActivate: jest.fn(() => true)})
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return AdminLoginResponse if user is valid', async () => {
      const user = {
        username: 'test',
        email: 'email@test.com',
        password: await argon2.hash('password'),
        status: 'ACTIVE',
      };
      jest.spyOn(authService, 'validateAdmin').mockResolvedValue(user);
      jest
        .spyOn(authService, 'login')
        .mockResolvedValue({access_token: 'token', refresh_token: 'refresh'});

      const result = await controller.login(data);

      expect(result).toEqual({access_token: 'token', refresh_token: 'refresh'});
    });

    it('should throw NON_RECORDED_USERNAME if user is not valid', async () => {
      jest.spyOn(authService, 'validateAdmin').mockResolvedValue(null);

      await expect(controller.login(data)).rejects.toThrow(
        Causes.NON_RECORDED_USERNAME
      );
    });

    it('should throw ADMIN_IS_NOT_ACTIVE if user is not active', async () => {
      const user = {
        username: 'test',
        password: await argon2.hash('password'),
        status: 'INACTIVE',
      };
      jest.spyOn(authService, 'validateAdmin').mockResolvedValue(user);

      await expect(controller.login(data)).rejects.toThrow(
        Causes.ADMIN_IS_NOT_ACTIVE
      );
    });

    it('should throw PASSWORD_IS_FALSE if password is incorrect', async () => {
      const user = {
        username: 'test',
        password: await argon2.hash('wrongpassword'),
        status: 'ACTIVE',
      };
      jest.spyOn(authService, 'validateAdmin').mockResolvedValue(user);

      await expect(controller.login(data)).rejects.toThrow(
        Causes.PASSWORD_IS_FALSE
      );
    });
  });

  describe('logout', () => {
    it('should return EmptyObject', async () => {
      const request = {headers: {authorization: 'token'}};
      jest.spyOn(authService, 'logout').mockResolvedValue(undefined);

      const result = await controller.logout(request);

      expect(result).toEqual(new EmptyObject());
    });
  });

  describe('getTokenByFreshToken', () => {
    it('should return AdminLoginResponse if data is valid', async () => {
      const data = {refreshToken: 'refresh'};
      const tokens = {access_token: 'token', refresh_token: 'refresh'};
      jest.spyOn(authService, 'getTokenByFreshToken').mockResolvedValue(tokens);

      const result = await controller.getTokenByFreshToken(data, {});

      expect(result).toEqual(tokens);
    });

    it('should throw DATA_INVALID if data is invalid', async () => {
      const data = null;

      await expect(controller.getTokenByFreshToken(data, {})).rejects.toThrow(
        Causes.DATA_INVALID
      );
    });
  });
});
