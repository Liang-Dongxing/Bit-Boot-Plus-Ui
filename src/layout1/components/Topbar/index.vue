<script setup lang="ts">
import TagsView from '../TagsView/index.vue'
import PersonalView from '../PersonalView/index.vue'

import { Ref } from 'vue'

const refTopbar = ref<HTMLElement>() as Ref<HTMLElement>
const refTagsView = ref(TagsView)
const refPersonalView = ref(PersonalView)
const tagsViewWidth = ref(100)

onMounted(() => {
  onResize({
    width: refPersonalView.value.$refs.personalView.offsetWidth,
    height: refPersonalView.value.$refs.personalView.offsetHeight,
  })
})

const onResize = (attribute: any) => {
  tagsViewWidth.value = refTopbar.value.offsetWidth - attribute.width
}
</script>

<template>
  <div ref="refTopbar" class="Topbar">
    <TagsView ref="refTagsView" :style="{ width: tagsViewWidth + 'px' }" />
    <PersonalView ref="refPersonalView" v-resize="onResize" />
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
