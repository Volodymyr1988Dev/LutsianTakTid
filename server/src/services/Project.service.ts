import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projects } from '../entities/project.entity';
//import { ProjectImagesService } from './ProjectImages.service';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects, 'projects')
    private readonly projectRepo: Repository<Projects>,
    //private readonly imagesService: ProjectImagesService,
  ) {}

  async findAll(): Promise<Projects[]> {
    return this.projectRepo.find({
      relations: ['images'],
      //order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Projects> {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['assignments', 'assignments.user', 'timeEntries'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }
}
