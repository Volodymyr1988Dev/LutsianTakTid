import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProjectImages, getProjectImagesPaginated } from '../api/projectImages.api'
import type { ProjectImage } from '../types/projectImages.type'

export const useProjectImageStore = defineStore('projectImages', () => {
  const images = ref<ProjectImage[]>([])
  const loading = ref(false)
  const cache = new Map<string, ProjectImage[]>()
  const hasMore = ref(true)
  const pages = ref(1)

  async function load(projectId: string) {
    loading.value = true
    try {
      const { data } = await getProjectImages(projectId)
      images.value = data
    } finally {
      loading.value = false
    }
  }

  async function loadPaginated(
    projectId: string,
    page: number,
    limit: number,
  ) {
    const cacheKey = projectId

    if (page === 1 && cache.has(cacheKey)) {

      images.value = cache.get(cacheKey)!
      return {
        page: 1,
        lastPage: 1,
        data: images.value
      }

    }

    loading.value = true
    try {
      const { data } = await getProjectImagesPaginated(
        projectId,
        page,
        limit,
      )

      if (page === 1) {
        images.value = data.data
      } else {
        images.value.push(...data.data)
      }

      return data
    } finally {
      loading.value = false
    }
  }

  return {
    images,
    loading,
    load,
    loadPaginated,
  }
})