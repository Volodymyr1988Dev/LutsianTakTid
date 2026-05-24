import type { ProjectImage } from "./projectImages.type";

export interface ExtraAssignment {
  id: string
  date: string
  hours: number
  comment?: string

  user: {
    id: string
    name: string
    email: string
  }
}
export interface Project {
  id: string;
  city: string;
  address: string;
  images?: ProjectImage[]
  extraAssignments?: ExtraAssignment[]
  totalExtraHours?: number
}

