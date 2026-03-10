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
        <div class="title">
          {{ p.city }} — {{ p.address }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>

.projects {

  max-width: 1200px;

  margin: auto;

  padding: 24px;

}

.grid {

  display: grid;

  grid-template-columns: repeat(auto-fill,minmax(260px,1fr));

  gap: 20px;

}

.project-card {

  padding: 22px;

  border-radius: 14px;

  background: white;

  cursor: pointer;

  box-shadow: 0 6px 20px rgba(0,0,0,0.08);

  transition: all .25s ease;

}

.project-card:hover {

  transform: translateY(-4px);

  box-shadow: 0 12px 30px rgba(0,0,0,0.15);

}

.title {

  font-size: 16px;

  font-weight: 600;

  color: #333;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

}

</style>