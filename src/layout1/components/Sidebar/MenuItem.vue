<script setup lang="ts">
import { PropType } from 'vue'
import { RouteOption } from 'vue-router'
import { isExternal } from '@/utils/validate'
import { getNormalPath } from '@/utils/om'

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
      return true
    }
  })

  if (showingChildren.length > 0) {
    return false
  } else {
    if (children.length === 1 && children[0].hidden === true) {
      onlyOneChild.value = children[0]
      return true
    }
    onlyOneChild.value = parent
    return true
  }
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
    <el-menu-item v-if="hasOneShowingChild(item.children || [], item)" :index="resolvePath(onlyOneChild.path)">
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
