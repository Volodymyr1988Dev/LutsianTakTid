import { Projects } from '../entities/project.entity';
import { ExternalProjectAssignment } from '../entities/external/external-project-assignment.entity';

export interface ProjectWithExtras extends Projects {
  extraAssignments: ExternalProjectAssignment[];
  totalExtraHours: number;
}