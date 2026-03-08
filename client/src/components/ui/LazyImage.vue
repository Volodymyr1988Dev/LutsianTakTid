<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
}>()

const loaded = ref(false)
</script>

<template>

<div class="image-wrapper">

  <img
    :src="src"
    :alt="alt"
    class="image blur"
    loading="lazy"
    decoding="async"
    @load="loaded = true"
    :class="{ loaded }"
  >

</div>

</template>

<style scoped>

.image-wrapper {
  width:100%;
  height:200px;
  overflow:hidden;
  border-radius:10px;
}

.image {

  width:100%;
  height:100%;

  object-fit:cover;

  filter: blur(20px);
  transform: scale(1.1);

  transition:
    filter .4s ease,
    transform .4s ease;

}

.image.loaded {

  filter: blur(0);
  transform: scale(1);

}

</style>