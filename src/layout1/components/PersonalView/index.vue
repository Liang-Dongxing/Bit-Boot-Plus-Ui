<script setup lang="ts">
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import { dynamicClear, dynamicTenant } from '@/api/system/tenant'
import { ComponentInternalInstance } from 'vue'
import { TenantVO } from '@/api/types'

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
const logout = async () => {
  await ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await userStore.logout()
  location.href = import.meta.env.VITE_APP_CONTEXT_PATH + 'index'
}
const emits = defineEmits(['setLayout'])
const setLayout = () => {
  emits('setLayout')
}

// 定义Command方法对象 通过key直接调用方法
const commandMap: { [key: string]: any } = {
  setLayout,
  logout,
}
const handleCommand = (command: string) => {
  // 判断是否存在该方法
  if (commandMap[command]) {
    commandMap[command]()
  }
}
</script>

<template>
  <div class="PersonalView">
    <template v-if="appStore.device !== 'mobile'">
      <el-select
        v-model="companyName"
        clearable
        filterable
        reserve-keyword
        :placeholder="$t('navbar.selectTenant')"
        v-if="userId === 1 && tenantEnabled"
        @change="dynamicTenantEvent"
        @clear="dynamicClearEvent">
        <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.companyName" :value="item.tenantId">
        </el-option>
        <template #prefix><svg-icon icon-class="company" class="el-input__icon input-icon" /></template>
      </el-select>

      <header-search id="header-search" class="right-menu-item" />

      <el-tooltip content="Github" effect="dark" placement="bottom">
        <bit-git id="bit-git" class="right-menu-item hover-effect" />
      </el-tooltip>

      <el-tooltip :content="$t('navbar.document')" effect="dark" placement="bottom">
        <bit-doc id="bit-doc" class="right-menu-item hover-effect" />
      </el-tooltip>

      <el-tooltip :content="$t('navbar.full')" effect="dark" placement="bottom">
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </el-tooltip>

      <el-tooltip :content="$t('navbar.language')" effect="dark" placement="bottom">
        <lang-select id="lang-select" class="right-menu-item hover-effect" />
      </el-tooltip>

      <el-tooltip :content="$t('navbar.layoutSize')" effect="dark" placement="bottom">
        <size-select id="size-select" class="right-menu-item hover-effect" />
      </el-tooltip>
    </template>
    <div class="avatar-container">
      <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="userStore.avatar" class="user-avatar" />
          <el-icon><caret-bottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/user/profile" v-if="!dynamic">
              <el-dropdown-item>{{ $t('navbar.personalCenter') }}</el-dropdown-item>
            </router-link>
            <el-dropdown-item command="setLayout">
              <span>{{ $t('navbar.layoutSetting') }}</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <span>{{ $t('navbar.logout') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="scss">
.right-menu {
  float: right;
  height: 100%;
  line-height: 50px;
  display: flex;

  &:focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-container {
    margin-right: 40px;

    .avatar-wrapper {
      margin-top: 5px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        margin-top: 10px;
      }

      i {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
