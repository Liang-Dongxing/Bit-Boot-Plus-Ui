<template>
  <icon-park v-if="isFullscreen" type="off-screen-one" size="20" @click="toggle" />
  <icon-park v-else type="full-screen-one" size="20" @click="toggle" />
</template>

<script setup lang="ts">
const { isFullscreen, toggle } = useFullscreen()
</script>
