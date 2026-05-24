import api from './axios'
import type { Project } from '../types/Project.dto'

export async function getProjects(): Promise<Project[]> {
  const { data } = await api.get<Project[]>('/projects')
  return data
}

export async function getProjectById(id: string) {
  const { data } = await api.get<Project>(`/projects/${id}`)
  return data
}