<script setup lang="ts">
import { PropType } from 'vue'
import { RouteOption } from 'vue-router'
import { isExternal } from '@/utils/validate'
import { getNormalPath } from '@/utils/bit'

const props = defineProps({
  item: {
    type: Object as PropType<RouteOption>,
    required: true,
  },
  basePath: {
    type: String,
    default: '',
  },
})
const onlyOneChild = ref<any>({})
const hasOneShowingChild = (children: RouteOption[] = [], parent: RouteOption) => {
  if (!children) {
    children = []
  }
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item
      return true
    }
  })

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }

  return false
}

const resolvePath = (routePath: string, routeQuery?: string): any => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  if (routeQuery) {
    let query = JSON.parse(routeQuery)
    return { path: getNormalPath(props.basePath + '/' + routePath), query: query }
  }
  return getNormalPath(props.basePath + '/' + routePath)
}
</script>

<template>
  <template v-if="!item.hidden">
    <el-menu-item
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
      :index="resolvePath(onlyOneChild.path)">
      <el-icon v-if="onlyOneChild.meta && onlyOneChild.meta.icon !== '#'">
        <icon-park :type="onlyOneChild.meta.icon" />
      </el-icon>
      <span>{{ onlyOneChild.meta?.title }}</span>
    </el-menu-item>
    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template v-if="item.meta" #title>
        <el-icon v-if="item.meta && item.meta?.icon !== '#'">
          <icon-park :type="item.meta.icon" />
        </el-icon>
        <span class="menu-title">{{ item.meta?.title }}</span>
      </template>
      <MenuItem v-for="child in item.children" :key="child.path" :item="child" :base-path="resolvePath(item.path)" />
    </el-sub-menu>
  </template>
</template>

<style scoped lang="scss"></style>
