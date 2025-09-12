import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'landing', component: () => import('../views/Landing.vue') },
  { path: '/sign-in', name: 'sign-in', component: () => import('../views/SignIn.vue') },
  { path: '/sign-up', name: 'sign-up', component: () => import('../views/SignUp.vue') },
  { path: '/role-select', name: 'role-select', component: () => import('../views/RoleSelect.vue') },
  // Client flow
  { path: '/client/welcome', name: 'client-welcome', component: () => import('../views/ClientWelcome.vue') },
  { path: '/client/services', name: 'client-services', component: () => import('../views/ClientServices.vue') },
  { path: '/client/additional', name: 'client-additional', component: () => import('../views/ClientAdditional.vue') },
  { path: '/client/gig', name: 'client-gig', component: () => import('../views/ClientGig.vue') },
  { path: '/client/congrats', name: 'client-congrats', component: () => import('../views/ClientCongrats.vue') },
  // Agent flow
  { path: '/agent/welcome', name: 'agent-welcome', component: () => import('../views/AgentWelcome.vue') },
  { path: '/agent/services', name: 'agent-services', component: () => import('../views/AgentServices.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
