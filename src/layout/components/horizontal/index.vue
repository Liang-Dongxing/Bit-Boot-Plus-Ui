<script setup lang="ts">
import AppMain from '@/layout/AppMain/index.vue'
import Topbar from './Topbar/index.vue'
import { useSettingsStore } from '@/store/modules/settings'

const settingsStore = useSettingsStore()
</script>

<template>
  <el-container>
    <el-header :height="settingsStore.menuLone ? '120px' : '60px'">
      <topbar />
    </el-header>
    <el-main>
      <AppMain />
    </el-main>
    <el-footer>
      <GlobalFooter />
    </el-footer>
  </el-container>
</template>

<style scoped lang="scss">
.el-container {
  height: 100vh;

  .el-aside {
    border-right: solid 1px var(--el-menu-border-color);
  }

  .el-header {
    border-bottom: solid 1px var(--el-menu-border-color);
    padding: 0;
  }
}
</style>
