/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable node/no-unpublished-import */
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Merchant, User} from '../../database/entities';
import {Repository} from 'typeorm';
import {MerchantService} from './merchant.service';
import {
  allMerchant,
  deActiveMerchant,
  merchant,
  merchantPage1,
  newMerchant,
  wallet,
} from './dataTest';

describe('MerchantService', () => {
  let merchantService: MerchantService;
  let merchantRepository: Repository<Merchant>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerchantService,
        {
          provide: getRepositoryToken(Merchant),
          useClass: Repository,
        },
      ],
    }).compile();

    merchantService = module.get<MerchantService>(MerchantService);
    merchantRepository = module.get<Repository<Merchant>>(
      getRepositoryToken(Merchant)
    );
  });
  // getAllMerchant
  describe('getAllMerchant', () => {
    it('should return all merchants', async () => {
      jest.spyOn(merchantRepository, 'find').mockResolvedValue(allMerchant);

      const result = await merchantService.getAllMerchant();

      expect(result).toEqual(allMerchant);
      expect(merchantRepository.find).toHaveBeenCalled();
    });
  });

  //GetMerchantWithPage
  describe('getMerchantWithPage', () => {
    it('should return merchants by page', async () => {
      jest
        .spyOn(merchantRepository, 'findAndCount')
        .mockResolvedValue([merchantPage1, 10]);
      jest.spyOn(merchantRepository, 'count').mockResolvedValue(10);

      const result = await merchantService.getMerchantWithPage(
        10,
        1,
        null,
        null
      );

      expect(result).toEqual({
        result: merchantPage1,
        total: 10,
      });
      expect(merchantRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('getMerchantWithPage', () => {
    it('should return merchants by page and filter by Name', async () => {
      jest
        .spyOn(merchantRepository, 'findAndCount')
        .mockResolvedValue([merchantPage1, 10]);
      jest.spyOn(merchantRepository, 'count').mockResolvedValue(10);

      const result = await merchantService.getMerchantWithPage(
        10,
        1,
        'lehuyaa',
        null
      );

      expect(result).toEqual({
        result: merchantPage1,
        total: 10,
      });
      expect(merchantRepository.findAndCount).toHaveBeenCalled();
    });
  });

  //getMerchantByMerchantAddress
  describe('getMerchantByMerchantAddress', () => {
    it('should return merchant', async () => {
      jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(merchant);

      const result = await merchantService.getMerchantByMerchantAddress(
        '0x93902d47bE75950242D2557588cF45F0D3da2812'
      );

      expect(result).toEqual(merchant);
      expect(merchantRepository.findOne).toHaveBeenCalled();
    });
  });

  //create merchant
  describe('createMerchant', () => {
    it('should return merchant', async () => {
      jest.spyOn(merchantRepository, 'save').mockResolvedValue(merchant);

      const result = await merchantService.createMerchant(newMerchant);

      expect(result).toEqual(merchant);
      expect(merchantRepository.save).toHaveBeenCalled();
    });
  });

  //change status merchant
  describe('updateStatus', () => {
    it('should return merchant with new status', async () => {
      jest.spyOn(merchantRepository, 'findOne').mockResolvedValue(merchant);
      jest
        .spyOn(merchantRepository, 'save')
        .mockResolvedValue(deActiveMerchant);

      const result = await merchantService.updateStatus(
        'DeACTIVE',
        '0x93902d47bE75950242D2557588cF45F0D3da2812'
      );

      expect(result).toEqual(deActiveMerchant);
      expect(merchantRepository.save).toHaveBeenCalled();
    });
  });
});
