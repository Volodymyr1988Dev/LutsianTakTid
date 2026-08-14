import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExternalProjectAssignment } from '../entities/external/external-project-assignment.entity';
import { ProjectExtraAssignment } from '../types/projectWithExtras';

@Injectable()
export class ProjectExtraService {
  constructor(
    @InjectRepository(
      ExternalProjectAssignment,
      'projects',
    )
    private readonly assignmentRepo: Repository<ExternalProjectAssignment>,
  ) {}

  async getProjectExtras(projectId: string) : Promise<ProjectExtraAssignment[]> {
    //return 
    const assignments = await this.assignmentRepo.find({
      where: { projectId },

      relations: ['user'],

      order: {
        date: 'DESC',
      },
    });

      return assignments.map((item) => ({
        id: item.id,
        date: item.date,
        comment: item.comment,
        hours: Number(item.hours),
        user: {
          id: item.user?.id,
          name: item.user?.name,
          email: item.user?.email,
        },
      }));
    }
}