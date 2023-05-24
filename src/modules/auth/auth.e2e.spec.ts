// ```yarn test -- src/modules/auth/auth.e2e.spec.ts --verbose``` to run test

import {Test, TestingModule} from '@nestjs/testing';
import {HttpStatus, INestApplication} from '@nestjs/common';
import request from 'supertest';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {Causes} from '../../config/exception/causes';
import {AdminLogin} from './request/login.dto';
import {AdminLoginResponse} from './response/login.dto';
import {AuthToken} from './request/auth-token.dto';
import {EmptyObject} from '../../shared/response/emptyObject.dto';
import {EmptyObjectBase} from '../../shared/response/emptyObjectBase.dto';
import {JwtAuthGuard} from './jwt-auth.guard';
import * as argon2 from 'argon2';
describe('AuthController', () => {
  let app: INestApplication;
  let authService: AuthService;

  let mockUser = null;

  const mockAuthService = {
    validateAdmin: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    getTokenByFreshToken: jest.fn(),
  };

  beforeAll(async () => {
    mockUser = {
      id: 1,
      username: 'testuser',
      password: await argon2.hash('testpassword'),
      status: 'ACTIVE',
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{provide: AuthService, useValue: mockAuthService}],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({CanActivate: jest.fn(() => true)})
      .compile();

    app = module.createNestApplication();
    await app.init();
    authService = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('login', () => {
    const mockAdminLogin: AdminLogin = {
      email: 'email@test.com',
      username: 'testuser',
      password: 'testpassword',
    };

    it('should return an AdminLoginResponse on successful login', async () => {
      mockAuthService.validateAdmin.mockResolvedValue(mockUser);
      mockAuthService.login.mockReturnValue({
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockAdminLogin)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
      });
    });

    it('should throw an error if the user is not found', async () => {
      mockAuthService.validateAdmin.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockAdminLogin)
        .expect(HttpStatus.UNAUTHORIZED);
      expect(response.body.error_code).toEqual('NON_RECORDED_USERNAME');
    });

    it('should throw an error if the user is not active', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: await argon2.hash('testpassword'),
        status: 'INACTIVE',
      };
      mockAuthService.validateAdmin.mockResolvedValue(mockUser);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockAdminLogin)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.error_code).toEqual('ADMIN_IS_NOT_ACTIVE');
    });

    it('should throw an error if the password is incorrect', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: await argon2.hash('testpassword'),
        status: 'ACTIVE',
      };
      mockAuthService.validateAdmin.mockResolvedValue(mockUser);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({...mockAdminLogin, password: 'wrongpassword'})
        .expect(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual({
        message: "The password you entered didn't match our record",
        error_code: 'PASSWORD_IS_FALSE',
        dynamic_data: null,
      });
    });
  });

  describe('logout', () => {
    it('should return an EmptyObject on successful logout', async () => {
      const mockRequest = {
        headers: {
          authorization: 'mock_token',
        },
      };
      mockAuthService.logout.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer mock_token')
        .expect(HttpStatus.CREATED);
      expect(response.body).toEqual({});
    });

    // it('should throw an error if the request is not authenticated', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post('/auth/logout')
    //     .expect(HttpStatus.UNAUTHORIZED);

    //   expect(response.body).toEqual({
    //     statusCode: HttpStatus.UNAUTHORIZED,
    //     message: 'Unauthorized',
    //   });
    // });
  });

  describe('getTokenByFreshToken', () => {
    const mockAuthToken: AuthToken = {
      refreshToken: 'mock_refresh_token',
    };

    it('should return an AdminLoginResponse on successful token refresh', async () => {
      mockAuthService.getTokenByFreshToken.mockReturnValue({
        access_token: 'mock_access_token',
        refresh_token: 'mock_new_refresh_token',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .send(mockAuthToken)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        access_token: 'mock_access_token',
        refresh_token: 'mock_new_refresh_token',
      });
    });

    // it('should throw an error if the AuthToken is not provided', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post('/auth/refresh-token')
    //     .expect(HttpStatus.INTERNAL_SERVER_ERROR);

    //   expect(response.body).toEqual(Causes.DATA_INVALID);
    // });
  });
});
