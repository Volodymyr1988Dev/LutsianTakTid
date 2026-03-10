<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectImageStore } from '../stores/projectImages.store'

const route = useRoute()
const imageStore = useProjectImageStore()

const projectId = route.params.id as string

const sentinel = ref<HTMLElement | null>(null)
const selectedImage = ref<string | null>(null)

let observer: IntersectionObserver | null = null

async function loadMore() {

  if (imageStore.loading) return

  await imageStore.loadPaginated(
    projectId,
    Math.floor(imageStore.images.length / 12) + 1,
    12
  )

}

function openImage(url: string) {
  selectedImage.value = url
}

function closeModal() {
  selectedImage.value = null
}

onMounted(async () => {

  await loadMore()
  await nextTick()

  observer = new IntersectionObserver(entries => {

    if (entries[0]?.isIntersecting) {
      loadMore()
    }

  })

  if (sentinel.value) {
    observer.observe(sentinel.value)
  }

})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>

<div class="page">

<h1 class="title">Project Images</h1>

<div class="masonry">

  <div
    v-for="img in imageStore.images"
    :key="img.id"
    class="card"
    @click="openImage(img.url)"
  >

    <img
      :src="img.url"
      loading="lazy"
      class="image"
    />

  </div>

</div>

<div v-if="imageStore.loading" class="loading">
  Loading images...
</div>

<div ref="sentinel" class="sentinel"></div>

<div
  v-if="selectedImage"
  class="modal"
  @click="closeModal"
>

  <img
    :src="selectedImage"
    class="modal-image"
  />

</div>

</div>

</template>

<style scoped>

.page {

  max-width: 1400px;

  margin: auto;

  padding: 24px;

}

.title {

  font-size: 28px;

  font-weight: 700;

  margin-bottom: 24px;

  text-align: center;

}

/* MASONRY GRID */

.masonry {

  column-count: 4;

  column-gap: 16px;

}

@media (max-width: 1200px) {

  .masonry {
    column-count: 3;
  }

}

@media (max-width: 800px) {

  .masonry {
    column-count: 2;
  }

}

@media (max-width: 500px) {

  .masonry {
    column-count: 1;
  }

}

/* CARD */

.card {

  break-inside: avoid;

  margin-bottom: 16px;

  border-radius: 14px;

  overflow: hidden;

  cursor: zoom-in;

  background: #eee;

  box-shadow: 0 6px 20px rgba(0,0,0,0.12);

  transition: transform .25s ease,
              box-shadow .25s ease;

}

.card:hover {

  transform: translateY(-4px);

  box-shadow: 0 12px 30px rgba(0,0,0,0.18);

}

/* IMAGE */

.image {

  width: 100%;

  display: block;

  object-fit: cover;

  filter: blur(6px);

  transform: scale(1.02);

  transition: filter .4s ease,
              transform .4s ease;

}

.image[src] {

  filter: blur(0);

}

/* LOADING */

.loading {

  text-align: center;

  padding: 40px;

  font-size: 18px;

  color: #666;

}

/* SENTINEL */

.sentinel {

  height: 1px;

}

/* MODAL */

.modal {

  position: fixed;

  inset: 0;

  background: rgba(0,0,0,.9);

  display: flex;

  align-items: center;

  justify-content: center;

  z-index: 2000;

  backdrop-filter: blur(8px);

}

.modal-image {

  max-width: 92%;

  max-height: 92%;

  border-radius: 12px;

  box-shadow: 0 20px 60px rgba(0,0,0,0.6);

}

</style>