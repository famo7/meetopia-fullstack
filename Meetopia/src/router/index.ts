// create basic router that usesx only App.vue as the main component
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Landing from '../views/Landing.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import DashboardHome from '../views/DashboardHome.vue';
import Meetings from '../views/Meetings.vue';
import MeetingDetail from '../views/MeetingDetail.vue';
import LiveMeeting from '../views/LiveMeeting.vue';
import ActionItems from '../views/ActionItems.vue';
import Profile from '../views/Profile.vue';

const routes = [
  {
    path: "/",
    name: "home",
    component: Landing,
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "dashboard",
        component: DashboardHome,
      },
      {
        path: "meetings",
        name: "meetings",
        component: Meetings,
      },
      {
        path: "meetings/:id",
        name: "meeting-detail",
        component: MeetingDetail,
      },
      {
        path: "meetings/:id/live",
        name: "meeting-live",
        component: LiveMeeting,
      },
      {
        path: "action-items",
        name: "action-items",
        component: ActionItems,
      },
      {
        path: "notifications",
        name: "notifications",
        component: () => import('../views/Notifications.vue'),
      },
      {
        path: "profile",
        name: "profile",
        component: Profile,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.checkAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
