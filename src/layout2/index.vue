<script setup lang="ts">
import { Topbar, AppMain } from './components'
</script>

<template>
  <el-container>
    <el-header>
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
