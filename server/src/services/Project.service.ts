import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projects } from '../entities/project.entity';
import { ProjectExtraService } from './project-extra.service';
//import { ProjectImagesService } from './ProjectImages.service';
import { ProjectWithExtras } from '../types/projectWithExtras';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects, 'projects')
    private readonly projectRepo: Repository<Projects>,
    //private readonly imagesService: ProjectImagesService,
    private readonly projectExtraService: ProjectExtraService,
  ) {}

  async findAll(): Promise<Projects[]> {
    return this.projectRepo.find({
      relations: ['images'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ProjectWithExtras> /*Promise<Projects>*/ {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['images'], //['assignments', 'assignments.user', 'timeEntries'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const extraAssignments = await this.projectExtraService.getProjectExtras(id);

    const totalExtraHours = extraAssignments.reduce(
      (sum, item) => sum + Number(item.hours || 0),
      0,
    );

    return { ...project, extraAssignments, totalExtraHours }; //project;
  }
}
