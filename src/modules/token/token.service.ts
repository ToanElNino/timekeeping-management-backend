import {HttpCode, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Token, TokenMultichain} from '../../database/entities';
import {PageOptionsDto} from '../../shared/Request/baseRequest.dto';
import {
  getArrayPaginationBuildTotal,
  getOffset,
  nowInMillis,
} from '../../shared/Utils';
import {IPaginationOptions} from 'nestjs-typeorm-paginate';
import {TokenUpdateStatus} from './request/UpdateStatus.dto';
import {TokenFilterRequest} from './request/TokenFilterRequest.dto';
import {TokenModuleRepository} from './token.repository';
import {Causes} from 'src/config/exception/causes';
import {TokenRequest} from './request/TokenRequest.dto';
import {Admin} from '../../database/entities';
import {Exception} from 'handlebars';
import {TokenUpdateRequestMultichain} from './request/TokenUpdateRequestMultichain.dto';
@Injectable()
export class TokenService {
  constructor(private readonly tokenModuleRepository: TokenModuleRepository) {}
  async getTokens(
    pageOptions: PageOptionsDto,
    tokenFilter: TokenFilterRequest
  ) {
    const offset = getOffset(pageOptions as IPaginationOptions);
    const limit = Number(pageOptions.limit);
    const {tokens, tokensCountList} =
      await this.tokenModuleRepository.filterToken(offset, limit, tokenFilter);
    const {items, meta} = getArrayPaginationBuildTotal<Token>(
      tokens,
      tokensCountList,
      pageOptions
    );

    return {
      results: items,
      pagination: meta,
    };
  }

  async updateStatus(id: number, data: TokenUpdateStatus) {
    const token = await this.tokenModuleRepository.repositoryToken.findOne({
      where: {
        id: id,
      },
    });
    token.status = data.status;
    return this.tokenModuleRepository.repositoryToken.save(token);
  }

  async checkChainExist(chainId: number) {
    const chain = await this.tokenModuleRepository.repositoryChain.findOne({
      where: {
        id: chainId,
      },
    });
    if (chain) return true;
    return false;
  }

  async checkTokenExist(id: number) {
    const chain = await this.tokenModuleRepository.repositoryToken.findOne({
      where: {
        id: id,
      },
    });
    if (chain) return true;
    return false;
  }
  async createTokenMultichain(data: TokenRequest) {
    const token = new Token();
    token.name = data.name;
    token.symbol = data.symbol;
    token.isNativeToken = data.isNativeToken;
    token.icon = data.icon;
    token.status = 'ACTIVE';
    token.type = 'DEFAULT';

    const multichainJsonDatas: any = data.multichain;
    for (let i = 0; i < multichainJsonDatas.length; i++) {
      const item = multichainJsonDatas[i];
      const checkChainExist = await this.checkChainExist(item.chainId);
      if (!checkChainExist) {
        throw new HttpException('Chain not found', HttpStatus.NOT_FOUND);
      }
    }
    return this.tokenModuleRepository.createTokenMultichain(data);
  }

  async update(idToken: number, data: TokenRequest) {
    const checkTokenExist = await this.checkTokenExist(idToken);
    if (!checkTokenExist) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }
    const token = await this.tokenModuleRepository.repositoryToken.findOne({
      where: {
        id: idToken,
      },
    });
    token.name = data.name;
    token.symbol = data.symbol;
    token.isNativeToken = data.isNativeToken;
    token.icon = data.icon;
    token.type = 'DEFAULT';
    token.updatedAt = nowInMillis();

    const multichainJsonDatas: any = data.multichain;
    for (let i = 0; i < multichainJsonDatas.length; i++) {
      const item = multichainJsonDatas[i];
      const checkChainExist = await this.checkChainExist(item.chainId);
      if (!checkChainExist) {
        throw new HttpException('Chain not found', HttpStatus.NOT_FOUND);
      }
    }
    const tokenSave = await this.tokenModuleRepository.repositoryToken.save(
      token
    );
    multichainJsonDatas.forEach(async items => {
      items.tokenId = tokenSave.id;
    });
    await this.tokenModuleRepository.repositoryTokenMultichain.delete({
      tokenId: idToken,
    });
    const multichains = multichainJsonDatas.map((item: any) => {
      const tokenMultichain = new TokenMultichain();
      tokenMultichain.tokenId = item.tokenId;
      tokenMultichain.tokenAddress = item.tokenAddress;
      tokenMultichain.chainId = item.chainId;
      tokenMultichain.decimal = item.decimal;
      return tokenMultichain;
    });
    await this.tokenModuleRepository.repositoryTokenMultichain.save(
      multichains
    );
    return {token, multichains};
  }
}
