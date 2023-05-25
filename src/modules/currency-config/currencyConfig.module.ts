import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CurrencyConfig, Token} from '../../database/entities';
import {CurrencyConfigService} from './currencyConfig.service';
import {CurrencyConfigController} from './currencyConfig.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Token, CurrencyConfig])],
  providers: [CurrencyConfigService],
  controllers: [CurrencyConfigController],
})
export class CurrencyConfigModule {}
