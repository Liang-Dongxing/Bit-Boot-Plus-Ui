<template>
  <icon-park type="help" size="20" @click="goto" />
</template>

<script setup>
const url = ref('https://javalionli.gitee.io/plus-doc')

function goto() {
  window.open(url.value)
}
</script>
