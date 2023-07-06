<script setup lang="ts">
import TagsView from '../TagsView/index.vue'
import PersonalView from '@/components/PersonalView/index.vue'
import { useSettingsStore } from '@/store/modules/settings'

const settingsStore = useSettingsStore()
</script>

<template>
  <div class="Topbar">
    <TagsView v-if="settingsStore.tagsView" />
    <PersonalView />
  </div>
</template>

<style scoped lang="scss">
.Topbar {
  display: flex;
  justify-content: flex-end;
  :deep(.el-tabs) {
    flex: 1;
    overflow: hidden;
    --el-tabs-header-height: 60px;
    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      line-height: var(--el-tabs-header-height);
    }
    .el-tabs__nav-next {
      border-right: solid 1px var(--el-menu-border-color);
    }
    .el-tabs__nav-prev {
      //border-left: solid 1px var(--el-menu-border-color);
    }
    .el-tabs__nav {
      border-radius: unset;
    }
  }
}
</style>
