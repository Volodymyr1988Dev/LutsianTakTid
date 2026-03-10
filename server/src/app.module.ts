import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './modules/Project.module';
import { AuthModule } from './modules/Auth.module';
import { ProjectImagesModule } from './modules/ProjectImage.module';
import { mainDbConfig, projectsDbConfig } from './config/typeorm.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthGuard } from './types/guard';
import { join } from 'path';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      exclude: ['/api*'],
      serveRoot: '/',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(mainDbConfig),
    TypeOrmModule.forRoot(projectsDbConfig),
    ProjectsModule,
    AuthModule,
    ProjectImagesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      //useClass: AuthGuard,
      useExisting: AuthGuard,
    },
  ],
})
export class AppModule {}
