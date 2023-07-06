<template>
  <el-config-provider :locale="languageObj[settingsStore.language]" :size="settingsStore.layoutSize">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/store/modules/settings'
import { languageObj } from '@/lang'
const settingsStore = useSettingsStore()
</script>
