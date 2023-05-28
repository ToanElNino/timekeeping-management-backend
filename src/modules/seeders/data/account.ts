import {Account} from 'src/database/entities';

export const accountDataSeeds: Partial<Account>[] = [
  {
    id: null,
    tenantId: 1,
    username: 'admin1',
    password: '123qwe',
    status: 'ACTIVE',
    roleId: 3,
  },
  {
    id: null,
    tenantId: 1,
    username: 'toanquoc2',
    password: '123qwe',
    status: 'ACTIVE',
    roleId: 2,
  },
  {
    id: null,
    tenantId: 1,
    username: 'toanquoc3',
    password: '123qwe',
    status: 'ACTIVE',
    roleId: 1,
  },
];
