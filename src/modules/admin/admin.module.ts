import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../auth/auth.module';
import {JwtModule} from '@nestjs/jwt';
import {AdminService} from './admin.service';
import {AuthService} from '../auth/auth.service';
import {AdminController} from './admin.controller';
import {Account} from 'src/database/entities';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: 24 * 60 * 60 },
    }),
    TypeOrmModule.forFeature([Account]),
  ],
  controllers: [AdminController],
  providers: [AdminService, AuthService],
})
export class AdminModule {}
