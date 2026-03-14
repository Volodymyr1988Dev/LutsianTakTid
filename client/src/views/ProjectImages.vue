<script setup lang="ts">

import { ref, onMounted, onBeforeUnmount, nextTick, watch/*, computed*/ } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectImageStore } from '../stores/projectImages.store'

import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const route = useRoute()
const router = useRouter()

const store = useProjectImageStore()

const projectId = ref(route.params.id as string)
const loadedImages = ref<Set<string>>(new Set())
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const selectedIndex = ref<number | null>(null)

const touchStartY = ref(0)
const touchEndY = ref(0)

//const scrollY = ref(0)
//const viewportHeight = ref(window.innerHeight)
/* ---------- LOAD MORE ---------- */
/*
function handleScroll(){

  scrollY.value = window.scrollY

}*/
function onImageLoad(id: string) {
  loadedImages.value.add(id)
}
let loadingLock = false

async function loadMore(){

if(loadingLock) return

loadingLock = true

await store.fetchNext(projectId.value)

loadingLock = false

}

/* ---------- OBSERVER ---------- */

function createObserver() {

  observer = new IntersectionObserver(

    (entries) => {

      if (!entries[0] || !entries[0].isIntersecting) return

      if (store.loading) return

      loadMore()

    },

    {
      rootMargin: '600px'
    }

  )

  if (sentinel.value) {
    observer.observe(sentinel.value)
  }

}

/* ---------- PROJECT CHANGE ---------- */

watch(

  () => route.params.id,

  async (newId) => {

    //if (!newId) return
    if (!newId || newId === projectId.value) return
    projectId.value = newId as string

    /* RESET STORE */

    //store.reset()

    observer?.disconnect()

    await loadMore()

    await nextTick()

    createObserver()

  }

)

/* ---------- LIFECYCLE ---------- */

onMounted(async () => {

  //window.addEventListener('scroll', handleScroll)
  await loadMore()

  await nextTick()

  createObserver()

})

onBeforeUnmount(() => {

  observer?.disconnect()
  //window.removeEventListener('scroll', handleScroll)
})
/*
const visibleImages = computed(()=>{

  const start = Math.floor(scrollY.value / 300) * 4
  const end = start + 40

  return store.images.slice(start,end)

})*/
/* ---------- MODAL ---------- */

function openImage(index: number) {

  selectedIndex.value = index
  document.body.style.overflow = 'hidden'

}

function closeModal() {

  selectedIndex.value = null
  document.body.style.overflow = ''

}

/* ---------- TOUCH CLOSE ---------- */

function touchStart(e: TouchEvent) {
  if (!e.touches[0]) return
  touchStartY.value = e.touches[0].clientY

}

function touchMove(e: TouchEvent) {
  if (!e.touches[0]) return
  touchEndY.value = e.touches[0].clientY

  if (touchEndY.value - touchStartY.value > 120) {
    closeModal()
  }

}

/* ---------- NAVIGATION ---------- */

function goBack() {

  router.push('/projects')

}

</script>


<template>

<div class="page" :key="projectId">

<button
class="back"
@click="goBack"
>
← Back
</button>

<h1 class="title">
Project Images
</h1>


<!-- IMAGE GRID -->

<div class="masonry">

<div
v-for="(img,index) in store.images /*visibleImages store.images*/"
:key="img.id/* + projectId*/"
class="card"
@click="openImage(index)"
>
<img
:src="img.url"
loading="lazy"
decoding="async"
:class="['image', { loaded: loadedImages.has(img.id) }]"
fetchpriority="low"
@load="onImageLoad(img.id)"
/>
<div
v-if="!loadedImages.has(img.id)"
class="skeleton"
/>
<!--skeleton card loading-->
</div>

</div>


<div
ref="sentinel"
class="sentinel"
/>


<!-- MODAL GALLERY -->

<div
v-if="selectedIndex !== null"
class="modal"
@click.self="closeModal"
@touchstart="touchStart"
@touchmove="touchMove"
>

<Swiper
:initial-slide="selectedIndex"
space-between="20"
:slides-per-view="1"
class="swiper"
>

<SwiperSlide
v-for="img in store.images"
:key="img.id"
>

<img
:src="img.url"
class="modal-image"
/>

</SwiperSlide>

</Swiper>

</div>

</div>

</template>



<style scoped>

/* PAGE */

.page{

min-height:100vh;

padding:30px;

background:var(--bg);

color:var(--text);

display:flex;

flex-direction:column;

align-items:center;

}


/* TITLE */

.title{

font-size:28px;

font-weight:700;

margin-bottom:28px;

}


/* BACK BUTTON */

.back{

position:fixed;

top:20px;
left:20px;

padding:10px 16px;

border-radius:12px;

border:none;

cursor:pointer;

background:var(--card);

box-shadow:0 6px 20px var(--shadow);

font-weight:600;

transition:all .2s;

z-index: 3000;
}

.back:hover{

transform:translateY(-2px);

}


/* MASONRY GRID */

.masonry{

max-width:1300px;

width:100%;

column-count:4;

column-gap:16px;

}


@media(max-width:1100px){

.masonry{
column-count:3;
}

}


@media(max-width:700px){

.masonry{
column-count:2;
}

}


/* IMAGE CARD */

.card{ position:relative;

break-inside:avoid;

margin-bottom:16px;

border-radius:14px;

overflow:hidden;

cursor:pointer;

box-shadow:0 6px 18px var(--shadow);

transition:transform .25s,
/*box-shadow .25s;*/

}

.card:hover{

transform:translateY(-5px);

box-shadow:0 16px 40px var(--shadow);

}
/*
.card.loading {
height:250px;
background:linear-gradient(
90deg,
#1a1a1a 25%,
#2a2a2a 37%,
#1a1a1a 63%
);
background-size:400% 100%;
animation:skeleton 1.4s infinite;
}*/
.skeleton{
position:absolute;
inset:0;

min-height:220px;

background:linear-gradient(
90deg,
var(--skeleton-1) 25%,
var(--skeleton-2) 37%,
var(--skeleton-1) 63%
/*
#1a1a1a 25%,
#2a2a2a 37%,
#1a1a1a 63%*/
);

background-size:400% 100%;
animation:skeleton 1.4s infinite;
}

@keyframes skeleton{
0%{background-position:-200px 0}
100%{background-position:200px 0}
}

/* IMAGE */

.image{

width:100%;

display:block;

object-fit:cover;

/*transition:transform .35s ease;*/
transition:opacity .4s ease, transform .35s ease;
opacity:0;
}
.image.loaded{
opacity:1;
}
.card:hover .image{

transform:scale(1.05);

}


/* MODAL */

.modal{

position:fixed;

inset:0;

background:rgba(0,0,0,.92);

display:flex;

align-items:center;

justify-content:center;

z-index:2000;

}


/* MODAL IMAGE */

.modal-image{

width:100vw;

height:100vh;

object-fit: contain;

border-radius:14px;

box-shadow:0 20px 60px rgba(0,0,0,.9);

}


/* SWIPER */

.swiper{

width:100vw;
height:100vh;

display:flex;

align-items:center;

justify-content:center;

}


/* SENTINEL */

.sentinel{

height:1px;

}

</style>