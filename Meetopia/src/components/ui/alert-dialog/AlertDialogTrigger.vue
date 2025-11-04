<script setup lang="ts">
import type { AlertDialogTriggerProps } from "radix-vue"
import { AlertDialogTrigger } from "radix-vue"

const props = defineProps<AlertDialogTriggerProps>()
</script>

<template>
  <AlertDialogTrigger data-slot="alert-dialog-trigger" v-bind="props">
    <slot />
  </AlertDialogTrigger>
</template>
