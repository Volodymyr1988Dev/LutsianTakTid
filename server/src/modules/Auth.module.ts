import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from '../services/Auth.service';
import { AuthController } from '../controllers/Auth.controller';
import { UserModule } from './User.module';
import { SessionModule } from './Session.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    SessionModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret = configService.get<string>('SECRET');

        if (!secret) {
          throw new Error('SECRET is not defined');
        }

        return {
          secret,
          signOptions: {
            expiresIn: configService.get('EXPIRES_AT') ?? '30d',
          },
        };
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
