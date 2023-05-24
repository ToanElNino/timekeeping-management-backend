import {Event} from 'src/database/entities';

export const LIST_EVENT_MOCK: Partial<Event>[] = [
  {
    id: 1,
    title: 'New transaction!',
    description: 'You have been received new transaction',
    topic: 'GENERAL_TOPIC',
    address: '0x93902d47bE75950242D2557588cF45F0D3da2812',
    datetimeStart: 1681355502,
    datetimeEnd: 1681355502,
    status: 'NEW',
    type: 'NOTIFICATION',
    createdAt: 1683684256131,
  },
];

export const EVENT_ITEM_MOCK: Partial<Event> = {
  id: 1,
  title: 'New transaction!',
  description: 'You have been received new transaction',
  topic: 'GENERAL_TOPIC',
  address: '0x93902d47bE75950242D2557588cF45F0D3da2812',
  datetimeStart: 1681355502,
  datetimeEnd: 1681355502,
  status: 'NEW',
  type: 'NOTIFICATION',
  createdAt: 1683684256131,
};
