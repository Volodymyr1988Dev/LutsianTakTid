<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '../stores/project.store'

const router = useRouter()
const store = useProjectStore()

onMounted(() => {
  store.load()
})

function openProject(id: string) {
  router.push(`/projects/${id}`)
}
</script>

<template>
  <div class="projects">

    <h1>Projects</h1>

    <div class="grid">

      <div
        v-for="p in store.projects"
        :key="p.id"
        class="project-card"
        @click="openProject(p.id)"
      >
        <h3>{{ p.city }}</h3>
        <p>{{ p.address }}</p>
      </div>

    </div>

  </div>
</template>