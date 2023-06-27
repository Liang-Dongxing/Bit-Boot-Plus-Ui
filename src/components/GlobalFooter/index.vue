<script setup lang="ts">
import useSettingsStore from '@/store/modules/settings'

const appTitle = useSettingsStore().appTitle
</script>

<template>
  <div class="el-login-footer">
    <span>Copyright © 2018-2023 {{ appTitle }} All Rights Reserved.</span>
  </div>
</template>

<style scoped lang="scss">
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: var(--el-text-color-primary);
  font-family: Arial, serif;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
