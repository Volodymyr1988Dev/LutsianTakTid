import type { ProjectImage } from "./projectImages.type";
export interface Project {
  id: string;
  city: string;
  address: string;
  images?: ProjectImage[]
}
