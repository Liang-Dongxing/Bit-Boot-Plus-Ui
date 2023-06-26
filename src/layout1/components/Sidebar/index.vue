<script setup lang="ts">
import usePermissionStore from '@/store/modules/permission'
import MenuItem from './MenuItem.vue'
import Logo from './Logo.vue'

const permissionStore = usePermissionStore()

const sidebarRouters = computed(() => permissionStore.sidebarRouters.filter((item) => !item.hidden))
const activeMenu = ref<string>('')
</script>

<template>
  <logo />
  <el-menu :default-active="activeMenu as string" :router="true">
    <MenuItem v-for="item in sidebarRouters" :key="item.path" :item="item" :base-path="item.patch" />
  </el-menu>
</template>

<style scoped lang="scss">
.el-menu {
  border: none;
}
</style>
