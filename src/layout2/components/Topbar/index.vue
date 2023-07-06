<script setup lang="ts">
import usePermissionStore from '@/store/modules/permission'
import MenuItem from './MenuItem.vue'
import Logo from './Logo.vue'
import PersonalView from '@/components/PersonalView/index.vue'

const route = useRoute()
const permissionStore = usePermissionStore()
import { useSettingsStore } from '@/store/modules/settings'

const settingsStore = useSettingsStore()
const sidebarRouters = computed(() => permissionStore.sidebarRouters.filter((item) => !item.hidden))
// 默认激活的菜单
const activeMenu = computed(() => {
  return route.path
})
</script>

<template>
  <div class="Topbar">
    <logo v-if="settingsStore.sidebarLogo" />
    <el-menu :default-active="activeMenu as string" :router="true" mode="horizontal">
      <MenuItem v-for="item in sidebarRouters" :key="item.path as string || item.redirect as string" :item="item" />
    </el-menu>
    <PersonalView />
  </div>
</template>

<style scoped lang="scss">
.Topbar {
  display: flex;
  padding: 0 6px;
  justify-content: space-between;
  .el-menu {
    flex: 1;
    justify-content: center;
  }
}
</style>
