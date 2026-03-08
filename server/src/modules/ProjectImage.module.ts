import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from '../entities/project.entity';
import { ProjectImage } from '../entities/projectImages.entity';
import { ProjectImagesController } from '../controllers//ProjectImages.controller';
import { ProjectImagesService } from '../services/ProjectImages.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectImage, Projects], 'projects')],
  providers: [ProjectImagesService],
  controllers: [ProjectImagesController],
  exports: [ProjectImagesService],
})
export class ProjectImagesModule {}
