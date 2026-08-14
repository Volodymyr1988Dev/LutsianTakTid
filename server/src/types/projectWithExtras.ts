import { Projects } from '../entities/project.entity';
/*
import { ExternalProjectAssignment } from '../entities/external/external-project-assignment.entity';

export interface ProjectWithExtras extends Projects {
  extraAssignments: ExternalProjectAssignment[];
  totalExtraHours: number;
}
*/

export interface ProjectExtraAssignment {
  id: string;
  date: string;
  comment: string | null;
  hours: number;

  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ProjectWithExtras extends Projects {
  extraAssignments: ProjectExtraAssignment[];
  totalExtraHours: number;
}