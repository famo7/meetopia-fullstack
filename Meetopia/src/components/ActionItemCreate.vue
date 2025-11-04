<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-lg p-0">
      <DialogHeader class="px-6 pt-6 pb-4 border-b border-border">
        <DialogTitle class="text-xl font-semibold text-foreground">
          Create Action Item
        </DialogTitle>
        <DialogDescription class="text-muted-foreground mt-1">
          Add a new task to track progress and assignments.
        </DialogDescription>
      </DialogHeader>

      <div class="px-6 py-4 space-y-5">
        <div class="space-y-2">
          <Label for="title" class="text-sm font-medium text-foreground">Title *</Label>
          <Input id="title" v-model="safeFormData.title" placeholder="What needs to be done?" required class="h-10" />
        </div>

        <div class="space-y-2">
          <Label for="description" class="text-sm font-medium text-foreground">Description</Label>
          <Textarea id="description" v-model="safeFormData.description"
            placeholder="Add more details about this task..." rows="3" class="resize-none" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="priority" class="text-sm font-medium text-foreground">Priority</Label>
            <Select v-model="safeFormData.priority">
              <SelectTrigger class="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW" label="Low">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-green-500"></div>
                    Low
                  </div>
                </SelectItem>
                <SelectItem value="MEDIUM" label="Medium">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                    Medium
                  </div>
                </SelectItem>
                <SelectItem value="HIGH" label="High">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-red-500"></div>
                    High
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="dueDate" class="text-sm font-medium text-foreground">Due Date</Label>
            <DatePicker id="dueDate" v-model="dueDateValue" placeholder="Select date" class="h-10" />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="assignedTo" class="text-sm font-medium text-foreground">Assigned To *</Label>
          <Select v-model="formData.assignedToId">
            <SelectTrigger class="h-10">
              <SelectValue placeholder="Select team member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="participant in participants" :key="participant.user.id" :value="participant.user.id"
                :label="participant.user.id === authStore.user?.id ? `${participant.user.name} (You)` : participant.user.name">
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter class="px-6 py-4 bg-muted/50 border-t border-border gap-3">
        <Button type="button" variant="outline" @click="$emit('update:open', false)" class="flex-1">
          Cancel
        </Button>
        <Button type="button" @click="handleSubmit" :disabled="isLoading" class="flex-1">
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Create Action Item
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Loader2 } from 'lucide-vue-next'
import type { Participant } from '@/types'
import type { CreateActionItemRequest, Priority } from '@/types/actionItem'
import { useActionItemStore } from '@/stores/actionItem'
import { useAuthStore } from '@/stores/auth'

interface Props {
  open: boolean
  meetingId: number
  participants: Participant[]
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const actionItemStore = useActionItemStore()
const authStore = useAuthStore()
const isLoading = ref(false)

const formData = ref<CreateActionItemRequest>({
  title: '',
  description: '',
  priority: 'MEDIUM',
  dueDate: '',
  assignedToId: undefined
})

const safeFormData = computed(() => formData.value || {
  title: '',
  description: '',
  priority: 'MEDIUM',
  dueDate: '',
  assignedToId: undefined
})

const dueDateValue = computed({
  get: () => formData.value.dueDate ? new Date(formData.value.dueDate) : undefined,
  set: (value) => {
    formData.value.dueDate = value ? value.toLocaleDateString('en-CA') : ''
  }
})

watch(() => props.open, (newVal) => {
  if (!newVal) {
    formData.value = {
      title: '',
      description: '',
      priority: 'MEDIUM' as Priority,
      dueDate: '',
      assignedToId: undefined
    }
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  try {
    await actionItemStore.createActionItem(props.meetingId, {
      title: formData.value.title,
      description: formData.value.description,
      priority: formData.value.priority,
      assignedToId: Number(formData.value.assignedToId),
      dueDate: formData.value.dueDate || undefined,
      status: 'OPEN'
    })

    await actionItemStore.fetchActionItems(props.meetingId)
    emit('updated')
    emit('update:open', false)

    formData.value = {
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: '',
      assignedToId: undefined
    }
  } catch (error) {
    console.error('Failed to create action item:', error)
  } finally {
    isLoading.value = false
  }
}
</script>