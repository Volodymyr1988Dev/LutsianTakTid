import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../controllers/User.controller';
import { User } from '../entities/user.entity';
import { UserService } from '../services/User.service';
@Module({
  imports: [TypeOrmModule.forFeature([User], 'main')],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
