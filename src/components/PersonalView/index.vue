<script setup lang="ts">
import { ComponentInternalInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import defAva from '@/assets/images/avatar.png'
import useUserStore from '@/store/modules/user'
import { useSettingsStore } from '@/store/modules/settings'
import { SettingTypeEnum } from '@/enums/SettingTypeEnum'
import { dynamicClear, dynamicTenant } from '@/api/system/tenant'
import { TenantVO } from '@/api/types'
import { getTenantList } from '@/api/login'

const settingsStore = useSettingsStore()
const userStore = useUserStore()

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const companyName = ref(undefined)
const userId = ref(userStore.userId)
const tenantList = ref<TenantVO[]>([])
// 是否切换了租户
const dynamic = ref(false)
// 租户开关
const tenantEnabled = ref(true)
const isDrawer = ref(true)

onMounted(() => {
  initTenantList()
})

// 租户动态切换
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
// 全屏切换
const { isFullscreen, toggle } = useFullscreen()
// 菜单布局
const showMenuLayout = ref(settingsStore.menuLayout)
const handleMenuLayout = (show: boolean) => {
  settingsStore.changeSetting({ key: SettingTypeEnum.MENU_LAYOUT, value: show })
}
// 暗黑切换
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const changeDark = () => {
  toggleDark()
  settingsStore.changeSetting({ key: SettingTypeEnum.DARK, value: isDark.value })
}

// 语言切换
const { locale } = useI18n()
const message: any = {
  zh_CN: '切换语言成功！',
  en_US: 'Switch Language Successful!',
}
const handleLanguageChange = (lang: string) => {
  // locale.value = lang
  ElMessage.success(message[lang] || '切换语言成功！')
  settingsStore.changeSetting({ key: SettingTypeEnum.LANGUAGE, value: lang })
}
const avatarClick = () => {
  isDrawer.value = true
}
// 布局大小
const layoutSize = computed(() => settingsStore.layoutSize)
const handleSetSize = (size: string) => {
  settingsStore.changeSetting({ key: SettingTypeEnum.LAYOUT_SIZE, value: size })
}
// 是否显示多标签导航
const showTagsView = ref(settingsStore.tagsView)
const handleTagsView = (show: boolean) => {
  settingsStore.changeSetting({ key: SettingTypeEnum.TAGS_VIEW, value: show })
}
// 是否显示logo
const showSidebarLogo = ref(settingsStore.sidebarLogo)
const handleSidebarLogo = (show: boolean) => {
  settingsStore.changeSetting({ key: SettingTypeEnum.SIDEBAR_LOGO, value: show })
}
// 是否显示logo
const showDynamicTitle = ref(settingsStore.dynamicTitle)
const handleDynamicTitle = (show: boolean) => {
  settingsStore.changeSetting({ key: SettingTypeEnum.DYNAMIC_TITLE, value: show })
  settingsStore.setTitle(settingsStore.title)
}
// 菜单是否独占一行
const showMenuLone = ref(settingsStore.menuLone)
const handleMenuLone = (show: boolean) => {
  settingsStore.changeSetting({ key: SettingTypeEnum.MENU_LONE, value: show })
}
// 菜单位置
const showMenuContent = ref(settingsStore.menuContent)
const handleMenuContent = (show: boolean) => {
  settingsStore.changeSetting({ key: SettingTypeEnum.MENU_CONTENT, value: show })
}
</script>

<template>
  <div ref="personalView" class="PersonalView">
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
      <icon-park v-if="isFullscreen" type="off-screen-one" size="20" class="item" @click="toggle" />
      <icon-park v-else type="full-screen-one" size="20" class="item" @click="toggle" />
    </el-tooltip>
    <el-dropdown trigger="hover" @command="handleCommand">
      <el-avatar shape="circle" :size="40" :src="userStore.avatar" @click="avatarClick">
        <img :src="defAva" />
      </el-avatar>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-if="!dynamic" command="profile">
            {{ $t('navbar.personalCenter') }}
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            {{ $t('navbar.logout') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-drawer v-model="isDrawer" title="个人设置" size="400">
      <el-form label-position="left" label-width="auto">
        <el-form-item label="暗黑模式">
          <DarkSwitch @click="changeDark" />
        </el-form-item>
        <el-form-item label="菜单布局">
          <el-select v-model="showMenuLayout" @change="handleMenuLayout">
            <el-option label="垂直" value="vertical" />
            <el-option label="水平" value="horizontal" />
          </el-select>
        </el-form-item>
        <el-form-item label="语言切换">
          <el-select v-model="locale" @change="handleLanguageChange">
            <el-option label="中文" value="zh_CN" />
            <el-option label="English" value="en_US" />
          </el-select>
        </el-form-item>
        <el-form-item label="布局大小">
          <el-select v-model="layoutSize" @change="handleSetSize">
            <el-option label="较大" value="large" />
            <el-option label="默认" value="default" />
            <el-option label="稍小" value="small" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示Logo">
          <el-switch v-model="showSidebarLogo" @change="handleSidebarLogo" />
        </el-form-item>
        <el-form-item label="是否显示动态标题">
          <el-switch v-model="showDynamicTitle" @change="handleDynamicTitle" />
        </el-form-item>
        <el-divider>垂直菜单</el-divider>
        <el-form-item label="是否显示多标签导航">
          <el-switch v-model="showTagsView" @change="handleTagsView" />
        </el-form-item>
        <el-divider>水平菜单</el-divider>
        <el-form-item label="是否菜单独占一行">
          <el-switch v-model="showMenuLone" @change="handleMenuLone" />
        </el-form-item>
        <el-form-item label="菜单位置">
          <el-select v-model="showMenuContent" @change="handleMenuContent">
            <el-option label="左" value="left" />
            <el-option label="中" value="center" />
            <el-option label="右" value="right" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.PersonalView {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 6px;
  width: 400px;
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
