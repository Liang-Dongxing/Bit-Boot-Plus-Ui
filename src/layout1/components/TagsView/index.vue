<template>
  <div ref="elTabs" class="el-tabs el-tabs--top el-tabs--card">
    <div class="el-tabs__header is-top">
      <div class="el-tabs__nav-wrap is-top" :class="{ 'is-scrollable': isShowHandoff }">
        <span v-show="isShowHandoff" class="el-tabs__nav-prev" @click="handoffPrev">
          <el-icon><ArrowLeft /></el-icon>
        </span>
        <span v-show="isShowHandoff" class="el-tabs__nav-next" @click="handoffNext">
          <el-icon><ArrowRight /></el-icon>
        </span>
        <div ref="elTabsNavScroll" class="el-tabs__nav-scroll">
          <div
            ref="elTabsNav"
            class="el-tabs__nav is-top"
            role="tablist"
            :style="{ transform: 'translateX(' + navOffset + 'px)' }">
            <div
              v-for="tag in visitedViews"
              :key="tag.path"
              ref="elTabsItem"
              class="el-tabs__item is-top is-closable"
              :class="{ 'is-active': isActive(tag) }"
              @click="openSelectedTag(tag, $event)"
              @contextmenu.prevent="openMenu(tag, $event)">
              {{ tag.title }}
              <el-icon class="is-icon-close" @click.prevent.stop="closeSelectedTag(tag)">
                <close />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-show="visible"
    class="el-popper is-pure is-light el-dropdown__popper"
    style="z-index: 2056; position: absolute"
    :style="{ left: left + 'px', top: top + 'px' }"
    data-popper-placement="bottom">
    <ul class="el-dropdown-menu">
      <li class="el-dropdown-menu__item" @click="refreshSelectedTag(selectedTag)">
        <el-icon class="is-icon-close"><refresh-right /></el-icon>刷新页面
      </li>
      <li v-if="!isAffix()" class="el-dropdown-menu__item" @click="closeSelectedTag(selectedTag)">
        <el-icon class="is-icon-close"><close /></el-icon>关闭当前
      </li>
      <li class="el-dropdown-menu__item" @click="closeOthersTags">
        <el-icon class="is-icon-close"><circle-close /></el-icon>关闭其他
      </li>
      <li v-if="!isFirstView()" class="el-dropdown-menu__item" @click="closeLeftTags">
        <el-icon class="is-icon-close"><back /></el-icon>关闭左侧
      </li>
      <li v-if="!isLastView()" class="el-dropdown-menu__item" @click="closeRightTags">
        <el-icon class="is-icon-close"><right /></el-icon>关闭右侧
      </li>
      <li class="el-dropdown-menu__item" @click="closeAllTags(selectedTag)">
        <el-icon class="is-icon-close"><circle-close /></el-icon>全部关闭
      </li>
    </ul>
    <span class="el-popper__arrow" data-popper-arrow="" style="position: absolute; left: 46px"></span>
  </div>
</template>

<script setup lang="ts">
import { getNormalPath } from '@/utils/bit'
import useTagsViewStore from '@/store/modules/tagsView'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import { ComponentInternalInstance, Ref } from 'vue'
import { RouteOption, TagView, RouteLocationRaw } from 'vue-router'

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<TagView>() as Ref<TagView>
const affixTags = ref<TagView[]>([])
const isShowHandoff = ref(false)
const navOffset = ref(0)
const elTabsNav = ref<HTMLElement>() as Ref<HTMLElement>
const elTabs = ref<HTMLElement>() as Ref<HTMLElement>
const elTabsNavScroll = ref<HTMLElement>() as Ref<HTMLElement>
const elTabsItem = ref<HTMLElement[]>() as Ref<HTMLElement[]>

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const route = useRoute()
const router = useRouter()

const visitedViews = computed(() => useTagsViewStore().visitedViews)
const routes = computed(() => usePermissionStore().routes)
const theme = computed(() => useSettingsStore().theme)

watch(route, () => {
  addTags()
  moveToCurrentTag()
})
watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})
const isActive = (r: TagView): boolean => {
  return r.path === route.path
}
const isAffix = () => {
  return selectedTag.value && selectedTag.value.meta?.affix
}
const isFirstView = () => {
  try {
    return selectedTag.value.fullPath === '/index' || selectedTag.value.fullPath === visitedViews.value[1].fullPath
  } catch (err) {
    return false
  }
}
const isLastView = () => {
  try {
    return selectedTag.value.fullPath === visitedViews.value[visitedViews.value.length - 1].fullPath
  } catch (err) {
    return false
  }
}
const filterAffixTags = (routes: RouteOption[], basePath = '') => {
  let tags: TagView[] = []
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = getNormalPath(basePath + '/' + route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}
const initTags = () => {
  const res = filterAffixTags(routes.value)
  affixTags.value = res
  for (const tag of res) {
    // Must have tag name
    if (tag.name) {
      useTagsViewStore().addVisitedView(tag)
    }
  }
}
const addTags = () => {
  const { name } = route
  if (name) {
    useTagsViewStore().addView(route)
    if (route.meta.link) {
      useTagsViewStore().addIframeView(route)
    }
  }
  showHandoff()
  return false
}
const moveToCurrentTag = () => {
  if (isShowHandoff.value) {
    nextTick(() => {
      const active = elTabsItem.value.filter((item) => item.classList.contains('is-active'))
      if (active) {
        const et = active[0]
        let distance = navOffset.value * -1 - et.offsetLeft
        if (distance > 0) {
          navOffset.value += distance
        } else {
          distance = et.offsetLeft + et.offsetWidth - (navOffset.value * -1 + elTabsNavScroll.value.offsetWidth)
          if (distance > 0) {
            navOffset.value -= distance + 2
          }
        }
      }
    })
  }
}
const refreshSelectedTag = (view: TagView) => {
  proxy?.$tab.refreshPage(view)
  if (route.meta.link) {
    useTagsViewStore().delIframeView(route)
  }
}
const openSelectedTag = (view: TagView, e: MouseEvent) => {
  proxy?.$tab.openPage({
    path: view.path ? view.path : '',
    query: view.query,
    fullPath: view.fullPath ? view.fullPath : '',
  })
  moveToCurrentTag(e)
}
const closeSelectedTag = (view: TagView) => {
  proxy?.$tab.closePage(view).then(({ visitedViews }: any) => {
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
    showHandoff()
  })
}
const closeRightTags = () => {
  proxy?.$tab.closeRightPage(selectedTag.value).then((visitedViews) => {
    if (!visitedViews.find((i) => i.fullPath === route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}
const closeLeftTags = () => {
  proxy?.$tab.closeLeftPage(selectedTag.value).then((visitedViews) => {
    if (!visitedViews.find((i) => i.fullPath === route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}
const closeOthersTags = () => {
  router.push(selectedTag.value as RouteLocationRaw).catch(() => {})
  proxy?.$tab.closeOtherPage(selectedTag.value).then(() => {
    moveToCurrentTag()
  })
}
const closeAllTags = (view: TagView) => {
  proxy?.$tab.closeAllPage().then(({ visitedViews }) => {
    if (affixTags.value.some((tag) => tag.path === route.path)) {
      return
    }
    toLastView(visitedViews, view)
  })
}
const toLastView = (visitedViews: TagView[], view?: TagView) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath as string)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view?.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view?.fullPath })
    } else {
      router.push('/')
    }
  }
}
const showHandoff = () => {
  proxy?.$nextTick(() => {
    if (elTabsNav.value.offsetWidth > elTabs.value.offsetWidth) {
      return (isShowHandoff.value = true)
    } else {
      return (isShowHandoff.value = false)
    }
  })
}
const handoffPrev = () => {
  navOffset.value =
    (navOffset.value * -1) / elTabsNavScroll.value.offsetWidth > 1.0
      ? navOffset.value + elTabsNavScroll.value.offsetWidth
      : 0
}
const handoffNext = () => {
  navOffset.value =
    elTabsNav.value.offsetWidth / elTabsNavScroll.value.offsetWidth + navOffset.value > 2.0
      ? elTabsNavScroll.value.offsetWidth * -1 + navOffset.value
      : (elTabsNav.value.offsetWidth - elTabsNavScroll.value.offsetWidth) * -1
}
const openMenu = (tag: TagView, e: MouseEvent) => {
  left.value = e.clientX - 50
  top.value = 60
  visible.value = true
  selectedTag.value = tag
}
const closeMenu = () => {
  visible.value = false
}

onMounted(() => {
  initTags()
  addTags()
})
</script>

<style lang="scss" scoped>
.el-tabs {
  .el-tabs__header {
    margin: 0;
  }
}
</style>
