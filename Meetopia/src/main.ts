import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

type ThemeMode = 'light' | 'dark' | 'system' | null

const systemMedia = window.matchMedia('(prefers-color-scheme: dark)')

const applyTheme = (mode: ThemeMode) => {
  const setting = mode ?? 'system'
  const isDark = setting === 'dark' || (setting === 'system' && systemMedia.matches)
  document.documentElement.classList.toggle('dark', isDark)
}

applyTheme(localStorage.getItem('theme') as ThemeMode)

systemMedia.addEventListener('change', (event) => {
  const current = localStorage.getItem('theme') as ThemeMode
  if (!current || current === 'system') {
    document.documentElement.classList.toggle('dark', event.matches)
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
