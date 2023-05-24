import {Chain} from 'src/database/entities';

export const LIST_CHAIN_MOCK: Partial<Chain>[] = [
  {
    id: 1,
    chainName: 'Ethereum',
    icon: 'https://icon.jpg',
    status: 'ACTIVE',
    scanApi: 'https://example',
    rpcEndpoint: 'https://example',
    explorerEndpoint: 'https://example',
    createdAt: 1681355502,
    updatedAt: 1681355502,
  },
  {
    id: 2,
    chainName: 'Ethereum',
    icon: 'https://icon.jpg',
    status: 'ACTIVE',
    scanApi: 'https://example',
    rpcEndpoint: 'https://example',
    explorerEndpoint: 'https://example',
    createdAt: 1681355502,
    updatedAt: 1681355502,
  },
  {
    id: 3,
    chainName: 'Ethereum',
    icon: 'https://icon.jpg',
    status: 'ACTIVE',
    scanApi: 'https://example',
    rpcEndpoint: 'https://example',
    explorerEndpoint: 'https://example',
    createdAt: 1681355502,
    updatedAt: 1681355502,
  },
];

export const CHAIN_ITEM_MOCK: Partial<Chain> = {
  id: 1,
  chainName: 'Ethereum',
  icon: 'https://icon.jpg',
  status: 'ACTIVE',
  scanApi: 'https://example',
  rpcEndpoint: 'https://example',
  explorerEndpoint: 'https://example',
  createdAt: 1681355502,
  updatedAt: 1681355502,
};
