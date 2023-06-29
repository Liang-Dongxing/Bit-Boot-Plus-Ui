<template>
  <router-view v-slot="{ Component, route }">
    <transition :enter-active-class="animante" mode="out-in">
      <keep-alive :include="tagsViewStore.cachedViews">
        <component :is="Component" v-if="!route.meta.link" :key="route.path" />
      </keep-alive>
    </transition>
  </router-view>
  <iframe-toggle />
</template>

<script setup name="AppMain" lang="ts">
import useTagsViewStore from '@/store/modules/tagsView'
import useSettingsStore from '@/store/modules/settings'
import IframeToggle from './IframeToggle/index.vue'
import { ComponentInternalInstance } from 'vue'
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const tagsViewStore = useTagsViewStore()

// 随机动画集合
const animante = ref<string>('')
const animationEnable = ref(useSettingsStore().animationEnable)
watch(
  () => useSettingsStore().animationEnable,
  (val) => {
    animationEnable.value = val
    if (val) {
      animante.value = proxy?.animate.animateList[
        Math.round(Math.random() * proxy?.animate.animateList.length)
      ] as string
    } else {
      animante.value = proxy?.animate.defaultAnimate as string
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped></style>
