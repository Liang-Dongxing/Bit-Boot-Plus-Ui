<script setup lang="ts">
import AppMain from '@/layout/AppMain/index.vue'
import Sidebar from './Sidebar/index.vue'
import Topbar from './Topbar/index.vue'
</script>

<template>
  <el-container>
    <el-aside width="200px">
      <sidebar />
    </el-aside>
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
