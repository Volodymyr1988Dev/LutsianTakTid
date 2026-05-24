import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from '../entities/project.entity';
import { ProjectsService } from '../services/Project.service';
import { ProjectsController } from '../controllers/Project.controller';
import { ProjectImage } from '../entities/projectImages.entity';
import { ProjectExtraService } from '../services/project-extra.service';
import { ExternalProjectAssignment } from '../entities/external/external-project-assignment.entity';
import { ExternalUser } from '../entities/external/external-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Projects, ProjectImage, ExternalProjectAssignment, ExternalUser], 'projects'), ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectExtraService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
