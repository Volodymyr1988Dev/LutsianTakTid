<script setup lang="ts">

import { ref,onMounted,onBeforeUnmount,nextTick, watch } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { useProjectImageStore } from '../stores/projectImages.store'

/* SWIPER */
import { Swiper,SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const route = useRoute()
const router = useRouter()

const store = useProjectImageStore()

const projectId = ref(route.params.id as string)

const sentinel = ref<HTMLElement | null>(null)

const selectedIndex = ref<number | null>(null)

/* observer instance */
let observer: IntersectionObserver | null = null


/* ---------- LOAD MORE ---------- */

async function loadMore(){

  /* FIX infinite loop */

  if(store.loading) return

  //if(store.hasMore === false) return
  if (!store.hasMore) return
  await store.loadNext(projectId.value)

}


/* ---------- IMAGE MODAL ---------- */

function openImage(index:number){

  selectedIndex.value = index

  /* PRELOAD next images for smooth swipe */

  const next1 = store.images[index + 1]
  const next2 = store.images[index + 2]

  if(next1){
    const img = new Image()
    img.src = next1.url
  }

  if(next2){
    const img = new Image()
    img.src = next2.url
  }

}

function closeModal(){

  selectedIndex.value = null

}


/* ---------- NAVIGATION ---------- */

function goBack(){

  router.push('/projects')

}

watch(
  () => route.params.id,
  async (newId) => {

    if (!newId) return

    projectId.value = newId as string

    store.reset()

    await loadMore()

  }
)

/* ---------- LIFECYCLE ---------- */

onMounted(async()=>{

  await loadMore()

  await nextTick()

  observer = new IntersectionObserver(

    (entries)=>{

      const entry = entries[0]

      if(!entry) return

      if(entry.isIntersecting){

        loadMore()

      }

    },

    {

      rootMargin:"300px"

    }

  )

  if(sentinel.value){

    observer.observe(sentinel.value)

  }

})


onBeforeUnmount(()=>{

  observer?.disconnect()

})

</script>


<template>

<div class="page">

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
v-for="(img,index) in store.images"
:key="img.id"
class="card"
@click="openImage(index)"
>

<img
:src="img.url"
loading="lazy"
decoding="async"
class="image"
/>

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

.card{

break-inside:avoid;

margin-bottom:16px;

border-radius:14px;

overflow:hidden;

cursor:pointer;

box-shadow:0 6px 18px var(--shadow);

transition:transform .25s,
box-shadow .25s;

}

.card:hover{

transform:translateY(-5px);

box-shadow:0 16px 40px var(--shadow);

}


/* IMAGE */

.image{

width:100%;

display:block;

object-fit:cover;

transition:transform .35s ease;

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

max-width:95%;

max-height:95%;

border-radius:14px;

box-shadow:0 20px 60px rgba(0,0,0,.9);

}


/* SWIPER */

.swiper{

width:100%;
height:100%;

display:flex;

align-items:center;

justify-content:center;

}


/* SENTINEL */

.sentinel{

height:1px;

}

</style>