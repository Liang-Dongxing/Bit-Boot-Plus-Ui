import { defineStore } from 'pinia'
import defaultSettings from '@/settings'
import { SettingTypeEnum } from '@/enums/SettingTypeEnum'
import { useDynamicTitle } from '@/utils/dynamicTitle'
import { Ref } from 'vue'

export const useSettingsStore = defineStore('setting', () => {
  const storageSetting = JSON.parse(localStorage.getItem('layout-setting') || '{}')

  const prop: { [key: string]: Ref<any> } = {
    title: ref<string>(''),
    appTitle: ref<string>(import.meta.env.VITE_APP_TITLE),
    theme: ref<string>(storageSetting.theme || defaultSettings.theme),
    tagsView: ref<boolean>(storageSetting.tagsView || defaultSettings.tagsView),
    sidebarLogo: ref<boolean>(storageSetting.sidebarLogo || defaultSettings.sidebarLogo),
    layoutSize: ref<boolean>(storageSetting.layoutSize || defaultSettings.layoutSize),
    language: ref<boolean>(storageSetting.language || defaultSettings.language),
    dynamicTitle: ref<boolean>(storageSetting.dynamicTitle || defaultSettings.dynamicTitle),
    dark: ref<boolean>(storageSetting.dark || defaultSettings.dark),
    menuLayout: ref<boolean>(storageSetting.menuLayout || defaultSettings.menuLayout),
  }

  const { title, appTitle, theme, tagsView, sidebarLogo, layoutSize, language, dynamicTitle, dark, menuLayout } = prop

  // actions
  const changeSetting = (param: { key: SettingTypeEnum; value: any }) => {
    const { key, value } = param
    if (key in prop) {
      prop[key].value = value
    }
  }
  const setTitle = (value: string) => {
    title.value = value
    useDynamicTitle()
  }
  return {
    title,
    appTitle,
    theme,
    tagsView,
    sidebarLogo,
    layoutSize,
    language,
    dynamicTitle,
    dark,
    menuLayout,
    changeSetting,
    setTitle,
  }
})

export default useSettingsStore
