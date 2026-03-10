<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectImageStore } from '../stores/projectImages.store'
import LazyImage from '../components/ui/LazyImage.vue'

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

  preloadImages(imageStore.images.map(i => i.url))

}

function preloadImages(urls: string[]) {

  urls.slice(0, 4).forEach(url => {

    const img = new Image()
    img.src = url

  })

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

<div class="images-page">

<h1>Project images</h1>

<div class="grid">

  <div
    v-for="img in imageStore.images"
    :key="img.id"
    class="image-wrapper"
    @click="openImage(img.url)"
  >

    <LazyImage
      :src="img.url"
      class="image"
    />

  </div>

</div>

<div
  v-if="imageStore.loading"
  class="loading"
>
  Loading images...
</div>

<div
  ref="sentinel"
  class="sentinel"
/>

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

.images-page {

  max-width: 1300px;

  margin: auto;

  padding: 24px;

}

.grid {

  display: grid;

  grid-template-columns: repeat(auto-fill,minmax(240px,1fr));

  gap: 16px;

}

.image-wrapper {
  overflow: hidden;
  border-radius: 12px;
  background: #eee;
  aspect-ratio: 4 / 3;
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}

.image {

  width: 100%;

  height: 100%;

  object-fit: cover;

  cursor: zoom-in;

  transition: transform .3s ease;

}

.image:hover {

  transform: scale(1.08);

}

.loading {

  text-align: center;

  padding: 30px;

}

.sentinel {

  height: 1px;

}

.modal {

  position: fixed;

  inset: 0;

  background: rgba(0,0,0,.85);

  display: flex;

  align-items: center;

  justify-content: center;

  z-index: 1000;

}

.modal-image {

  max-width: 95%;

  max-height: 95%;

  border-radius: 12px;

}

</style>