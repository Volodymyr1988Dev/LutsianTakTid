import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectImage } from '../entities/projectImages.entity';
import { Projects } from '../entities/project.entity';

@Injectable()
export class ProjectImagesService {
  constructor(
    @InjectRepository(ProjectImage, 'projects')
    private readonly imageRepo: Repository<ProjectImage>,

    @InjectRepository(Projects, 'projects')
    private readonly projectRepo: Repository<Projects>,
  ) {}

  async getByProject(projectId: string, page: number, limit: number) {
    const [data, total] = await this.imageRepo.findAndCount({
      where: { project: { id: projectId } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
