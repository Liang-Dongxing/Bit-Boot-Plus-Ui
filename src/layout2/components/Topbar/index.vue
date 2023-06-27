<script setup lang="ts">
import usePermissionStore from '@/store/modules/permission'
import MenuItem from './MenuItem.vue'
import Logo from './Logo.vue'
import PersonalView from '../PersonalView'

const permissionStore = usePermissionStore()

const sidebarRouters = computed(() => permissionStore.sidebarRouters.filter((item) => !item.hidden))
const activeMenu = ref<string>('')
</script>

<template>
  <div class="Topbar">
    <logo />
    <el-menu :default-active="activeMenu as string" :router="true" mode="horizontal">
      <MenuItem v-for="item in sidebarRouters" :key="item.path" :item="item" :base-path="item.patch" />
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
