<template>
  <div>
    <icon-park type="github" size="20" @click="goto" />
  </div>
</template>

<script setup>
const url = ref('https://github.com/Liang-Dongxing/Bit-Boot-Plus')

function goto() {
  window.open(url.value)
}
</script>
