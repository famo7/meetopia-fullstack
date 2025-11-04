<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-vue-next'
import { CalendarDate, type DateValue } from '@internationalized/date'

interface Props {
  modelValue?: Date
  placeholder?: string
  class?: string
}

interface Emits {
  (e: 'update:modelValue', value: Date | undefined): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Pick a date',
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)

// Convert Date to CalendarDate for the Calendar component
const calendarValue = computed(() => {
  if (!props.modelValue) return undefined
  const date = props.modelValue
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
})

const handleDateSelect = (dateValue: DateValue | undefined) => {
  if (!dateValue) {
    emit('update:modelValue', undefined)
  } else {
    // Convert CalendarDate back to Date
    const date = new Date(dateValue.year, dateValue.month - 1, dateValue.day)
    emit('update:modelValue', date)
  }
  isOpen.value = false
}

const formattedDate = computed(() => {
  if (!props.modelValue) return ''
  return format(props.modelValue, 'PPP')
})
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-full justify-start text-left font-normal',
          !modelValue && 'text-muted-foreground',
          props.class
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ modelValue ? formattedDate : placeholder }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar
        :model-value="calendarValue"
        @update:model-value="handleDateSelect"
        initial-focus
      />
    </PopoverContent>
  </Popover>
</template>