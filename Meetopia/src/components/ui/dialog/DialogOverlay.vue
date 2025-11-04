<script setup lang="ts">
import { DialogOverlay } from 'radix-vue'
import type { DialogOverlayProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<DialogOverlayProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <DialogOverlay v-bind="props" :class="cn(
        'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        props.class
      )
    ">
    <slot />
  </DialogOverlay>
</template>
