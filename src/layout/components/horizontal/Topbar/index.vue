<script setup lang="ts">
import usePermissionStore from '@/store/modules/permission'
import MenuItem from './MenuItem.vue'
import Logo from './Logo.vue'
import PersonalView from '@/layout/PersonalView/index.vue'
import { useSettingsStore } from '@/store/modules/settings'

const route = useRoute()
const permissionStore = usePermissionStore()

const settingsStore = useSettingsStore()
const sidebarRouters = computed(() => permissionStore.sidebarRouters.filter((item) => !item.hidden))
// 默认激活的菜单
const activeMenu = computed(() => {
  return route.path
})
</script>

<template>
  <div class="Topbar">
    <div class="MenuLone">
      <logo v-if="settingsStore.sidebarLogo" />
      <el-menu
        v-if="!settingsStore.menuLone"
        :class="settingsStore.menuContent"
        :default-active="activeMenu as string"
        :router="true"
        mode="horizontal">
        <MenuItem
          v-for="item in sidebarRouters"
          :key="(item.path as string) || (item.redirect as string)"
          :item="item" />
      </el-menu>
      <PersonalView />
    </div>
    <el-menu
      v-if="settingsStore.menuLone"
      :class="settingsStore.menuContent"
      :default-active="activeMenu as string"
      :router="true"
      mode="horizontal">
      <MenuItem v-for="item in sidebarRouters" :key="(item.path as string) || (item.redirect as string)" :item="item" />
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.Topbar {
  .MenuLone {
    margin: 0 20px;
    display: flex;
    justify-content: space-between;
  }
  .el-menu {
    flex: 1;
  }
  .el-menu.left {
    justify-content: left;
  }
  .el-menu.right {
    justify-content: right;
  }
  .el-menu.center {
    justify-content: center;
  }
}
</style>
