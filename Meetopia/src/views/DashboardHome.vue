<template>
  <div class="space-y-8">
    <!-- Loading State -->
    <div v-if="dashboardStore.isLoading" class="space-y-8">
      <!-- Welcome Section Skeleton -->
      <div class="space-y-2">
        <Skeleton class="h-9 w-64" />
        <Skeleton class="h-5 w-48" />
      </div>

      <!-- Quick Actions Skeleton -->
      <div class="flex gap-3">
        <Skeleton class="h-12 w-40" />
        <Skeleton class="h-12 w-40" />
      </div>

      <!-- Key Metrics Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card v-for="i in 4" :key="i">
          <CardHeader class="pb-2">
            <Skeleton class="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-8 w-16 mb-1" />
            <Skeleton class="h-3 w-20" />
          </CardContent>
        </Card>
      </div>

      <!-- Upcoming Meetings Skeleton -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <Skeleton class="h-6 w-40" />
              <Skeleton class="h-4 w-32" />
            </div>
            <Skeleton class="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="i in 3" :key="i" class="flex items-center justify-between p-3 rounded-lg border">
              <div class="flex items-center gap-3 flex-1">
                <Skeleton class="h-2 w-2 rounded-full" />
                <div class="flex-1 space-y-2">
                  <Skeleton class="h-4 w-48" />
                  <div class="flex items-center gap-4">
                    <Skeleton class="h-3 w-24" />
                    <Skeleton class="h-3 w-28" />
                  </div>
                </div>
              </div>
              <Skeleton class="h-8 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Action Items Skeleton -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <Skeleton class="h-6 w-40" />
              <Skeleton class="h-4 w-32" />
            </div>
            <Skeleton class="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="i in 3" :key="i" class="flex items-start gap-3 p-3 rounded-lg border">
              <Skeleton class="h-4 w-4 rounded-full mt-1" />
              <div class="flex-1 space-y-2">
                <Skeleton class="h-4 w-56" />
                <div class="flex items-center gap-3">
                  <Skeleton class="h-3 w-24" />
                  <Skeleton class="h-3 w-32" />
                </div>
              </div>
              <Skeleton class="h-5 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Error State -->
    <div v-else-if="dashboardStore.error" class="text-center py-12">
      <AlertCircle class="h-12 w-12 mx-auto mb-4 text-destructive" />
      <p class="text-destructive mb-4">{{ dashboardStore.error }}</p>
      <Button @click="dashboardStore.refreshDashboard()">Try Again</Button>
    </div>

    <!-- Dashboard Content -->
    <template v-else-if="dashboardStore.data">
      <!-- Welcome Section -->
      <div class="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/10">
        <h1 class="text-3xl font-bold tracking-tight">Welcome back, {{ authStore.user?.name }}!</h1>
        <p class="text-muted-foreground mt-2 text-lg">Here's what's happening today</p>
      </div>

      <!-- Quick Actions -->
      <div class="flex gap-3">
        <Button size="lg" class="gap-2 h-12 px-6 rounded-xl shadow-sm" @click="showCreateMeeting = true">
          <Plus class="h-4 w-4" />
          Create Meeting
        </Button>
        <Button variant="outline" size="lg" class="gap-2 h-12 px-6 rounded-xl" @click="router.push('/dashboard/meetings')">
          <List class="h-4 w-4" />
          View All Meetings
        </Button>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card class="rounded-xl border-0 shadow-sm bg-gradient-to-br from-card to-card/50">
          <CardHeader class="flex flex-row items-center justify-between pb-3">
            <CardTitle class="text-sm font-medium text-muted-foreground">Today's Meetings</CardTitle>
            <div class="p-2 rounded-lg bg-primary/10">
              <Calendar class="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold">{{ dashboardStore.today?.meetingsCount || 0 }}</div>
            <p class="text-sm text-muted-foreground mt-1">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card class="rounded-xl border-0 shadow-sm bg-gradient-to-br from-card to-card/50">
          <CardHeader class="flex flex-row items-center justify-between pb-3">
            <CardTitle class="text-sm font-medium text-muted-foreground">Pending Actions</CardTitle>
            <div class="p-2 rounded-lg bg-orange-500/10">
              <AlertCircle class="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold">{{ pendingActionsCount }}</div>
            <p class="text-sm text-muted-foreground mt-1">Tasks to complete</p>
          </CardContent>
        </Card>

        <Card class="rounded-xl border-0 shadow-sm bg-gradient-to-br from-card to-card/50">
          <CardHeader class="flex flex-row items-center justify-between pb-3">
            <CardTitle class="text-sm font-medium text-muted-foreground">This Week</CardTitle>
            <div class="p-2 rounded-lg bg-green-500/10">
              <TrendingUp class="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold">{{ dashboardStore.thisWeek?.meetingsCount || 0 }}</div>
            <p class="text-sm text-muted-foreground mt-1">meetings scheduled</p>
          </CardContent>
        </Card>

        <Card class="rounded-xl border-0 shadow-sm bg-gradient-to-br from-card to-card/50">
          <CardHeader class="flex flex-row items-center justify-between pb-3">
            <CardTitle class="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            <div class="p-2 rounded-lg bg-blue-500/10">
              <CheckCircle2 class="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold">{{ completionRate }}%</div>
            <p class="text-sm text-muted-foreground mt-1">of action items</p>
          </CardContent>
        </Card>
      </div>

      <!-- Upcoming Meetings -->
      <Card class="rounded-xl border-0 shadow-sm">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>Next 24 hours</CardDescription>
            </div>
            <Button variant="ghost" size="sm" @click="router.push('/dashboard/meetings')">
              View All →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="meeting in dashboardStore.today?.meetings || []" :key="meeting.id"
              class="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-all duration-200 cursor-pointer hover:shadow-sm">
              <div class="flex items-center gap-3 flex-1">
                <div :class="`w-2 h-2 rounded-full ${meeting.status === 'ACTIVE' ? 'bg-green-500' :
                  meeting.status === 'SCHEDULED' ? 'bg-blue-500' :
                    meeting.status === 'ENDED' ? 'bg-gray-500' :
                      meeting.status === 'CANCELLED' ? 'bg-red-500' : 'bg-yellow-500'
                  }`"></div>
                <div class="flex-1">
                  <p class="font-medium">{{ meeting.title }}</p>
                  <div class="flex items-center gap-4 mt-1">
                    <p class="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock class="h-3 w-3" />
                      {{ formatMeetingTime(meeting.startTime) }}
                    </p>
                    <p class="text-sm text-muted-foreground flex items-center gap-1">
                      <Users class="h-3 w-3" />
                      {{ meeting.participants?.length || 0 }} participants
                    </p>
                  </div>
                </div>
              </div>
              <Button size="sm" :variant="meeting.status === 'ACTIVE' ? 'default' : 'outline'"
                :disabled="meeting.status !== 'ACTIVE'"
                @click.stop="meeting.status === 'ACTIVE' && router.push(`/dashboard/meetings/${meeting.id}`)">
                {{ meeting.status === 'ACTIVE' ? 'Join Now' : 'Join' }}
              </Button>
            </div>
            <div v-if="(dashboardStore.today?.meetings || []).length === 0"
              class="text-center py-8 text-muted-foreground">
              <Calendar class="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No meetings in the next 24 hours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="rounded-xl border-0 shadow-sm">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Your Action Items</CardTitle>
              <CardDescription>Tasks assigned to you</CardDescription>
            </div>
            <Button variant="ghost" size="sm" @click="router.push('/dashboard/action-items')">
              View All →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="item in pendingActionItems" :key="item.id" @click="router.push(`/dashboard/action-items`)"
              class="flex items-start gap-3 p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-all duration-200 cursor-pointer group hover:shadow-sm">
              <!-- Status Indicator -->
              <div class="mt-1">
                <div v-if="item.status === 'IN_PROGRESS'"
                  class="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                  <Clock class="h-3 w-3 text-white" />
                </div>
                <div v-else class="h-4 w-4 rounded-full border-2 border-muted-foreground"></div>
              </div>

              <div class="flex-1 min-w-0">
                <p class="font-medium">{{ item.title }}</p>
                <div class="flex items-center gap-3 mt-1 text-xs">
                  <p class="text-muted-foreground">Due: {{ item.dueDate ? formatDueDate(item.dueDate) : 'No due date' }}
                  </p>
                  <p class="text-muted-foreground truncate">{{ item.meeting.title }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <Badge :variant="item.priority === 'HIGH' ? 'destructive' :
                  item.priority === 'MEDIUM' ? 'default' : 'secondary'">
                  {{ item.priority?.toLowerCase() || 'low' }}
                </Badge>
                <ChevronRight
                  class="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div v-if="pendingActionItems.length === 0" class="text-center py-8 text-muted-foreground">
              <CheckCircle2 class="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>All caught up! No pending action items</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </template>

    <!-- Create Meeting Modal -->
    <CreateMeeting :is-open="showCreateMeeting" @close="showCreateMeeting = false" @success="handleMeetingCreated" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'
import { formatMeetingTime, formatDueDate } from '@/lib/dateHelpers'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Calendar, Clock, Users, CheckCircle2, Plus, AlertCircle, TrendingUp, ChevronRight, List } from 'lucide-vue-next'
import CreateMeeting from '@/components/CreateMeeting.vue'

const router = useRouter()
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const showCreateMeeting = ref(false)

// Get pending action items from dashboard store
const pendingActionItems = computed(() => {
  return dashboardStore.data?.actionItems?.pending || []
})

const pendingActionsCount = computed(() => {
  return dashboardStore.data?.actionItems?.pendingCount || 0
})

const completionRate = computed(() => {
  const total = dashboardStore.data?.actionItems?.totalCount || 0
  const completed = dashboardStore.data?.actionItems?.completedCount || 0
  return total > 0 ? Math.round((completed / total) * 100) : 0
})

const handleMeetingCreated = async () => {
  await dashboardStore.refreshDashboard()
}

onMounted(async () => {
  await dashboardStore.fetchDashboard()
})
</script>
