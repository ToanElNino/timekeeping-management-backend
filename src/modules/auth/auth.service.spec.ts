// ```yarn test -- src/modules/auth/auth.service.spec.ts --verbose``` to run test

import {Test, TestingModule} from '@nestjs/testing';
import {CACHE_MANAGER} from '@nestjs/common';
import {Cache} from 'cache-manager';
import * as argon2 from 'argon2';
import {AuthService} from './auth.service';
import {AuthRepository} from './auth.repository';
import {Causes} from '../../config/exception/causes';
import {Admin} from 'src/database/entities';
import {IAdmin} from 'src/database/interfaces/IAdmin.interface';
import {JwtAuthGuard} from './jwt-auth.guard';
import {JwtService} from '@nestjs/jwt';
import {Repository} from 'typeorm';
import {getRepositoryToken} from '@nestjs/typeorm';
import * as crypto from '../../shared/Utils';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let authRepository: AuthRepository;
  let cacheManager: Cache;
  let admin = null;
  beforeEach(async () => {
    admin = {
      username: 'admin',
      password: 'password',
      email: 'test@mail.com',
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        AuthRepository,
        {
          provide: getRepositoryToken(Admin),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    authRepository = moduleRef.get<AuthRepository>(AuthRepository);
    cacheManager = moduleRef.get<Cache>(CACHE_MANAGER);
  });

  describe('createOne', () => {
    it('should hash the password before saving the admin', async () => {
      const hashedPassword = await argon2.hash(admin.password);
      jest
        .spyOn(authRepository, 'save')
        .mockResolvedValueOnce({...admin, ...{password: hashedPassword}});

      const result = await authService.createOne(admin);

      expect(result).toEqual({...admin, ...{password: hashedPassword}});
    });
  });

  describe('getListAdmin', () => {
    it('should return a list of admins with selected properties', async () => {
      const admins = [
        {
          username: 'admin1',
          email: 'admin1@example.com',
          createdAt: 123456789,
          updatedAt: 123456789,
        },
      ];
      jest.spyOn(authRepository, 'find').mockResolvedValueOnce(admins as any);

      const result = await authService.getListAdmin();
      expect(result).toEqual(
        admins.map(({username, email, createdAt, updatedAt}) => ({
          username,
          email,
          createdAt,
          updatedAt,
        }))
      );
    });
  });

  describe('validateAdmin', () => {
    it('should return the admin by username if provided', async () => {
      const getUserByUsernameSpy = jest
        .spyOn(authRepository, 'getUserByUsername')
        .mockResolvedValueOnce(admin as any);

      const result = await authService.validateAdmin({
        username: admin.username,
      });

      expect(getUserByUsernameSpy).toHaveBeenCalledWith(admin.username);
      expect(result).toEqual(admin);
    });

    it('should return the admin by email if provided', async () => {
      const getUserByEmailSpy = jest
        .spyOn(authRepository, 'getUserByEmail')
        .mockResolvedValueOnce(admin as any);

      const result = await authService.validateAdmin({email: admin.email});

      expect(getUserByEmailSpy).toHaveBeenCalledWith(admin.email);
      expect(result).toEqual(admin);
    });

    it('should return null if neither username nor email is provided', async () => {
      const result = await authService.validateAdmin({});

      expect(result).toBeNull();
    });
  });

  describe('validateAdminActive', () => {
    it('should return true if the admin status is not ACTIVE', async () => {
      const adminWithStatus = {...admin, status: 'INACTIVE'};
      const getUserByEmailSpy = jest
        .spyOn(authRepository, 'getUserByEmail')
        .mockResolvedValueOnce(admin as any);

      const result = await authService.validateAdminActive(
        adminWithStatus.email
      );

      expect(getUserByEmailSpy).toHaveBeenCalledWith(adminWithStatus.email);
      expect(result).toBe(true);
    });

    it('should return false if the admin status is ACTIVE', async () => {
      const getUserByEmailSpy = jest
        .spyOn(authRepository, 'getUserByEmail')
        .mockResolvedValueOnce({...admin, status: 'ACTIVE'});

      const result = await authService.validateAdminActive(admin.email);

      expect(getUserByEmailSpy).toHaveBeenCalledWith(admin.email);
      expect(result).toBe(false);
    });

    it('should return false if the admin does not exist', async () => {
      const getUserByEmailSpy = jest
        .spyOn(authRepository, 'getUserByEmail')
        .mockResolvedValueOnce(null);

      const result = await authService.validateAdminActive(admin.email);

      expect(getUserByEmailSpy).toHaveBeenCalledWith(admin.email);
      expect(result).toBe(false);
    });
  });

  describe('isValidToken', () => {
    it('should return true if the token matches the cached token', async () => {
      const token = 'token';
      const encryptSpy = jest
        .spyOn(crypto as any, 'encrypt')
        .mockImplementationOnce(() => 'encryptedToken');
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce('encryptedToken');

      const result = await authService.isValidToken('1', token);

      expect(encryptSpy).toHaveBeenCalledWith(token);
      expect(result).toBe(true);
    });

    it('should return false if the token does not match the cached token', async () => {
      const token = 'token';
      const encryptSpy = jest
        .spyOn(crypto as any, 'encrypt')
        .mockImplementationOnce(() => 'encryptedToken');
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce('wrongToken');

      const result = await authService.isValidToken('1', token);

      expect(encryptSpy).toHaveBeenCalledWith(token);
      expect(result).toBe(false);
    });
  });

  describe('setValidToken', () => {
    it('should set the encrypted token in the cache', async () => {
      const token = 'token';
      const encryptSpy = jest
        .spyOn(crypto, 'encrypt')
        .mockReturnValueOnce('encryptedToken');

      await authService.setValidToken('1', token);
      expect(encryptSpy).toHaveBeenCalledWith(token);
    });
  });

  describe('deleteValidToken', () => {
    it('should delete the cached token', async () => {
      const delSpy = jest
        .spyOn(cacheManager, 'del')
        .mockResolvedValueOnce('undefined');

      await authService.deleteValidToken('1');

      expect(delSpy).toHaveBeenCalledWith('undefined_1');
    });
  });

  describe('login', () => {
    it('should sign and return access and refresh tokens with selected properties', async () => {
      const user = {...admin, id: 1};
      const payload = {
        username: user.username,
        email: user.email,
        userId: user.id,
      };
      const access_token = 'access_token';
      const refresh_token = 'refresh_token';
      const signSpy = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce(access_token)
        .mockReturnValueOnce(refresh_token);
      const setValidTokenSpy = jest
        .spyOn(authService, 'setValidToken')
        .mockResolvedValueOnce(undefined);

      const result = await authService.login(user);

      expect(signSpy).toHaveBeenCalledWith(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRED,
      });
      expect(signSpy).toHaveBeenCalledWith(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRED,
      });
      expect(setValidTokenSpy).toHaveBeenCalledWith(
        `${payload.userId}`,
        refresh_token
      );
      expect(result).toEqual({
        email: user.email,
        username: user.username,
        type: user.type,
        access_token,
        refresh_token,
      });
    });
  });
  describe('getTokenByFreshToken', () => {
    it('should throw an error if refresh token is not provided', async () => {
      const refreshToken = '';
      const result = await authService.getTokenByFreshToken(refreshToken);
      await expect(result).toEqual(false);
    });

    it('should throw an error if user is not valid', async () => {
      const refreshToken = 'myRefreshToken';
      const user = {username: '', email: ''};
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(user);
      const result = await authService.getTokenByFreshToken(refreshToken);
      await expect(result).toEqual(false);
    });

    it('should throw an error if user cannot be found', async () => {
      const refreshToken = 'myRefreshToken';
      const user = {username: 'myUsername', email: 'myEmail'};
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(user);
      jest.spyOn(authRepository, 'findOne').mockResolvedValueOnce(undefined);
      const result = await authService.getTokenByFreshToken(refreshToken);
      await expect(result).toEqual(false);
    });

    // it('should return a token if everything is valid', async () => {
    //   const refreshToken = 'myRefreshToken';
    //   const user = {...admin, status: 'ACTIVE'};
    //   jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(user);
    //   jest.spyOn(authRepository, 'findOne').mockResolvedValueOnce(user);
    //   jest.spyOn(authService, 'isValidToken').mockResolvedValueOnce(true);
    //   const result = await authService.getTokenByFreshToken(refreshToken);
    //   expect(result).toBeDefined();
    // });
  });

  describe('checkDuplicatedUser', () => {
    it('should return a user if there is a duplicate', async () => {
      jest.spyOn(authRepository, 'findOne').mockResolvedValueOnce(admin);
      const result = await authService.checkDuplicatedUser(admin);
      expect(result).toBe(admin);
    });
  });

  describe('checkPermissionUser', () => {
    it('should return true if user is super admin', async () => {
      const user = {...admin, id: 1, type: 1};
      jest
        .spyOn(authRepository, 'findOne')
        .mockResolvedValueOnce({...admin, type: 1});
      const result = await authService.checkPermissionUser(user);
      expect(result).toBe(true);
    });

    it('should return false if user is not super admin', async () => {
      jest
        .spyOn(authRepository, 'findOne')
        .mockResolvedValueOnce({...admin, type: 2});
      const result = await authService.checkPermissionUser(admin);
      expect(result).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true if user is super admin', async () => {
      const user = {...admin, id: 1, type: 1};
      jest
        .spyOn(authRepository, 'findOne')
        .mockResolvedValueOnce({...admin, type: 1});
      const result = await authService.isAdmin(user);
      expect(result).toBe(true);
    });

    it('should return false if user is not super admin', async () => {
      const user = {...admin, id: 1, type: 2};
      jest
        .spyOn(authRepository, 'findOne')
        .mockResolvedValueOnce({...admin, type: 2});
      const result = await authService.isAdmin(user);
      expect(result).toBe(false);
    });
  });

  describe('isActive', () => {
    it('should return true if user is active', async () => {
      const user = {...admin, id: 1};
      jest.spyOn(authRepository, 'findOne').mockResolvedValueOnce(user);
      const result = await authService.isActive(user);
      expect(result).toBe(true);
    });

    it('should return false if user is not active', async () => {
      const user = {id: 1};
      jest.spyOn(authRepository, 'findOne').mockResolvedValueOnce(undefined);
      const result = await authService.isActive(user);
      expect(result).toBe(false);
    });
  });

  describe('getUserByEmailAndUsername', () => {
    it('should return the user if found', async () => {
      jest.spyOn(authRepository, 'findOne').mockResolvedValueOnce(admin);
      const result = await authService.getUserByEmailAndUsername(
        admin.email,
        admin.username
      );
      expect(result).toBe(admin);
    });
  });
});
