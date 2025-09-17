import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'landing', component: () => import('../views/Landing.vue') },
  // Auth flow
  { path: '/sign-in', name: 'sign-in', component: () => import('../views/auth/SignIn.vue') },
  { path: '/sign-up', name: 'sign-up', component: () => import('../views/auth/SignUp.vue') },
  { path: '/role-select', name: 'role-select', component: () => import('../views/auth/RoleSelect.vue') },
  // Client flow
  { path: '/client/welcome', name: 'client-welcome', component: () => import('../views/client/ClientWelcome.vue') },
  { path: '/client/services', name: 'client-services', component: () => import('../views/client/ClientServices.vue') },
  { path: '/client/additional', name: 'client-additional', component: () => import('../views/client/ClientAdditional.vue') },
  { path: '/client/gig', name: 'client-gig', component: () => import('../views/client/ClientGig.vue') },
  { path: '/client/add-post', name: 'add-post', component: () => import('../views/client/ClientSummary.vue') },
  { path: '/client/congrats', name: 'client-congrats', component: () => import('../views/client/ClientCongrats.vue') },
  { path: '/client/explore-gigs', name: 'client-explore-gigs', component: () => import('../views/client/ClientExploreGigs.vue') },
  { path: '/client/gigs-listing', name: 'client-gigs-listing', component: () => import('../views/client/ClientGigsListing.vue') },
  { path: '/client/job-application', name: 'client-job-application', component: () => import('../views/client/ClientJobApplication.vue') },
  // Agent flow
  { path: '/agent/welcome', name: 'agent-welcome', component: () => import('../views/agent/AgentWelcome.vue') },
  { path: '/agent/services', name: 'agent-services', component: () => import('../views/agent/AgentServices.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
