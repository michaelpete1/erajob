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
  { path: '/client/explore-gigs', name: 'client-explore-gigs', component: () => import('../views/client/ClientExploreGigs.vue') },
  { path: '/client/projects', name: 'client-projects', component: () => import('../views/client/ClientProjects.vue') },
  { path: '/client/projects/:id', name: 'client-project-details', component: () => import('../views/client/ClientProjectDetails.vue') },
  { path: '/client/jobs/:id', name: 'client-job-description', component: () => import('../views/client/ClientJobDescription.vue') },
  { path: '/client/projects/create', name: 'client-create-project', component: () => import('../views/client/ClientCreateProject.vue') },
  { path: '/client/additional', name: 'client-additional', component: () => import('../views/client/ClientAdditional.vue') },
  { path: '/client/add-post', name: 'add-post', component: () => import('../views/client/ClientSummary.vue') },
  { path: '/client/congrats', name: 'client-congrats', component: () => import('../views/client/ClientCongrats.vue') },
  { path: '/client/job-application', name: 'client-job-application', component: () => import('../views/client/ClientJobApplication.vue') },
  { path: '/client/recommended-agents', name: 'client-recommended-agents', component: () => import('../views/client/ClientRecommendedAgents.vue') },
  { path: '/client/agent/:id', name: 'client-agent-profile', component: () => import('../views/client/ClientAgentProfile.vue') },
  { path: '/client/agent/:id/set-appointment', name: 'client-set-appointment', component: () => import('../views/client/ClientSetAppointment.vue') },
  { path: '/client/work-log', name: 'client-work-log', component: () => import('../views/client/ClientWorkLog.vue') },
  { path: '/client/work-log-dashboard', name: 'client-work-log-dashboard', component: () => import('../views/client/ClientWorkLogDashboard.vue') },
  { path: '/client/notifications', name: 'client-notifications', component: () => import('../views/client/ClientNotifications.vue') },
  { path: '/client/settings', name: 'client-settings', component: () => import('../views/client/ClientSettings.vue') },
  { path: '/client/profile', name: 'client-profile', component: () => import('../views/client/ClientProfile.vue') },
  // Agent flow
  { path: '/agent/welcome', name: 'agent-welcome', component: () => import('../views/agent/AgentWelcome.vue') },
  { path: '/agent/services', name: 'agent-services', component: () => import('../views/agent/AgentServices.vue') },
  { path: '/agent/explore-gigs', name: 'agent-explore-gigs', component: () => import('../views/agent/AgentExploreGigs.vue') },
  { path: '/agent/gigs-listing', name: 'agent-gigs-listing', component: () => import('../views/agent/AgentProjectListing.vue') },
  { path: '/agent/log-work', name: 'agent-log-work', component: () => import('../views/agent/AgentLogWork.vue') },
  { path: '/agent/gig/:slug', name: 'agent-gig-detail', component: () => import('../views/agent/AgentGigDetail.vue') },
  { path: '/agent/job/:slug', name: 'agent-job-overview', component: () => import('../views/agent/AgentJobOverview.vue') },
  { path: '/agent/congrats', name: 'agent-congrats', component: () => import('../views/agent/AgentCongrats.vue') },
  { path: '/agent/logs', name: 'agent-logs', component: () => import('../views/agent/AgentLoggingDashboard.vue') },
  { path: '/agent/logging-dashboard', name: 'agent-logging-dashboard', component: () => import('../views/agent/AgentLoggingDashboard.vue') },
  { path: '/agent/logging-details', name: 'agent-logging-details', component: () => import('../views/agent/AgentLoggingDetails.vue') },
  { path: '/agent/log-receipt/:id?', name: 'agent-log-receipt', component: () => import('../views/agent/AgentLogReceipt.vue') },
  { path: '/agent/proposition-accepted', name: 'agent-proposition-accepted', component: () => import('../views/agent/AgentPropositionAccepted.vue') },
  { path: '/agent/proposition-rejected', name: 'agent-proposition-rejected', component: () => import('../views/agent/AgentPropositionRejected.vue') },
  { path: '/agent/welcome-back', name: 'agent-welcome-back', component: () => import('../views/agent/AgentWelcomeBack.vue') },
  { path: '/agent/notifications', name: 'agent-notifications', component: () => import('../views/agent/AgentNotifications.vue') },
  // removed duplicate/placeholder logging routes; use /agent/logs
  // Admin flow
  { path: '/admin/job-approval', name: 'admin-job-approval', component: () => import('../views/admin/AdminJobApproval.vue') },
  { path: '/admin/notifications', name: 'admin-notifications', component: () => import('../views/admin/AdminNotifications.vue') },
  { path: '/admin/profile', name: 'admin-profile', component: () => import('../views/admin/AdminProfile.vue') },
  // Utility pages
  { path: '/notifications', name: 'notifications', component: () => import('../views/Notifications.vue') },
  { path: '/messages', name: 'messages', component: () => import('../views/Messages.vue') },
  { path: '/settings', name: 'settings', component: () => import('../views/Settings.vue') },
  { path: '/profile-settings', name: 'profile-settings', component: () => import('../views/ProfileSettings.vue') },
  { path: '/terms-and-conditions', name: 'terms-and-conditions', component: () => import('../views/TermsAndConditions.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard to check user role
router.beforeEach((to, _from, next) => {
  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole')
  
  // Pages that should only be accessible to agents
  const agentOnlyPages = ['/agent/explore-gigs', '/agent/gigs-listing', '/agent/log-work', '/agent/logs', '/agent/logging-dashboard', '/agent/proposition-accepted', '/agent/proposition-rejected', '/agent/welcome', '/agent/services', '/agent/congrats', '/agent/welcome-back', '/agent/notifications']
  
  // Pages that should only be accessible to clients
  const clientOnlyPages = ['/client/welcome', '/client/services', '/client/explore-gigs', '/client/projects', '/client/recommended-agents', '/client/work-log', '/client/work-log-dashboard', '/client/notifications', '/client/settings', '/client/profile']
  
  // Pages that should only be accessible to admins
  const adminOnlyPages = ['/admin/job-approval', '/admin/notifications', '/admin/profile']
  
  // Auth pages that don't require role check
  const authPages = ['/sign-in', '/sign-up', '/role-select']
  
  // Skip role check for auth pages and utility pages
  if (authPages.includes(to.path) || to.path.startsWith('/terms-and-conditions')) {
    next()
    return
  }
  
  // Check if the current route is an agent-only page
  if (agentOnlyPages.some(page => to.path.startsWith(page))) {
    if (userRole !== 'agent') {
      console.log('Agent route accessed by non-agent:', to.path, 'Role:', userRole)
      // If user is not an agent, redirect to sign in
      next('/sign-in')
      return
    }
  }
  
  // Check if the current route is a client-only page
  if (clientOnlyPages.some(page => to.path.startsWith(page))) {
    if (userRole !== 'client') {
      console.log('Client route accessed by non-client:', to.path, 'Role:', userRole)
      // If user is not a client, redirect to sign in
      next('/sign-in')
      return
    }
  }
  
  // Check if the current route is an admin-only page
  if (adminOnlyPages.some(page => to.path.startsWith(page))) {
    if (userRole !== 'admin') {
      console.log('Admin route accessed by non-admin:', to.path, 'Role:', userRole)
      // If user is not an admin, redirect to sign in
      next('/sign-in')
      return
    }
  }
  
  // If user has no role, redirect to role select
  if (!userRole && !authPages.includes(to.path)) {
    console.log('No user role found, redirecting to role select')
    next('/role-select')
    return
  }
  
  next()
})

export default router
