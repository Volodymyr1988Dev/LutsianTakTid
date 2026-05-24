<script setup lang="ts">

import { ref, watch, nextTick, onBeforeUnmount } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useProjectImageStore } from "../stores/projectImages.store"
import PinterestGrid from "../components/PinterestGrid.vue"
import { useProjectStore } from "../stores/project.store"
import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"

import { cloudinary } from "../utils/cloudinary"

const route = useRoute()
const router = useRouter()

const store = useProjectImageStore()

const projectId = ref<string>("")
const expandedComments = ref<Record<string, boolean>>({})

const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const selectedIndex = ref<number | null>(null)

const touchStartY = ref(0)
const touchEndY = ref(0)
let loadingLock = false

const showImages = ref(false)
const showExtraHours = ref(false)
const projectStore = useProjectStore()
async function loadMore() {

  if (loadingLock || store.loading || !store.hasMore) return
  loadingLock = true
  try {
    await store.fetchNext(projectId.value)
  } finally {
    setTimeout(() => {
      loadingLock = false
    }, 200)
  }
}

function toggleComment(id: string) {
  expandedComments.value[id] = !expandedComments.value[id]
}

function createObserver() {

  observer?.disconnect()

  observer = new IntersectionObserver(

    (entries) => {

      if (entries[0]?.isIntersecting) {
        console.log("LOAD MORE TRIGGERED")
        loadMore()
      }

    },

    {
      rootMargin: "400px"
    }

  )

  if (sentinel.value) {
    observer.observe(sentinel.value)
  }

}


watch(

  () => route.params.id,

  async (newId) => {

    if (!newId) return

    projectId.value = newId as string

    store.reset()

    //await loadMore()
    await Promise.all([
      loadMore(),
      projectStore.loadProject(projectId.value)
    ])

    await nextTick()

    createObserver()

  },

  { immediate: true }

)

onBeforeUnmount(() => {

  observer?.disconnect()
  document.body.style.overflow = ""
})

function openImage(index: number) {

  selectedIndex.value = index
  document.body.style.overflow = "hidden"

}

function closeModal() {

  selectedIndex.value = null
  requestAnimationFrame(() => {
    document.body.style.overflow = ""
  })

}

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

function goBack() {

  router.push("/projects")

}

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
    Project Overview
  </h1>

  <div class="extra-summary">

    <h2>
      Total Extra Time:
      {{ projectStore.selectedProject?.totalExtraHours || 0 }} h
    </h2>

    <button
      class="toggle-btn"
      @click="showExtraHours = !showExtraHours"
    >
      {{
        showExtraHours
          ? 'Hide Detail Extra Time'
          : 'Show Detail Extra Time'
      }}
    </button>

  </div>

  <div
    v-if="showExtraHours"
    class="extra-list"
  >

    <div
      v-for="item in projectStore.selectedProject?.extraAssignments"
      :key="item.id"
      class="extra-card"
    >
      
      <div class="extra-date">
    {{ new Date(item.date).toLocaleDateString() }}
      </div>

      <div
        class="extra-comment"
        :class="{
          expanded: expandedComments[item.id]
        }"
        @click="toggleComment(item.id)"
      >
        {{ item.comment || 'No comment' }}
      </div>

      <div class="extra-hours">
        {{ item.hours }} h
      </div>


    </div>

  </div>

<button
  class="toggle-btn"
  @click="showImages = !showImages"
>
  {{ showImages ? 'Hide Images' : 'Show Images' }}
</button>

<PinterestGrid
v-if="showImages"
:images="store.images"
@open="openImage"
/>

<div
ref="sentinel"
class="sentinel"
/>

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
<!--:src="slotProps.itemInfo.data.url"-->
<img
:src="cloudinary(img.url,1200)"
decoding="async"
fetchpriority="high"
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

/*padding:30px;*/
padding:30px 20px 60px;

background:var(--bg);

color:var(--text);

display:flex;

flex-direction:column;

align-items:center;

}


/* TITLE */

.title{

font-size:32px;

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

/*transition:all .2s;*/
transition: .2s;

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

.extra-summary{

width:100%;
max-width:900px;

background:var(--card);

padding:24px;

border-radius:20px;

margin-bottom:20px;

/*box-shadow:0 8px 24px var(--shadow);*/

display:flex;

flex-direction:column;

gap:18px;
}

.extra-list{

width:100%;
max-width:900px;

display:flex;

flex-direction:column;

gap:14px;

margin-bottom:28px;
}

.extra-card{

display:flex;

justify-content:space-between;

align-items:center;

padding: 16px 20px;

border-radius:18px;

background:var(--card);

box-shadow:0 8px 24px var(--shadow);

gap: 18px;

overflow:hidden;
font-size:15px;

/*flex-direction: column;*/
transition:.25s;
border:1px solid rgba(255,255,255,.05);
}
.extra-card:hover{

transform:translateY(-2px);

box-shadow:0 14px 34px var(--shadow);

}
.extra-date{
font-size:13px;
opacity:.65;
white-space:nowrap;

min-width:95px;
font-weight:600;
}

.extra-hours{
font-size:18px;

font-weight:800;

white-space:nowrap;
opacity:.95;

margin-left:auto;
}

.toggle-btn{

padding:12px 18px;

border:none;

border-radius:12px;

cursor:pointer;

font-weight:600;

background:var(--card);

box-shadow:0 6px 20px var(--shadow);

transition:.2s;
margin-bottom:20px;
}

.toggle-btn:hover{
transform:translateY(-2px);
}

.photos-btn{
margin-bottom:24px;
}

.extra-card:hover{

transform:translateY(-3px);

box-shadow:0 18px 40px var(--shadow);

}


.extra-comment{
flex:1;

font-size:14px;

line-height:1.4;

overflow:hidden;

white-space:nowrap;

text-overflow:ellipsis;

cursor:pointer;

opacity:.92;

transition:.2s;

}
.extra-comment:hover{

opacity:1;

}

.extra-comment.expanded{

white-space:normal;

overflow:visible;

text-overflow:unset;

padding:6px 0;

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

.extra-card{

align-items:flex-start;

gap:10px;

padding:14px 16px;

}

.extra-date{

min-width:auto;

font-size:12px;

}

.extra-comment{

font-size:13px;

}

.extra-hours{

font-size:16px;

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


.scroller{
column-count:4;
column-gap:16px;
}

.card{
break-inside:avoid;
margin-bottom:16px;
}
@media (max-width: 768px) {
  .grid {
    padding: 0 8px;
  }
}
</style>