<template>
  <el-config-provider :locale="appStore.locale" :size="size">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import useAppStore from '@/store/modules/app'

const appStore = useAppStore()
const size = computed(() => appStore.size as any)
</script>
