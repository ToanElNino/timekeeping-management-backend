import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Event, Tenant} from 'src/database/entities';
import {AuthModule} from '../auth/auth.module';
import {JwtModule} from '@nestjs/jwt';
import {TenantService} from './tenant.service';
import {TenantController} from './tenant.controller';
@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: 24 * 60 * 60 },
    }),
    TypeOrmModule.forFeature([Tenant]),
  ],
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}
