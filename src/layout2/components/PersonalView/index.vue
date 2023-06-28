<script setup lang="ts">
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import { dynamicClear, dynamicTenant } from '@/api/system/tenant'
import { ComponentInternalInstance } from 'vue'
import { TenantVO } from '@/api/types'
import { getTenantList } from '@/api/login'
import defAva from '@/assets/images/avatar.png'
import router from '@/router'

const appStore = useAppStore()
const userStore = useUserStore()

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const companyName = ref(undefined)
const userId = ref(userStore.userId)
const tenantList = ref<TenantVO[]>([])
// 是否切换了租户
const dynamic = ref(false)
// 租户开关
const tenantEnabled = ref(true)

onMounted(() => {
  initTenantList()
})

// 动态切换
const dynamicTenantEvent = async (tenantId: string) => {
  if (companyName.value != null && companyName.value !== '') {
    await dynamicTenant(tenantId)
    dynamic.value = true
    proxy?.$tab.closeAllPage()
    proxy?.$router.push('/')
  }
}
const dynamicClearEvent = async () => {
  await dynamicClear()
  dynamic.value = false
  proxy?.$tab.closeAllPage()
  proxy?.$router.push('/')
}
/** 租户列表 */
const initTenantList = async () => {
  const { data } = await getTenantList()
  tenantEnabled.value = data.tenantEnabled === undefined ? true : data.tenantEnabled
  if (tenantEnabled.value) {
    tenantList.value = data.voList
  }
}

const logout = async () => {
  await ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await userStore.logout()
  location.href = import.meta.env.VITE_APP_CONTEXT_PATH + 'index'
}

const profile = () => {
  proxy?.$router.push('/user/profile')
}
// 定义Command方法对象 通过key直接调用方法
const commandMap: { [key: string]: any } = {
  logout,
  profile,
}
const handleCommand = (command: string) => {
  // 判断是否存在该方法
  if (commandMap[command]) {
    commandMap[command]()
  }
}
</script>

<template>
  <div ref="personalView" class="PersonalView">
    <template v-if="appStore.device !== 'mobile'">
      <el-select
        v-if="userId === 1 && tenantEnabled"
        v-model="companyName"
        clearable
        filterable
        reserve-keyword
        :placeholder="$t('navbar.selectTenant')"
        @change="dynamicTenantEvent"
        @clear="dynamicClearEvent">
        <template #prefix><icon-park type="city-one" /></template>
        <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.companyName" :value="item.tenantId" />
      </el-select>

      <el-tooltip :content="$t('navbar.full')" effect="dark" placement="bottom">
        <screenfull class="item" />
      </el-tooltip>

      <el-tooltip :content="$t('navbar.language')" effect="dark" placement="bottom">
        <lang-select class="item" />
      </el-tooltip>

      <el-tooltip :content="$t('navbar.layoutSize')" effect="dark" placement="bottom">
        <size-select class="item" />
      </el-tooltip>
    </template>
    <el-dropdown trigger="hover" @command="handleCommand">
      <el-avatar shape="circle" :size="40" :src="userStore.avatar">
        <img :src="defAva" />
      </el-avatar>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-if="!dynamic" command="profile">{{ $t('navbar.personalCenter') }}</el-dropdown-item>
          <el-dropdown-item divided command="logout">
            {{ $t('navbar.logout') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped lang="scss">
.PersonalView {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .item {
    padding: 0 6px;
    font-size: 20px;
    height: 60px;
    display: flex;
    align-items: center;
    color: var(--el-text-color-primary);
    cursor: pointer;
  }
  .item:hover {
    background-color: var(--el-color-primary-light-9);
  }
  .el-avatar {
    background: #ffffff;
    cursor: pointer;
    border: 2px solid var(--el-color-white);
    :deep(img) {
      width: 20px;
      height: 20px;
    }
  }
  .el-avatar:hover {
    border: 2px solid var(--el-color-primary-light-9);
  }
}
</style>
