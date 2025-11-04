<script setup lang="ts">
import type { DialogCloseProps } from "radix-vue"
import { DialogClose } from "radix-vue"

const props = defineProps<DialogCloseProps>()
</script>

<template>
  <DialogClose
    data-slot="dialog-close"
    v-bind="props"
  >
    <slot />
  </DialogClose>
</template>
