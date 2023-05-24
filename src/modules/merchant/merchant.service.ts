/* eslint-disable @typescript-eslint/no-unused-vars */
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Merchant} from '../../database/entities';
import {Like, Repository} from 'typeorm';
import {IMerchant} from '../../database/interfaces/IMerchant.interface';
@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>
  ) {}

  async getAllMerchant() {
    const merchants = await this.merchantRepository.find();
    return merchants;
  }

  async getMerchantByMerchantAddress(merchant_wallet: string) {
    const merchant = await this.merchantRepository.findOne({
      where: {
        merchant_wallet: merchant_wallet,
      },
    });
    return merchant;
  }
  async getMerchantWithPage(
    limit: number,
    page: number,
    name: string,
    status: string
  ) {
    const take = limit || 10;
    const skip = (page - 1) * take;
    const merchants = await this.merchantRepository.findAndCount({
      take: take,
      skip: skip,
      where: {
        name: Like(`%${name || ''}%`),
        status: Like(`%${status || ''}%`),
      },
    });

    const total = await this.merchantRepository.count();
    return {
      result: merchants[0],
      total: total,
    };
  }

  async checkExistMerchant(merchant_wallet: string) {
    const merchant = await this.getMerchantByMerchantAddress(merchant_wallet);
    if (merchant) {
      return true;
    }
    return false;
  }

  async createMerchant(newMerchant: IMerchant) {
    const merchant = await this.merchantRepository.save(newMerchant);
    return merchant;
  }
  async updateMerchant(dataMerchant: IMerchant, merchant_wallet: string) {
    const merchant = await this.getMerchantByMerchantAddress(merchant_wallet);
    merchant.name = dataMerchant.name;
    merchant.avatar = dataMerchant.avatar;
    merchant.longitude = dataMerchant.longitude;
    merchant.latitude = dataMerchant.latitude;
    merchant.merchant_wallet = dataMerchant.merchant_wallet;
    merchant.address = dataMerchant.address;
    await this.merchantRepository.save(merchant);
    return merchant;
  }

  async updateStatus(newStatus: string, merchant_wallet: string) {
    const merchant = await this.getMerchantByMerchantAddress(merchant_wallet);
    merchant.status = newStatus;
    await this.merchantRepository.save(merchant);
    return merchant;
  }
}
