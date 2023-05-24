import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Repository, getConnection} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {ChangeWalletStatusReq} from './request/change-wallet-status';
import {CreateSystemWalletReq} from './request/create-system-wallet';
import {KmsService} from '../common/kms.service';
import {SystemWallet} from '../../database/entities';
import {
  getArrayPaginationBuildTotal,
  getOffset,
  nowInMillis,
} from '../../../src/shared/Utils';
import {PaginationResponse} from '../../../src/config/rest/paginationResponse';
import {Causes} from '../../../src/config/exception/causes';
import {SystemWalletRepository} from './system-wallet.repository';
@Injectable()
export class SystemWalletService {
  constructor(
    private systemWalletRepo: SystemWalletRepository,
    private kmsService: KmsService
  ) {}
  async getListSystemWallet(
    params,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<SystemWallet>> {
    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);

    const {data, countData} = await this.systemWalletRepo.systemWalletFilter(
      offset,
      limit,
      params
    );
    const {items, meta} = getArrayPaginationBuildTotal<SystemWallet>(
      data,
      countData,
      paginationOptions
    );
    return {
      results: items,
      pagination: meta,
    };
  }

  async getASystemWallet(system_wallet: string, chain_id: number) {
    const item: SystemWallet = await this.systemWalletRepo.findOne({
      where: {
        systemWallet: system_wallet,
        chainId: chain_id,
      },
    });
    // console.log('item: ', item);
    return item;
  }

  async createNewSystemWallet(body: CreateSystemWalletReq) {
    // const newPrivatedKey = await argon2.hash(body.systemWallet);
    // const record = await this.kmsCmkRepository.findOne({
    //   id,
    // });
    const newPrivateKey = await this.kmsService.encrypt(body.systemWallet, '');
    if (!newPrivateKey)
      throw Causes.CANNOT_CREATE_SYSTEM_WALLET_DUE_TO_KMS_FAILED;
    // console.log('newPrivateKey: ', newPrivateKey);
    const newItem: Partial<SystemWallet> = {
      chainId: body.chainId,
      systemWallet: body.systemWallet,
      privateKey: newPrivateKey,
      name: body.name,
      status: 'ACTIVE',
      createdAt: nowInMillis(),
      updatedAt: nowInMillis(),
    };
    const insertItem = await this.systemWalletRepo.save(newItem);
    if (insertItem) {
      delete insertItem.privateKey;
      return insertItem;
    }
    throw Causes.CANNOT_CREATE_WALLET_DUE_TO_SAVE_REPOSITORY;
  }
  async changeStatus(body: ChangeWalletStatusReq) {
    // return 1;
    const item: SystemWallet = await this.systemWalletRepo.findOne({
      where: {
        systemWallet: body.systemWallet,
        chainId: body.chainId,
      },
    });
    // return 1;
    // console.log('item: ', item);
    if (!item) {
      throw Causes.CANNOT_UPDATE_STATUS_DUE_TO_ITEM_NOT_FOUND;
    }
    if (item.status === body.newStatus) {
      throw Causes.CANNOT_UPDATE_STATUS_DUE_TO_SAME_OLD_STATUS;
    }
    if (body.newStatus !== 'ACTIVE' && body.newStatus !== 'INACTIVE') {
      throw Causes.CANNOT_UPDATE_STATUS_DUE_TO_INVALID_STATUS;
    }
    item.status = body.newStatus;
    const updateItem = await this.systemWalletRepo.save(item);
    if (updateItem) {
      delete updateItem.privateKey;
      return updateItem;
    }
    throw Causes.CANNOT_UPDATE_STATUS_DUE_TO_SAVE_REPOSITORY;
  }
}
