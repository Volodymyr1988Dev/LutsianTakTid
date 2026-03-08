import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './modules/Project.module';
import { AuthModule } from './modules/Auth.module';
import { ProjectImagesModule } from './modules/ProjectImage.module';
import { mainDbConfig, projectsDbConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(mainDbConfig),
    TypeOrmModule.forRoot(projectsDbConfig),
    ProjectsModule,
    AuthModule,
    ProjectImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
