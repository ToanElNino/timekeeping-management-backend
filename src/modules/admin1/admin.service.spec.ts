//yarn test -- src/modules/admin/admin.service.spec.ts --verbose

import {Test} from '@nestjs/testing';
import {CACHE_MANAGER} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Cache} from 'cache-manager';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {Admin, User} from '../../database/entities';
import {AdminRepository} from './admin.repository';
import {AdminService} from './admin.service';
import {CreatePartnership} from './request/createPartnership.dto';
import {UpdateProfile} from './request/update-profile.dto';
import * as argon2 from 'argon2';
jest.mock('argon2');

describe('AdminService', () => {
  let adminService: AdminService;
  let adminRepository: AdminRepository;
  let jwtService: JwtService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: AdminRepository,
          useValue: {
            save: jest.fn(),
            getUserByEmail: jest.fn(),
            getUserById: jest.fn(),
            getUserByEmailAndUsername: jest.fn(),
            findOne: jest.fn(),
            _registerUser: jest.fn(),
            filterAdmin: jest.fn(),
          },
        },
        JwtService,
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

    adminService = moduleRef.get<AdminService>(AdminService);
    adminRepository = moduleRef.get<AdminRepository>(AdminRepository);
    jwtService = moduleRef.get<JwtService>(JwtService);
    cacheManager = moduleRef.get<Cache>(CACHE_MANAGER);
  });

  describe('createOne', () => {
    it('should hash the password and save the admin', async () => {
      const admin = {username: 'test', password: 'password'} as Admin;
      const hashedPassword = 'hashedPassword';
      (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);
      // jest.spyOn(argon2, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(adminRepository, 'save').mockResolvedValue(admin);

      const result = await adminService.createOne(admin);

      expect(argon2.hash).toHaveBeenCalledWith(admin.password);
      expect(adminRepository.save).toHaveBeenCalledWith({
        ...admin,
        password: hashedPassword,
      });
      expect(result).toEqual(admin);
    });
  });

  describe('getUserByEmail', () => {
    it('should call adminRepository.getUserByEmail with the email', async () => {
      const email = 'test@test.com';
      jest.spyOn(adminRepository, 'getUserByEmail').mockResolvedValue(null);

      await adminService.getUserByEmail(email);

      expect(adminRepository.getUserByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('getUserById', () => {
    it('should call adminRepository.getUserById with the id', async () => {
      const id = 1;
      jest.spyOn(adminRepository, 'getUserById').mockResolvedValue(null);

      await adminService.getUserById(id);

      expect(adminRepository.getUserById).toHaveBeenCalledWith(id);
    });
  });

  describe('checkDuplicatedUser', () => {
    it('should call getUserByEmailAndUsername with the email and username and return the result', async () => {
      const data = {
        email: 'test@test.com',
        username: 'test',
      } as CreatePartnership;
      const duplicatedUser = null;
      jest
        .spyOn(adminService, 'getUserByEmailAndUsername')
        .mockResolvedValue(duplicatedUser);

      const result = await adminService.checkDuplicatedUser(data);

      expect(adminService.getUserByEmailAndUsername).toHaveBeenCalledWith(
        data.email,
        data.username
      );
      expect(result).toEqual(duplicatedUser);
    });
  });

  describe('checkPermissionUser', () => {
    it('should return true for super admin user', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        username: 'test',
        avatarUrl: '',
        fullName: '',
        type: '',
        status: '',
        createdAt: 123456789,
        updatedAt: 123456789,
      };
      const userData = {type: 1};
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(userData as any);

      const result = await adminService.checkPermissionUser(user);

      expect(adminRepository.findOne).toHaveBeenCalledWith({
        where: {id: user.id},
      });
      expect(result).toBe(true);
    });

    it('should return false for non-super admin user', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        username: 'test',
        avatarUrl: '',
        fullName: '',
        type: '',
        status: '',
        createdAt: 123456789,
        updatedAt: 123456789,
      };
      const userData = {type: 2};
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(userData as any);

      const result = await adminService.checkPermissionUser(user);

      expect(adminRepository.findOne).toHaveBeenCalledWith({
        where: {id: user.id},
      });
      expect(result).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true for super admin user', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        username: 'test',
        avatarUrl: '',
        fullName: '',
        type: '',
        status: '',
        createdAt: 123456789,
        updatedAt: 123456789,
      };
      const userData = {type: 1};
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(userData as any);

      const result = await adminService.isAdmin(user);

      expect(adminRepository.findOne).toHaveBeenCalledWith({
        where: {id: user.id},
      });
      expect(result).toBe(true);
    });

    it('should return false for non-super admin user', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        username: 'test',
        avatarUrl: '',
        fullName: '',
        type: '',
        status: '',
        createdAt: 123456789,
        updatedAt: 123456789,
      };
      const userData = {type: 2};
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(userData as any);

      const result = await adminService.isAdmin(user);

      expect(adminRepository.findOne).toHaveBeenCalledWith({
        where: {id: user.id},
      });
      expect(result).toBe(false);
    });
  });

  describe('isPartnerShip', () => {
    it('should return true for partnership user', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        username: 'test',
        avatarUrl: '',
        fullName: '',
        type: '',
        status: '',
        createdAt: 123456789,
        updatedAt: 123456789,
      };
      const userData = {type: 2};
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(userData as any);

      const result = await adminService.isPartnerShip(user);

      expect(adminRepository.findOne).toHaveBeenCalledWith({
        where: {id: user.id},
      });
      expect(result).toBe(true);
    });

    it('should return false for non-partnership user', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        username: 'test',
        avatarUrl: '',
        fullName: '',
        type: '',
        status: '',
        createdAt: 123456789,
        updatedAt: 123456789,
      };
      const userData = {type: 1};
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(userData as any);

      const result = await adminService.isPartnerShip(user);

      expect(adminRepository.findOne).toHaveBeenCalledWith({
        where: {id: user.id},
      });
      expect(result).toBe(false);
    });
  });

  describe('isActive', () => {
    it('should return true for active user', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        username: 'test',
        avatarUrl: '',
        fullName: '',
        type: '',
        status: '',
        createdAt: 123456789,
        updatedAt: 123456789,
      };
      const userData = {id: 1, status: 'ACTIVE'};
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(userData as any);

      const result = await adminService.isActive(user);

      expect(adminRepository.findOne).toHaveBeenCalledWith({
        where: {id: user.id, status: 'ACTIVE'},
      });
      expect(result).toBe(true);
    });

    it('should return false for non-active user', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        username: 'test',
        avatarUrl: '',
        fullName: '',
        type: '',
        status: '',
        createdAt: 123456789,
        updatedAt: 123456789,
      };
      const userData = null;
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(userData);

      const result = await adminService.isActive(user);

      expect(adminRepository.findOne).toHaveBeenCalledWith({
        where: {id: user.id, status: 'ACTIVE'},
      });
      expect(result).toBe(false);
    });
  });

  describe('getUserByEmailAndUsername', () => {
    it('should return a user', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        username: 'test',
        avatarUrl: '',
        fullName: '',
        type: '',
        status: '',
        createdAt: 123456789,
        updatedAt: 123456789,
      };
      jest
        .spyOn(adminRepository, 'getUserByEmailAndUsername')
        .mockResolvedValue(user as any);

      const result = await adminService.getUserByEmailAndUsername(
        user.email,
        user.username
      );

      expect(result).toEqual(user);
    });
  });

  describe('createPartnership', () => {
    it('should return a user', async () => {
      const data = {
        email: 'test@test.com',
        fullName: 'Test User',
        username: 'testuser',
        password: 'testpassword',
        type: 'ACTIVE',
      };
      const user = {id: 1, email: 'test@test.com', username: 'testuser'};
      (argon2.hash as jest.Mock).mockResolvedValue('hashedPassword');
      jest
        .spyOn(adminRepository, '_registerUser')
        .mockResolvedValue(user as any);

      const result = await adminService.createPartnership(data as any);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        username: user.username,
      });
    });
  });
  describe('getList', () => {
    it('should return a pagination response of admins', async () => {
      const params = {};
      const paginationOptions = {limit: 10, page: 1};
      const admins = [
        {
          id: 1,
          email: 'test@test.com',
          username: 'test',
          avatarUrl: '',
          fullName: '',
          type: '',
          status: '',
          createdAt: 123456789,
          updatedAt: 123456789,
        },
        {
          id: 2,
          email: 'test2@test.com',
          username: 'test2',
          avatarUrl: '',
          fullName: '',
          type: '',
          status: '',
          createdAt: 123456789,
          updatedAt: 123456789,
        },
      ];
      const adminsCountList = [{Total: 2}];
      jest
        .spyOn(adminRepository, 'filterAdmin')
        .mockResolvedValue({admins, adminsCountList} as any);

      const result = await adminService.getList(params, paginationOptions);
      expect(result).toEqual({
        results: admins,
        pagination: {
          totalItems: 2,
          itemCount: 2,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      });
    });
  });
});
