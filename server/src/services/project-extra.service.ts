import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExternalProjectAssignment } from '../entities/external/external-project-assignment.entity';

@Injectable()
export class ProjectExtraService {
  constructor(
    @InjectRepository(
      ExternalProjectAssignment,
      'projects',
    )
    private readonly assignmentRepo: Repository<ExternalProjectAssignment>,
  ) {}

  async getProjectExtras(projectId: string) {
    return this.assignmentRepo.find({
      where: { projectId },

      relations: ['user'],

      order: {
        date: 'DESC',
      },
    });
  }
}