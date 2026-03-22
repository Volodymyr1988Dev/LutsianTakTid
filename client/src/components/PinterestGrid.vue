<script setup lang="ts">
import type { ProjectImage } from "../types/projectImages.type"
import { cloudinary } from "../utils/cloudinary"
import { ref } from "vue"

const props = defineProps<{
  images: ProjectImage[]
}>()

const emit = defineEmits<{
  (e: "open", index: number): void
}>()

const loaded = ref<Set<string>>(new Set())

function onLoad(id: string) {
  if (!loaded.value.has(id)) {
    loaded.value = new Set([...loaded.value, id])
  }
}
</script>

<template>
<div class="grid">
  <div
    v-for="(img, index) in images"
    :key="img.id"
    class="card"
    @click="emit('open', index)"
  >
    <div class="image-wrapper">

      <!-- skeleton -->
      <div
        v-if="!loaded.has(img.id)"
        class="skeleton"
      />

      <img
        :src="cloudinary(img.url, 800)"
        class="image"
        :class="{ loaded: loaded.has(img.id) }"
        loading="lazy"
        decoding="async"
        @load="onLoad(img.id)"
        @error="onLoad(img.id)"
      />

    </div>
  </div>
</div>
</template>

<style scoped>
.grid {
  column-count: 4;
  column-gap: 12px;
  width: 100%;
  max-width: 1200px;
}

@media (max-width: 1100px) {
  .grid { column-count: 3; }
}

@media (max-width: 700px) {
  .grid { column-count: 2; }
}

.card {
  break-inside: avoid;
  margin-bottom: 12px;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: transform .2s;
}

.card:hover {
  transform: translateY(-4px);
}

.image-wrapper {
  position: relative;
  width: 100%;
  background: #eee;
}

.image {
  width: 100%;
  display: block;
  opacity: 0;
  transition: opacity .3s;
}

.image.loaded {
  opacity: 1;
}

.skeleton {
  position: absolute;
  inset: 0;
  min-height: 200px;
  background: linear-gradient(
    90deg,
    #eee 25%,
    #f5f5f5 37%,
    #eee 63%
  );
  background-size: 400% 100%;
  animation: skeleton 1.2s infinite;
}

@keyframes skeleton {
  0% { background-position: -200px 0 }
  100% { background-position: 200px 0 }
}
</style>