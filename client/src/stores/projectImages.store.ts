import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProjectImagesPaginated } from '../api/projectImages.api'
import type { ProjectImage } from '../types/projectImages.type'

export const useProjectImageStore = defineStore('projectImages', () => {
  const images = ref<ProjectImage[]>([])
  const loading = ref(false)
  const page = ref(1)
  const hasMore = ref(true)
  const currentProjectId = ref<string | null>(null)
  async function fetchNext(projectId: string) {
     if (currentProjectId.value !== projectId) {
      images.value = []
      page.value = 1
      hasMore.value = true
      currentProjectId.value = projectId
    }
    if (loading.value || !hasMore.value) return
    loading.value = true
    try {
      const { data } = await getProjectImagesPaginated(
        projectId,
        page.value,
        12
      )
      images.value.push(...data.data)

      if (page.value >= data.lastPage) {
        hasMore.value = false
      }
      page.value++
    } finally {
      loading.value = false
    }

  }

  function reset() {

    images.value = []
    page.value = 1
    hasMore.value = true
    currentProjectId.value = null
  }

  return {
    images,
    loading,
    page,
    hasMore,
    fetchNext,
    reset
  }

})