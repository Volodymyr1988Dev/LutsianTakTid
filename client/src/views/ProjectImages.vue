<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectImageStore } from '../stores/projectImages.store'

const route = useRoute()
const router = useRouter()
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

function goBack() {
  router.push('/projects')
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

<button class="back-button" @click="goBack">

<span class="arrow">←</span>
Back

</button>

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

<div
v-if="imageStore.loading"
v-for="i in 8"
:key="'skeleton'+i"
class="skeleton"
/>

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

/* PAGE */

.page {

min-height: 100vh;

background: #0e0e0e;

color: white;

display: flex;

flex-direction: column;

align-items: center;

padding: 30px;

}

/* TITLE */

.title {

font-size: 28px;

font-weight: 700;

margin-bottom: 24px;

text-align: center;

}

/* BACK BUTTON */

.back-button {

position: fixed;

top: 20px;

left: 20px;

display: flex;

align-items: center;

gap: 8px;

background: rgba(255,255,255,0.1);

color: white;

border: none;

padding: 10px 16px;

border-radius: 12px;

cursor: pointer;

font-size: 14px;

backdrop-filter: blur(10px);

transition: all .2s;

z-index: 1000;

}

.back-button:hover {

background: rgba(255,255,255,0.2);

transform: translateY(-2px);

}

.arrow {

font-size: 18px;

}

/* MASONRY */

.masonry {

max-width: 1300px;

width: 100%;

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

background: #1c1c1c;

box-shadow: 0 6px 18px rgba(0,0,0,0.5);

transition: transform .25s ease,
box-shadow .25s ease;

}

.card:hover {

transform: translateY(-5px);

box-shadow: 0 12px 30px rgba(0,0,0,0.8);

}

/* IMAGE */

.image {

width: 100%;

display: block;

object-fit: cover;

transition: transform .35s ease;

}

.card:hover .image {

transform: scale(1.05);

}

/* SKELETON */

.skeleton {

height: 220px;

border-radius: 14px;

margin-bottom: 16px;

background: linear-gradient(
90deg,
#1c1c1c 25%,
#2a2a2a 37%,
#1c1c1c 63%
);

background-size: 400% 100%;

animation: skeleton 1.4s ease infinite;

}

@keyframes skeleton {

0% { background-position: 100% 50% }
100% { background-position: 0 50% }

}

/* MODAL */

.modal {

position: fixed;

inset: 0;

background: rgba(0,0,0,0.92);

display: flex;

align-items: center;

justify-content: center;

z-index: 2000;

backdrop-filter: blur(8px);

}

.modal-image {

max-width: 95%;

max-height: 95%;

border-radius: 12px;

box-shadow: 0 20px 60px rgba(0,0,0,0.9);

}

/* SENTINEL */

.sentinel {

height: 1px;

}

</style>