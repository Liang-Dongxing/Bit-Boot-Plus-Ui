<script setup lang="ts">
import TagsView from '../TagsView/index.vue'
import PersonalView from '../PersonalView/index.vue'
</script>

<template>
  <div class="Topbar">
    <TagsView />
    <PersonalView />
  </div>
</template>

<style scoped lang="scss">
.Topbar {
  display: flex;
  justify-content: space-between;
  :deep(.el-tabs) {
    --el-tabs-header-height: 60px;
    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      line-height: var(--el-tabs-header-height);
    }
    .el-tabs__nav {
      border-radius: unset;
    }
  }
}
</style>
