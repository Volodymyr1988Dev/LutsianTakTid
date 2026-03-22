<script setup lang="ts">

import { MasonryInfiniteGrid } from "@egjs/vue3-infinitegrid"
import type { ProjectImage } from "../types/projectImages.type"
import { cloudinary } from "../utils/cloudinary"
import { ref, watch } from "vue"
import { nextTick } from "vue"

const props = defineProps<{
  images: ProjectImage[]
}>()

const emit = defineEmits<{
  (e: "open", index: number): void
}>()

const loaded = ref<Set<string>>(new Set())
const gridRef = ref<any>(null)
function onLoad(id: string) {
  if (!loaded.value.has(id)) {
    //loaded.value.add(id)
    loaded.value = new Set([...loaded.value, id])
    //gridRef.value?.renderItems()
  }
}

const gridItems = ref<any[]>([])

watch(
  () => props.images.length,
  async (/*images*/) => {
    //if (!images) return

    gridItems.value = props.images.map(img => ({
      key: img.id,
      data: img
    }))

    await nextTick()
    gridRef.value?.renderItems()
  },
  { immediate: true }
)
/*
watch(
  () => props.images.length,
  async () => {
    await nextTick()
    gridRef.value?.renderItems()
  }
)*/
</script>

<template>
<!--v-show="gridItems.length"
:items="gridItems"
-->
<MasonryInfiniteGrid
  v-show="gridItems.length"
  class="grid"
  ref="gridRef"
  :gap="2"
  :items="gridItems"
  :use-first-render="true"
  :auto-resize="true"
  :use-recycle="false"
  :align="'center'"
>
<!--<template #default="slotProps">

<div v-if="slotProps?.itemInfo"
     class="card"
     :key="slotProps.itemInfo.key"
     @click="emit('open', slotProps.index)"
>-->
<div
  v-for="(img, index) in props.images"
  :key="img.id"
  class="card"
  @click="emit('open', index)"
>

  <div class="image-wrapper">
<!--:src="cloudinary(slotProps.itemInfo.data.url, 800)"-->
<!--<img

      :src="cloudinary(slotProps.itemInfo.data.url, 800)"
      :srcset="`
        ${cloudinary(slotProps.itemInfo.data.url,400)} 400w,
        ${cloudinary(slotProps.itemInfo.data.url,800)} 800w,
        ${cloudinary(slotProps.itemInfo.data.url,1200)} 1200w
      `"
      sizes="(max-width:700px) 100vw,(max-width:1100px) 50vw,33vw"
      loading="lazy"
      decoding="async"
      :fetchpriority="slotProps.index < 5 ? 'high' : 'auto'"
      class="image"
      :class="{ loaded: loaded.has(slotProps.itemInfo.data.id) }"
      @load="onLoad(slotProps.itemInfo.data.id)"
      @error="onLoad(slotProps.itemInfo.data.id)"
    />-->
    <!--:src="cloudinary(img.url, 800)"  :src="img.url"-->
    <img
      :src="cloudinary(img.url, 800)"
      class="image"
      :class="{ loaded: loaded.has(img.id) }"
      @load="onLoad(img.id)"
      @error="onLoad(img.id)"
    />
    <!--<div
      v-if="!loaded.has(slotProps.itemInfo.data.id)"
      class="skeleton" 
    />-->
  </div> 
</div>
<!--</template>-->

</MasonryInfiniteGrid>

</template>

<style scoped>

.grid{
width:100%;
max-width:1300px;
margin:auto;
will-change: transform;
}

.card{
border-radius:16px;
overflow:hidden;
cursor:pointer;
transition:transform .25s;
will-change: transform;
transform: translateZ(0);
}

.card:hover{
transform:translateY(-4px);
}

.image-wrapper{
position:relative;
width:100%;
aspect-ratio:3/4;
background:#eee;
}

.image{
width:100%;
height:auto;
object-fit:cover;
opacity:0;
transition:opacity .35s;
transform: scale(1.02);
}

.image.loaded{
opacity:1;
transform: scale(1);
}

.skeleton{
position:absolute;
inset:0;

background:linear-gradient(
90deg,
#eee 25%,
#f5f5f5 37%,
#eee 63%
);

background-size:400% 100%;
animation:skeleton 1.4s infinite;
}

@keyframes skeleton{
0%{background-position:-200px 0}
100%{background-position:200px 0}
}

</style>