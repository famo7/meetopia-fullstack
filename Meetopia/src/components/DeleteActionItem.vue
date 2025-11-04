<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[400px] p-0">
      <div class="px-6 py-4">
        <div class="flex items-center gap-3 text-red-600 mb-3">
          <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <Trash2 class="h-4 w-4" />
          </div>
          <DialogTitle class="text-base font-semibold text-slate-800">Delete Action Item</DialogTitle>
        </div>
        <DialogDescription class="text-slate-600 text-sm mb-4">
          Are you sure you want to delete this action item? This action cannot be undone.
        </DialogDescription>

        <div v-if="itemToDelete" class="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <h4 class="font-medium text-slate-800 text-sm">{{ itemToDelete.title }}</h4>
          <p v-if="itemToDelete.description" class="text-xs text-slate-600 mt-1">
            {{ itemToDelete.description }}
          </p>
        </div>
      </div>

      <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3 justify-end">
        <Button type="button" variant="outline" @click="closeDialog" class="px-3 py-2">
          Cancel
        </Button>
        <Button type="button" variant="destructive" @click="confirmDelete" :disabled="isLoading"
          class="px-3 py-2">
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Delete
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-vue-next'
import { useActionItemStore } from '@/stores/actionItem'
import type { ActionItem } from '@/types'

interface Props {
  open: boolean
  item?: ActionItem | null
  meetingId: number
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'deleted'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const actionItemStore = useActionItemStore()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const isLoading = ref(false)
const itemToDelete = computed(() => props.item)

const closeDialog = () => {
  isOpen.value = false
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  isLoading.value = true
  try {
    await actionItemStore.deleteActionItem(props.meetingId, itemToDelete.value.id)
    emit('deleted')
    closeDialog()
  } catch (err) {
    console.error('Failed to delete action item:', err)
  } finally {
    isLoading.value = false
  }
}
</script>