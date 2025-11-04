<template>
  <select
    :value="props.modelValue"
    @change="handleChange"
    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>