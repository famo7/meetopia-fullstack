<template>
  <span>{{ modelValue || placeholder }}</span>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  placeholder?: string
}

defineProps<Props>()
</script>