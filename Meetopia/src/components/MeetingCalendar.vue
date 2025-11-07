<template>
  <div class="h-full flex flex-col bg-background">
    <div class="flex items-center justify-between p-6 border-b border-border">
      <div class="flex items-center gap-4">
        <h2 class="text-2xl font-bold text-foreground">Meeting Calendar</h2>
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar class="h-4 w-4" />
          <span>{{ currentMonthYear }}</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center rounded-lg border border-border bg-card p-1">
          <button @click="calendarView = 'month'" :class="[
            'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
            calendarView === 'month'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          ]">
            Month
          </button>
          <button @click="calendarView = 'week'" :class="[
            'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
            calendarView === 'week'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          ]">
            Week
          </button>
        </div>

        <div class="flex items-center gap-1">
          <Button variant="ghost" size="icon" @click="navigatePrevious" class="h-8 w-8">
            <ChevronLeft class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" @click="navigateToday" class="h-8 w-8">
            <Calendar class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" @click="navigateNext" class="h-8 w-8">
            <ChevronRight class="h-4 w-4" />
          </Button>
        </div>

        <Button @click="handleCreateMeeting" class="gap-2">
          <Plus class="h-4 w-4" />
          Create Meeting
        </Button>
      </div>
    </div>

    <div class="flex-1 overflow-auto">
      <div v-if="calendarView === 'month'" class="p-6">
        <div class="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          <div class="grid grid-cols-7 divide-x divide-border">
            <div v-for="day in weekDays" :key="day"
              class="bg-muted/50 p-3 text-center text-sm font-semibold text-foreground border-b border-border">
              {{ day }}
            </div>

            <div v-for="(day, index) in calendarDays" :key="index" :class="[
              'min-h-[120px] p-3 border-b border-border transition-colors',
              day.isCurrentMonth ? 'bg-card' : 'bg-muted/20',
              day.isToday ? 'bg-primary/5 ring-1 ring-inset ring-primary/20' : '',
              'hover:bg-accent/30 cursor-pointer'
            ]">
              <div class="flex items-center justify-between mb-2">
                <span :class="[
                  'text-sm font-semibold',
                  day.isToday ? 'flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground' : '',
                  !day.isToday && day.isCurrentMonth ? 'text-foreground' : '',
                  !day.isToday && !day.isCurrentMonth ? 'text-muted-foreground' : ''
                ]">
                  {{ day.dayNumber }}
                </span>
                <span v-if="day.meetingCount > 0"
                  class="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {{ day.meetingCount }}
                </span>
              </div>

              <div class="space-y-1">
                <div v-for="meeting in day.meetings.slice(0, 2)" :key="meeting.id" :class="[
                  'text-xs p-1.5 rounded-md border cursor-pointer transition-all hover:shadow-sm',
                  getMeetingColorClass(meeting.status)
                ]" @click.stop="viewMeeting(meeting.id)">
                  <div class="flex items-center gap-1.5">
                    <div :class="[
                      'w-1.5 h-1.5 rounded-full flex-shrink-0',
                      getStatusIndicatorClass(meeting.status)
                    ]"></div>
                    <span class="truncate font-medium leading-tight">{{ meeting.title }}</span>
                  </div>
                  <div class="text-[10px] mt-0.5 opacity-75 ml-3">
                    {{ formatMeetingTime(meeting.startTime) }}
                  </div>
                </div>
                <div v-if="day.meetings.length > 2"
                  class="text-xs text-muted-foreground px-1.5 py-1 hover:text-foreground cursor-pointer">
                  +{{ day.meetings.length - 2 }} more
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="calendarView === 'week'" class="p-6">
        <div class="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          <div class="grid grid-cols-[80px_repeat(7,1fr)] divide-x divide-border">
            <div class="bg-muted/50 border-b border-border"></div>

            <div v-for="(day, index) in weekDaysData" :key="index" :class="[
              'p-3 text-center border-b border-border',
              day.isToday ? 'bg-primary/10' : 'bg-muted/50'
            ]">
              <div class="font-semibold text-sm">{{ day.name }}</div>
              <div :class="[
                'text-xs mt-0.5',
                day.isToday ? 'text-primary font-bold' : 'text-muted-foreground'
              ]">
                {{ day.date }}
              </div>
              <div v-if="getDayMeetings(day.fullDate).length > 0" class="text-xs mt-1 text-muted-foreground">
                {{ getDayMeetings(day.fullDate).length }} meeting{{ getDayMeetings(day.fullDate).length !== 1 ? 's' : ''
                }}
              </div>
            </div>

            <template v-for="hour in timeSlots" :key="hour">
              <div class="bg-muted/30 px-2 py-3 text-right border-b border-border/50">
                <span class="text-xs font-medium text-muted-foreground">{{ hour }}</span>
              </div>

              <div v-for="(day, dayIndex) in weekDaysData" :key="dayIndex" :class="[
                'relative min-h-[80px] border-b border-border/50 hover:bg-accent/5 cursor-pointer transition-colors',
                day.isToday ? 'bg-primary/5' : ''
              ]" @click="createMeetingAtTime(day.fullDate, hour)">

                <div class="p-1 space-y-1 h-full">
                  <template v-for="(meeting, idx) in getMeetingsForDayAndHour(day.fullDate, hour)" :key="meeting.id">
                    <div v-if="idx < 2" :class="[
                      'text-xs p-2 rounded border cursor-pointer transition-all hover:shadow-sm',
                      getMeetingColorClass(meeting.status),
                      idx === 1 ? 'opacity-90' : ''
                    ]" @click.stop="viewMeeting(meeting.id)">
                      <div class="flex items-start gap-1.5">
                        <div :class="[
                          'w-1.5 h-1.5 rounded-full mt-0.5 flex-shrink-0',
                          getStatusIndicatorClass(meeting.status)
                        ]"></div>
                        <div class="flex-1 min-w-0">
                          <div class="font-medium truncate leading-tight">{{ meeting.title }}</div>
                          <div class="text-[10px] mt-0.5 opacity-75">
                            {{ formatMeetingTime(meeting.startTime) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>

                  <div v-if="getMeetingsForDayAndHour(day.fullDate, hour).length > 2"
                    class="text-[10px] px-2 py-1 bg-muted/50 rounded text-muted-foreground hover:bg-muted cursor-pointer">
                    +{{ getMeetingsForDayAndHour(day.fullDate, hour).length - 2 }} more
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-border bg-muted/30 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-primary"></div>
            <span class="text-sm text-muted-foreground">Scheduled</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <span class="text-sm text-muted-foreground">Active</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-muted-foreground"></div>
            <span class="text-sm text-muted-foreground">Ended</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-destructive"></div>
            <span class="text-sm text-muted-foreground">Cancelled</span>
          </div>
        </div>

        <div class="text-sm text-muted-foreground">
          <span class="font-medium">{{ totalMeetingsThisMonth }}</span> meetings this month
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMeetingStore } from '@/stores/meeting'
import { formatMeetingTime } from '@/lib/dateHelpers'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-vue-next'

const router = useRouter()
const meetingStore = useMeetingStore()

const calendarView = ref<'month' | 'week'>('week')
const currentDate = ref(new Date())

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
]

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days = []
  const today = new Date()

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    const meetings = getMeetingsForDate(date)

    days.push({
      date,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString(),
      meetings,
      meetingCount: meetings.length
    })
  }

  return days
})

const weekDaysData = computed(() => {
  const startOfWeek = new Date(currentDate.value)
  const day = startOfWeek.getDay()
  startOfWeek.setDate(startOfWeek.getDate() - day)

  const days = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek.getTime() + i * 24 * 60 * 60 * 1000)

    days.push({
      name: weekDays[i],
      date: date.getDate(),
      fullDate: date,
      isToday: date.toDateString() === today.toDateString()
    })
  }

  return days
})

const totalMeetingsThisMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  return meetingStore.meetings.filter(meeting => {
    const meetingDate = new Date(meeting.startTime)
    return meetingDate.getFullYear() === year && meetingDate.getMonth() === month
  }).length
})

const getMeetingsForDate = (date: Date) => {
  return meetingStore.meetings.filter(meeting => {
    const meetingDate = new Date(meeting.startTime)
    return meetingDate.toDateString() === date.toDateString()
  })
}

const getDayMeetings = (date: Date) => {
  return meetingStore.meetings.filter(meeting => {
    const meetingDate = new Date(meeting.startTime)
    return meetingDate.toDateString() === date.toDateString()
  }).sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  })
}

const getMeetingsForDayAndHour = (dayDate: Date, hour: string) => {
  const [hourNum] = hour.split(':')
  const hour24 = parseInt(hourNum)

  return meetingStore.meetings.filter(meeting => {
    const meetingDate = new Date(meeting.startTime)
    const meetingHour = meetingDate.getHours()

    const sameDay = meetingDate.getFullYear() === dayDate.getFullYear() &&
      meetingDate.getMonth() === dayDate.getMonth() &&
      meetingDate.getDate() === dayDate.getDate()

    const sameHour = meetingHour === hour24

    return sameDay && sameHour
  }).sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  })
}

const getMeetingColorClass = (status: string) => {
  switch (status) {
    case 'SCHEDULED': return 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15'
    case 'ACTIVE': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/15'
    case 'ENDED': return 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
    case 'CANCELLED': return 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15'
    default: return 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15'
  }
}

const getStatusIndicatorClass = (status: string) => {
  switch (status) {
    case 'SCHEDULED': return 'bg-primary'
    case 'ACTIVE': return 'bg-green-500'
    case 'ENDED': return 'bg-muted-foreground'
    case 'CANCELLED': return 'bg-destructive'
    default: return 'bg-primary'
  }
}

const navigatePrevious = () => {
  if (calendarView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  } else {
    currentDate.value = new Date(currentDate.value.getTime() - 7 * 24 * 60 * 60 * 1000)
  }
}

const navigateNext = () => {
  if (calendarView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  } else {
    currentDate.value = new Date(currentDate.value.getTime() + 7 * 24 * 60 * 60 * 1000)
  }
}

const navigateToday = () => {
  currentDate.value = new Date()
}

const viewMeeting = (id: number) => {
  router.push(`/dashboard/meetings/${id}`)
}

const handleCreateMeeting = () => {
  emit('createMeeting', {})
}

const createMeetingAtTime = (date: Date, hour: string) => {
  emit('createMeeting', { date, hour })
}

const emit = defineEmits<{
  createMeeting: [{ date?: Date, hour?: string }]
}>()

onMounted(async () => {
  if (meetingStore.meetings.length === 0) {
    await meetingStore.fetchMeetings()
  }
})
</script>
