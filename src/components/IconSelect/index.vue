<template>
  <div class="relative" :style="{ width: width }">
    <el-input v-model="modelValue" readonly placeholder="点击选择图标" @click="visible = !visible">
      <template #prepend>
        <icon-park v-if="modelValue" :key="modelValue" :type="modelValue" />
      </template>
    </el-input>

    <el-popover shadow="none" :visible="visible" placement="bottom-end" trigger="click" :width="412">
      <template #reference>
        <div
          class="cursor-pointer text-[#999] absolute right-[10px] top-0 height-[32px] leading-[32px]"
          @click="visible = !visible">
          <i-ep-caret-top v-show="visible"></i-ep-caret-top>
          <i-ep-caret-bottom v-show="!visible"></i-ep-caret-bottom>
        </div>
      </template>

      <el-input v-model="filterValue" class="p-2" placeholder="搜索图标" clearable @input="filterIcons" />

      <ul v-infinite-scroll="load" class="icon-list">
        <el-tooltip
          v-for="(icon, index) in iconNames"
          :key="index"
          :content="icon.title"
          placement="bottom"
          effect="light">
          <li :class="['icon-item', { active: modelValue == icon.name }]" @click="selectedIcon(icon.name)">
            <icon-park :key="icon.name" :type="icon.name" />
          </li>
        </el-tooltip>
      </ul>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import icons from '@/components/IconSelect/requireIcons'
import { getCurrentInstance } from 'vue'
import { ComponentInternalInstance } from 'vue/dist/vue'

const props = defineProps({
  modelValue: {
    type: String,
    require: true,
  },
  width: {
    type: String,
    require: false,
    default: '400px',
  },
})

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const emit = defineEmits(['update:modelValue'])
const visible = ref(false)
const { modelValue, width } = toRefs(props)
const iconAll = ref<any[]>(icons)
const iconNames = ref<any[]>([])

const filterValue = ref('')

const load = () => {
  iconNames.value = iconAll.value.slice(0, iconNames.value?.length + 100)
}

/**
 * 筛选图标
 */
const filterIcons = () => {
  if (filterValue.value) {
    iconNames.value = icons.filter((iconName) => iconName.title.includes(filterValue.value))
  } else {
    load()
  }
}
/**
 * 选择图标
 * @param iconName 选择的图标名称
 */
const selectedIcon = (iconName: string) => {
  emit('update:modelValue', iconName)
  visible.value = false
}
</script>

<style scoped lang="scss">
.el-divider--horizontal {
  margin: 10px auto !important;
}
.icon-list {
  height: 200px;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  overflow: auto;

  .icon-item {
    width: 28px;
    height: 28px;
    cursor: pointer;
    margin: 5px;
    padding: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
    &:hover {
      border-color: var(--el-color-primary);
      color: var(--el-color-primary);
      transition: all 0.2s;
      transform: scaleX(1.1);
    }
  }
  .active {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
  }
}
</style>
