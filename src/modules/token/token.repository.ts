import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Token, TokenMultichain} from 'src/database/entities';
import {TokenRequest} from './request/TokenRequest.dto';
import {Chain} from '../../database/entities';
@Injectable()
export class TokenModuleRepository {
  constructor(
    @InjectRepository(Token)
    public readonly repositoryToken: Repository<Token>,
    @InjectRepository(TokenMultichain)
    public readonly repositoryTokenMultichain: Repository<TokenMultichain>,
    @InjectRepository(Chain)
    public readonly repositoryChain: Repository<Chain>
  ) {}
  async filterToken(offset: number, limit: number, tokenFilter: any) {
    const queryBuilder = this.repositoryToken
      .createQueryBuilder('token')
      .select([
        'token.id',
        'token.name',
        'token.status',
        'token.symbol',
        'token.isNativeToken',
        'token.type',
        'token.icon',
        'token.createdAt',
        'token.updatedAt',
      ])
      .orderBy('token.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);
    const queryCount = this.repositoryToken
      .createQueryBuilder('token')
      .select(' Count (1) as Total')
      .orderBy('token.createdAt', 'DESC');

    if (tokenFilter.name && tokenFilter.name !== '') {
      if (
        tokenFilter.name &&
        tokenFilter.name.includes('%') !== true &&
        tokenFilter.name.includes('_') !== true
      ) {
        queryBuilder.andWhere(`token.name like '%${tokenFilter.name.trim()}%'`);
        queryCount.andWhere(`token.name like '%${tokenFilter.name.trim()}%'`);
      } else {
        queryBuilder.andWhere(
          `token.name like '%!${tokenFilter.name.trim()}%' ESCAPE '!'`
        );
        queryCount.andWhere(
          `token.name like '%!${tokenFilter.name.trim()}%' ESCAPE '!'`
        );
      }
    }

    if (tokenFilter.status) {
      queryBuilder.andWhere('status=:status', {
        status: tokenFilter.status,
      });
      queryCount.andWhere('status=:status', {
        status: tokenFilter.status,
      });
    }

    if (tokenFilter.type) {
      queryBuilder.andWhere('type=:type', {
        type: tokenFilter.type,
      });
      queryCount.andWhere('type=:type', {
        type: tokenFilter.type,
      });
    }
    const tokens = await queryBuilder.getMany();

    const tokenFull = await Promise.all(
      tokens.map(async token => {
        const tokenId = token.id;
        const multichain = await this.repositoryTokenMultichain
          .createQueryBuilder('TokenMultichain')
          .innerJoin(Chain, 'chain', 'TokenMultichain.chainId = chain.id')
          .select(
            'TokenMultichain.id,' +
              'TokenMultichain.chain_id as chainId,' +
              'TokenMultichain.token_id as tokenId,' +
              'TokenMultichain.token_address as tokenAddress,' +
              'TokenMultichain.decimal,' +
              'TokenMultichain.created_at as createdAt,' +
              'TokenMultichain.updated_at as updatedAt,' +
              'chain.chain_name as chainName,' +
              'chain.icon'
          )
          .where('TokenMultichain.tokenId = :tokenId', {tokenId})
          .execute();
        return {...token, multichain: multichain};
      })
    );
    const tokensCountList = await queryCount.execute();
    return {tokens: tokenFull, tokensCountList};
  }
  async createTokenMultichain(data: TokenRequest) {
    const token = new Token();
    token.name = data.name;
    token.symbol = data.symbol;
    token.isNativeToken = data.isNativeToken;
    token.icon = data.icon;
    token.status = 'ACTIVE';
    token.type = 'DEFAULT';
    const tokenSave = await this.repositoryToken.save(token);

    const multichainJsonDatas: any = data.multichain;
    multichainJsonDatas.forEach(async items => {
      items.tokenId = tokenSave.id;
    });
    const multichains = multichainJsonDatas.map((item: any) => {
      const tokenMultichain = new TokenMultichain();
      tokenMultichain.tokenId = item.tokenId;
      tokenMultichain.tokenAddress = item.tokenAddress;
      tokenMultichain.chainId = item.chainId;
      tokenMultichain.decimal = item.decimal;
      return tokenMultichain;
    });
    await this.repositoryTokenMultichain.save(multichains);
    return {token, multichains};
  }
}
