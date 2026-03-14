<script setup lang="ts">
import { RouterView } from 'vue-router'
//:key="$route.params.id"
</script>

<template>
  <RouterView v-slot="{ Component, route }">

    <component
      :is="Component"
      :key="route.params.id"
    />

  </RouterView>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>
