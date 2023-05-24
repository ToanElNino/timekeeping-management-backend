import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {ChainRepository} from './chain.repository';
import {PaginationResponse} from 'src/config/rest/paginationResponse';
import {Chain} from 'src/database/entities/Chain.entity';
import {
  getArrayPaginationBuildTotal,
  getOffset,
  nowInMillis,
} from 'src/shared/Utils';
import {CreateChainRequest} from './request/CreateChainRequest.dto';
import {S3Handler} from 'src/shared/S3Handler';
import {UpdateStatusChainReq} from './request/UpdateStatusChainRequest.dto';

@Injectable()
export class ChainService {
  constructor(
    private chainRepo: ChainRepository,
    private readonly s3Handler: S3Handler
  ) {}
  async getListChain(
    params,
    paginationOptions: IPaginationOptions
  ): Promise<PaginationResponse<Chain>> {
    const offset = getOffset(paginationOptions);
    const limit = Number(paginationOptions.limit);
    const {data, countData} = await this.chainRepo.getListChain(
      offset,
      limit,
      params
    );
    const {items, meta} = getArrayPaginationBuildTotal<Chain>(
      data,
      countData,
      paginationOptions
    );
    return {
      results: items,
      pagination: meta,
    };
  }

  async createNewChain(
    iconFile: Express.Multer.File | null,
    body: CreateChainRequest
  ) {
    const chainDB = await this.chainRepo.findOne({
      where: {
        id: body.id,
      },
    });
    if (chainDB)
      throw new HttpException('Chain id existed', HttpStatus.BAD_REQUEST);
    let iconUrl = null;
    if (iconFile) {
      const s3Response = await this.s3Handler.upload('velo-orbit', iconFile);
      if (s3Response?.Location) iconUrl = s3Response?.Location;
      if (iconFile && !s3Response?.Location) {
        throw new HttpException(
          'Image icon upload error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
    const res = await this.chainRepo.createChain(iconUrl, body);
    return res;
  }

  async updateChain(iconFile: Express.Multer.File, body: CreateChainRequest) {
    const chainDB = await this.chainRepo.findOne({
      where: {
        id: body.id,
      },
    });
    if (!chainDB)
      throw new HttpException(
        'Chain id does not exist',
        HttpStatus.BAD_REQUEST
      );
    //if wanted to update avatar
    if (iconFile) {
      const s3Response = await this.s3Handler.upload('velo-orbit', iconFile);
      if (s3Response?.Location) chainDB.icon = s3Response?.Location;
      if (iconFile && !s3Response?.Location) {
        throw new HttpException(
          'Image icon upload error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
    chainDB.chainName = body.chainName;
    chainDB.symbol = body.symbol;
    chainDB.explorerEndpoint = body.explorerEndpoint;
    chainDB.scanApi = body.scanApi;
    chainDB.status = 'ACTIVE';
    chainDB.rpcEndpoint = body.rpcEndpoint;
    chainDB.updatedAt = nowInMillis();
    const res = await this.chainRepo.save(chainDB);
    return res;
  }

  async updateStatus(id: number, body: UpdateStatusChainReq) {
    if (body.status !== 'ACTIVE' && body.status !== 'INACTIVE') {
      throw new HttpException('Invalid status', HttpStatus.BAD_REQUEST);
    }
    const chainDB = await this.chainRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!chainDB)
      throw new HttpException(
        'Chain id does not exist',
        HttpStatus.BAD_REQUEST
      );
    if (chainDB.status === body.status) {
      throw new HttpException('Same old status', HttpStatus.BAD_REQUEST);
    }
    chainDB.status = body.status;
    chainDB.updatedAt = nowInMillis();
    const res = await this.chainRepo.save(chainDB);
    return res;
  }
}
