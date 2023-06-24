<script setup lang="ts">
import logo from '@/assets/logo/logo.png'

import useSettingsStore from '@/store/modules/settings'

const title = useSettingsStore().appTitle
</script>

<template>
  <router-link to="/" class="sidebar-link">
    <img :src="logo" class="sidebar-logo" />
    <h1 class="sidebar-title">
      {{ title }}
    </h1>
  </router-link>
</template>

<style scoped lang="scss">
.sidebar-link {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;

  .sidebar-logo {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }

  .sidebar-title {
    color: var(--el-text-color-primary);
    font-weight: bold;
    white-space: nowrap;
  }
}
</style>
