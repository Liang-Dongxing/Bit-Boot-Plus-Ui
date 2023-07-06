<script setup lang="ts">
import horizontal from './components/horizontal/index.vue'
import vertical from './components/vertical/index.vue'
import { useSettingsStore } from '@/store/modules/settings'

const settingsStore = useSettingsStore()
</script>

<template>
  <component :is="settingsStore.menuLayout === 'horizontal' ? horizontal : vertical" />
</template>

<style scoped lang="scss"></style>
