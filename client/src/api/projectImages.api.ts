import api from './axios'
import type { ProjectImage } from '../types/projectImages.type'

export interface PaginatedImagesResponse {
  data: ProjectImage[]
  total: number
  page: number
  lastPage: number
}

export function getProjectImages(projectId: string) {
  return api.get<ProjectImage[]>(
    `/project-images/project/${projectId}`,
  )
}

export function getProjectImagesPaginated(
  projectId: string,
  page: number,
  limit: number,
) {
  return api.get<PaginatedImagesResponse>(
    `/project-images/project/${projectId}?page=${page}&limit=${limit}`,
  )
}