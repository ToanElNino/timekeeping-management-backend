import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CurrencyConfig, Token} from '../../database/entities';
import {getConnection, Repository} from 'typeorm';

@Injectable()
export class CurrencyConfigService {
  constructor(
    @InjectRepository(CurrencyConfig)
    private readonly currencyConfigRepository: Repository<CurrencyConfig>
  ) {}

  async listCurrencyConfig() {
    return {};
  }
}
