import {IAdmin} from '../../../database/interfaces/IAdmin.interface';

export const adminDataSeeds: IAdmin[] = [
  {
    username: 'superadmin',
    password: '',
    email: 'superadmin@gmail.com',
    avatarUrl: null,
    fullName: 'Super Admin',
    status: 'ACTIVE',
    type: 1, // super admin
  },
];
