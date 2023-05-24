import {Module} from '@nestjs/common';
import {EventController} from './event.controller';
import {EventService} from './event.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Event} from 'src/database/entities';
import {EventRepository} from './event.repository';
import {AuthModule} from '../auth/auth.module';
import {JwtModule} from '@nestjs/jwt';
@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: 24 * 60 * 60 },
    }),
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository],
})
export class EventModule {}
