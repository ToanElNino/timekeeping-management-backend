import {SystemWallet} from 'src/database/entities';

export const LIST_WALLET_MOCK: Partial<SystemWallet>[] = [
  {
    systemWallet: '0x1ABC7154748D1CE5144478CDEB574AE244B939B5',
    status: 'ACTIVE',
    name: 'NAME',
    chainId: 1,
    createdAt: 1681355502,
  },
];

export const WALLET_ITEM_MOCK: Partial<SystemWallet> = {
  systemWallet: '0x1ABC7154748D1CE5144478CDEB574AE244B939B5',
  status: 'ACTIVE',
  name: 'NAME',
  chainId: 1,
  createdAt: 1681355502,
  updatedAt: 1681355502,
};
