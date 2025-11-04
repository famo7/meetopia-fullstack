<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-w-lg p-0">
      <DialogHeader class="px-6 pt-6 pb-4 border-b border-border">
        <DialogTitle class="text-xl font-semibold text-foreground">
          Update Action Item
        </DialogTitle>
        <DialogDescription class="text-muted-foreground mt-1">
          Modify the details of this action item.
        </DialogDescription>
      </DialogHeader>

      <div class="px-6 py-4 space-y-5">
        <div class="space-y-2">
          <Label for="title" class="text-sm font-medium text-foreground">Title *</Label>
          <Input id="title" v-model="formData.title" placeholder="What needs to be done?" required class="h-10" />
        </div>

        <div class="space-y-2">
          <Label for="description" class="text-sm font-medium text-foreground">Description</Label>
          <Textarea id="description" v-model="formData.description" placeholder="Add more details about this task..."
            rows="3" class="resize-none" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="priority" class="text-sm font-medium text-foreground">Priority</Label>
            <Select v-model="formData.priority">
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
            <Label for="status" class="text-sm font-medium text-foreground">Status</Label>
            <Select v-model="formData.status">
              <SelectTrigger class="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN" label="Open">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-muted-foreground"></div>
                    Open
                  </div>
                </SelectItem>
                <SelectItem value="IN_PROGRESS" label="In Progress">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                    In Progress
                  </div>
                </SelectItem>
                <SelectItem value="DONE" label="Done">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                    Done
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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

        <div class="space-y-2">
          <Label for="dueDate" class="text-sm font-medium text-foreground">Due Date</Label>
          <DatePicker id="dueDate" :model-value="formData.dueDate ? new Date(formData.dueDate) : undefined"
            @update:model-value="(date: Date | undefined) => formData.dueDate = date ? date.toLocaleDateString('en-CA') : ''"
            placeholder="Select date" class="h-10" />
        </div>
      </div>

      <DialogFooter class="px-6 py-4 bg-muted/50 border-t border-border gap-3">
        <Button type="button" variant="outline" @click="closeDialog" class="flex-1">
          Cancel
        </Button>
        <Button type="button" @click="handleSubmit" :disabled="isLoading || !formData.assignedToId || !formData.title"
          class="flex-1">
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-vue-next'
import { useActionItemStore } from '@/stores/actionItem'
import { useAuthStore } from '@/stores/auth'
import DatePicker from '@/components/ui/date-picker/DatePicker.vue'
import type { ActionItem, ActionItemStatus, Participant, Priority } from '@/types'

interface Props {
  open: boolean
  item?: ActionItem | null
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

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const formData = ref({
  title: '',
  description: '',
  priority: 'MEDIUM' as Priority,
  status: 'OPEN' as ActionItemStatus,
  assignedToId: '',
  dueDate: '' as string
})

const closeDialog = () => {
  isOpen.value = false
}

const handleSubmit = async () => {
  if (!props.item) return

  isLoading.value = true
  try {
    const updateData = {
      ...formData.value,
      assignedToId: Number(formData.value.assignedToId)
    }

    await actionItemStore.updateActionItem(props.meetingId, props.item.id, updateData)
    emit('updated')
    closeDialog()
  } catch (error) {
    console.error('Failed to update action item:', error)
  } finally {
    isLoading.value = false
  }
}

watch(() => props.open, (open) => {
  if (open && props.item) {
    formData.value = {
      title: props.item.title,
      description: props.item.description,
      priority: props.item.priority,
      status: props.item.status,
      assignedToId: props.item.assignedTo.id.toString(),
      dueDate: props.item.dueDate || ''
    }
  }
})
</script>