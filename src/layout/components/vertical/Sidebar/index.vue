<script setup lang="ts">
import usePermissionStore from '@/store/modules/permission'
import MenuItem from './MenuItem.vue'
import Logo from './Logo.vue'
import { useSettingsStore } from '@/store/modules/settings'

const settingsStore = useSettingsStore()
const route = useRoute()
const permissionStore = usePermissionStore()
const sidebarRouters = computed(() => permissionStore.sidebarRouters.filter((item) => !item.hidden))
// 默认激活的菜单
const activeMenu = computed(() => {
  return route.path
})
</script>

<template>
  <logo v-if="settingsStore.sidebarLogo" />
  <el-menu :default-active="activeMenu as string" :router="true">
    <MenuItem v-for="item in sidebarRouters" :key="(item.path as string) || (item.redirect as string)" :item="item" />
  </el-menu>
</template>

<style scoped lang="scss">
.el-menu {
  border: none;
}
</style>
