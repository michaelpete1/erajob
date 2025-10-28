import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'landing', component: () => import('../views/Landing.vue') },
  // Auth flow
  { path: '/sign-in', name: 'sign-in', component: () => import('../views/auth/SignIn.vue') },
  { path: '/sign-up', name: 'sign-up', component: () => import('../views/auth/SignUp.vue') },
  { path: '/forgot-password', name: 'forgot-password', component: () => import('../views/auth/ForgotPassword.vue') },
  { path: '/reset-password', name: 'reset-password', component: () => import('../views/auth/ResetPassword.vue') },
  // Admin auth
  { path: '/admin/sign-in', name: 'admin-sign-in', component: () => import('../views/admin/AdminSignIn.vue') },
  // Client flow
  { path: '/client/welcome', name: 'client-welcome', component: () => import('../views/client/ClientWelcome.vue') },
  { path: '/client/explore-gigs', name: 'client-explore-gigs', component: () => import('../views/client/ClientExploreGigs.vue') },
  { path: '/client/projects', name: 'client-projects', component: () => import('../views/client/ClientProjects.vue') },
  { path: '/client/projects/:id', name: 'client-project-details', component: () => import('../views/client/ClientProjectDetails.vue') },
  { path: '/client/jobs/:id', name: 'client-job-description', component: () => import('../views/client/ClientJobDescription.vue') },
  { path: '/client/projects/create', name: 'client-create-project', component: () => import('../views/client/ClientCreateProject.vue') },
  { path: '/client/add-post', name: 'add-post', component: () => import('../views/client/ClientSummary.vue') },
  { path: '/client/congrats', name: 'client-congrats', component: () => import('../views/client/ClientCongrats.vue') },
  { path: '/client/job-application', name: 'client-job-application', component: () => import('../views/client/ClientJobApplication.vue') },
  { path: '/client/agent/:id', name: 'client-agent-profile', component: () => import('../views/client/ClientAgentProfile.vue') },
  { path: '/client/agent/:id/set-appointment', name: 'client-set-appointment', component: () => import('../views/client/ClientSetAppointment.vue') },
  { path: '/client/work-log/:jobId', name: 'client-work-log', component: () => import('../views/client/ClientWorkLog.vue') },
  { path: '/client/work-log-dashboard/:jobId', name: 'client-work-log-dashboard', component: () => import('../views/client/ClientWorkLogDashboard.vue') },
  {
    path: '/client/notifications',
    name: 'client-notifications',
    component: () => import('../views/client/ClientNotifications.vue'),
    alias: '/client/alerts'
  },
  { path: '/client/settings', name: 'client-settings', component: () => import('../views/client/ClientSettings.vue') },
  { path: '/client/account', name: 'client-account', component: () => import('../views/client/ClientAccount.vue') },
  { path: '/client/profile', name: 'client-profile', component: () => import('../views/client/ClientProfile.vue') },
  { path: '/client/proposals', name: 'client-proposals', component: () => import('../views/client/ClientProposals.vue'), meta: { requiresAuth: true, role: 'client' } },
  { path: '/client/proposals/:id', name: 'client-proposal-detail', component: () => import('../views/client/ClientProposalDetail.vue'), meta: { requiresAuth: true, role: 'client' } },
  // Agent flow
  { path: '/agent/welcome', name: 'agent-welcome', component: () => import('../views/agent/AgentWelcome.vue') },
  {
    path: '/client-dashboard',
    name: 'client-dashboard',
    component: () => import('../views/client/ClientDashboard.vue'),
    meta: { requiresAuth: true, role: 'client' }
  },
  { path: '/agent/explore-gigs', name: 'agent-explore-gigs', component: () => import('../views/agent/AgentExploreGigs.vue') },
  { path: '/agent/gigs-listing', name: 'agent-gigs-listing', component: () => import('../views/agent/AgentGigsListing.vue') },
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
  {
    path: '/agent/notifications',
    name: 'agent-notifications',
    component: () => import('../views/agent/AgentNotifications.vue'),
    alias: '/agent/alerts'
  },
  { path: '/agent/account', name: 'agent-account', component: () => import('../views/agent/AgentAccount.vue') },
  // removed duplicate/placeholder logging routes; use /agent/logs
  // Admin flow
  { path: '/admin/job-approval', name: 'admin-job-approval', component: () => import('../views/admin/AdminJobApproval.vue'), meta: { requiresAuth: true, role: 'admin' } },
  {
    path: '/admin/notifications',
    name: 'admin-notifications',
    component: () => import('../views/admin/AdminNotifications.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    alias: '/admin/alerts'
  },
  { path: '/admin/profile', name: 'admin-profile', component: () => import('../views/admin/AdminProfile.vue'), meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/job/:id', name: 'admin-job-details', component: () => import('../views/admin/AdminJobDetails.vue'), meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/job/:id/reject', name: 'admin-job-rejection', component: () => import('../views/admin/AdminJobRejection.vue'), meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/user-approvals', name: 'admin-user-approvals', component: () => import('../views/admin/AdminUserApprovals.vue'), meta: { requiresAuth: true, role: 'admin' } },
  // Utility pages
  { path: '/alerts', name: 'alerts', component: () => import('../views/Notifications.vue') },
  { path: '/call/:id', name: 'call', component: () => import('../views/Call.vue') },
  { path: '/settings', name: 'settings', component: () => import('../views/Settings.vue') },
  { path: '/profile-settings', name: 'profile-settings', component: () => import('../views/ProfileSettings.vue') },
  { path: '/terms-and-conditions', name: 'terms-and-conditions', component: () => import('../views/TermsAndConditions.vue') },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Import our auth utilities
import { clearAuthData, handleAccountDeletion, validateSession } from '@/utils/auth'
import { useToast } from 'vue-toastification'

router.beforeEach(async (to, from, next) => {
  const toast = useToast()
  const authPages = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/role-select', '/admin/sign-in']
  const publicPages = ['/', '/terms-and-conditions']

  // Handle account deletion redirect
  if (to.query.accountDeleted) {
    toast.warning('Your account has been successfully deleted.')
    // Clear the query param to prevent showing the message again on refresh
    next({ ...to, query: {} })
    return
  }

  const isPublic = publicPages.includes(to.path)
  const isAuthPage = authPages.includes(to.path)
  
  if (isPublic) {
    next()
    return
  }

  // Check for existing auth data
  const token = localStorage.getItem('access_token')
  const userRole = localStorage.getItem('userRole')
  
  // If no token but trying to access protected route, redirect to sign-in
  if (!token && !isAuthPage) {
    next({ name: 'sign-in', query: { redirect: to.fullPath } })
    return
  }
  
  // If token exists and going to auth page, redirect to appropriate dashboard
  if (token && isAuthPage) {
    const defaultRoute = userRole === 'admin' ? 'admin-job-approval' : `${userRole}-dashboard`
    next({ name: defaultRoute })
    return
  }
  
  // Validate the session for protected routes
  if (token && !isAuthPage) {
    const isValidSession = await validateSession()
    if (!isValidSession) {
      // Clear invalid session data
      clearAuthData()
      toast.warning('Your session has expired. Please sign in again.')
      next({ name: 'sign-in', query: { redirect: to.fullPath } })
      return
    }
    
    // Check route permissions based on user role
    if (to.meta.role && to.meta.role !== userRole) {
      // If user doesn't have permission, redirect to their dashboard
      const defaultRoute = userRole === 'admin' ? 'admin-job-approval' : `${userRole}-dashboard`
      next({ name: defaultRoute })
      return
    }
  }

  const hasSignupData = !!localStorage.getItem('signupBasicData')
  const signupPages = [
    '/client/welcome',
    '/client/congrats',
    '/agent/welcome',
    '/agent/congrats',
    '/agent/welcome-back'
  ]
  if (!token && hasSignupData && signupPages.includes(to.path)) {
    next()
    return
  }

  if (token && isAuthPage) {
    const forceAuthPage = to.query?.force === 'true'
    if (forceAuthPage) {
      next()
      return
    }
    if (role === 'admin') return next('/admin/job-approval')
    if (role === 'client') return next({ name: 'client-dashboard' })
    if (role === 'agent') return next({ name: 'agent-explore-gigs' })
    return next('/')
  }

  if (!token) {
    if (isAuthPage) {
      next()
      return
    }
    if (to.path.startsWith('/admin')) {
      if (to.path !== '/admin/sign-in') next('/admin/sign-in')
      else next()
    } else {
      if (to.path !== '/sign-in') next('/sign-in')
      else next()
    }
    return
  }

  const requiredRole = (to.meta as any)?.role as string | undefined
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on user's role
    if (userRole === 'admin') return next('/admin/job-approval')
    if (userRole === 'client') return next({ name: 'client-dashboard' })
    if (userRole === 'agent') return next({ name: 'agent-explore-gigs' })
    
    // If we get here, the user role is invalid or missing
    clearAuthData()
    toast.warning('Invalid user role. Please sign in again.')
    return next('/sign-in')
  }

  next()
})

export default router
