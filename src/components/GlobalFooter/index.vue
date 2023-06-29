<script setup lang="ts">
import useSettingsStore from '@/store/modules/settings'

const appTitle = useSettingsStore().appTitle
</script>

<template>
  <div class="footer">
    <span>Copyright © 2018-2023 {{ appTitle }} All Rights Reserved.</span>
  </div>
</template>

<style scoped lang="scss">
.footer {
  width: 100%;
  height: 100%;
  text-align: center;
  color: var(--el-text-color-primary);
  font-size: 12px;
  letter-spacing: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
