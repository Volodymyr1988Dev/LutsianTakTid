import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from '../entities/project.entity';
import { ProjectsService } from '../services/Project.service';
import { ProjectsController } from '../controllers/Project.controller';
import { ProjectImage } from '../entities/projectImages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Projects, ProjectImage], 'projects')],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
