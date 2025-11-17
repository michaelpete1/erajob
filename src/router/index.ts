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
  { path: '/client/jobs', name: 'client-jobs', component: () => import('../views/client/ClientJobs.vue') },
  { 
    path: '/client/jobs/:id', 
    name: 'client-job-details', 
    component: () => import('../views/client/ClientJobDetails.vue'),
    children: [
      {
        path: '',
        name: 'client-job-overview',
        component: () => import('../views/client/ClientJobDescription.vue')
      },
      {
        path: 'agents',
        name: 'client-job-agents',
        component: () => import('../views/client/ClientRecommendedAgents.vue')
      }
    ]
  },
  { path: '/client/jobs/create', name: 'client-create-job', component: () => import('../views/client/ClientCreateJob.vue') },
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
  // Agent routes with proper auth and role requirements
  { 
    path: '/agent/explore-gigs', 
    name: 'agent-explore-gigs', 
    component: () => import('../views/agent/AgentExploreGigs.vue'),
    meta: { requiresAuth: true, role: 'agent' }
  },
  { 
    path: '/agent/gigs-listing', 
    name: 'agent-gigs-listing', 
    component: () => import('../views/agent/AgentGigsListing.vue'),
    meta: { requiresAuth: true, role: 'agent' }
  },
  { 
    path: '/agent/log-work', 
    name: 'agent-log-work', 
    component: () => import('../views/agent/AgentLogWork.vue'),
    meta: { requiresAuth: true, role: 'agent' }
  },
  { 
    path: '/agent/gig/:slug', 
    name: 'agent-gig-detail', 
    component: () => import('../views/agent/AgentGigDetail.vue'),
    meta: { requiresAuth: true, role: 'agent' }
  },
  { 
    path: '/agent/job/:slug', 
    name: 'agent-job-overview', 
    component: () => import('../views/agent/AgentJobOverview.vue'),
    meta: { requiresAuth: true, role: 'agent' }
  },
  { 
    path: '/agent/congrats', 
    name: 'agent-congrats', 
    component: () => import('../views/agent/AgentCongrats.vue'),
    meta: { requiresAuth: true, role: 'agent' }
  },
  { 
    path: '/agent/logs', 
    name: 'agent-logs', 
    component: () => import('../views/agent/AgentLoggingDashboard.vue'),
    meta: { requiresAuth: true, role: 'agent' }
  },
  { 
    path: '/agent/logging-dashboard', 
    name: 'agent-logging-dashboard', 
    component: () => import('../views/agent/AgentLoggingDashboard.vue'),
    meta: { requiresAuth: true, role: 'agent' }
  },
  { 
    path: '/agent/logging-details', 
    name: 'agent-logging-details', 
    component: () => import('../views/agent/AgentLoggingDetails.vue'),
    meta: { requiresAuth: true, role: 'agent' }
  },
  { 
    path: '/agent/log-receipt/:id?', 
    name: 'agent-log-receipt', 
    component: () => import('../views/agent/AgentLogReceipt.vue'),
    meta: { requiresAuth: true, role: 'agent' }
  },
  { 
    path: '/agent/proposition-accepted', 
    name: 'agent-proposition-accepted', 
    component: () => import('../views/agent/AgentPropositionAccepted.vue'),
    meta: { requiresAuth: true, role: 'agent' }
  },
  { 
    path: '/agent/proposition-rejected', 
    name: 'agent-proposition-rejected', 
    component: () => import('../views/agent/AgentPropositionRejected.vue'),
    meta: { requiresAuth: true, role: 'agent' }
  },
  { 
    path: '/agent/welcome-back', 
    name: 'agent-welcome-back', 
    component: () => import('../views/agent/AgentWelcomeBack.vue'),
    meta: { requiresAuth: true, role: 'agent' }
  },
  {
    path: '/agent/notifications',
    name: 'agent-notifications',
    component: () => import('../views/agent/AgentNotifications.vue'),
    alias: '/agent/alerts'
  },
  { path: '/agent/account', name: 'agent-account', component: () => import('../views/agent/AgentAccount.vue') },
  // removed duplicate/placeholder logging routes; use /agent/logs

  {
    path: '/admin/notifications',
    name: 'admin-notifications',
    component: () => import('../views/Notifications.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    alias: '/admin/alerts'
  },
  { path: '/admin/profile', name: 'admin-profile', component: () => import('../views/admin/AdminProfile.vue'), meta: { requiresAuth: true, role: 'admin' } },

  { path: '/admin/user-approvals', name: 'admin-user-approvals', component: () => import('../views/admin/AdminUserApprovals.vue'), meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/user-management', name: 'admin-user-management', component: () => import('../views/admin/AdminUserManagement.vue'), meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/propose/:jobId', name: 'admin-propose-job', component: () => import('../views/admin/AdminProposeJob.vue'), meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/memo/:agentId', name: 'admin-agent-memo', component: () => import('../views/admin/AdminMemo.vue'), meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/jobs', name: 'admin-jobs', component: () => import('../views/admin/AdminJobs.vue'), meta: { requiresAuth: true, role: 'admin' } },
  // Utility pages
  { path: '/alerts', name: 'alerts', component: () => import('../views/Notifications.vue') },
  { path: '/notifications', redirect: '/alerts' },
  { path: '/call/:id', name: 'call', component: () => import('../views/Call.vue') },
  { path: '/settings', name: 'settings', component: () => import('../views/Settings.vue') },
  { path: '/profile-settings', name: 'profile-settings', component: () => import('../views/ProfileSettings.vue') },
  { path: '/terms-and-conditions', name: 'terms-and-conditions', component: () => import('../views/TermsAndConditions.vue') },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
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
  
  // Always allow navigation to auth pages (sign-in, sign-up, etc.) to avoid redirect loops
  if (isAuthPage) {
    next()
    return
  }
  
  if (isPublic) {
    next()
    return
  }

  // Check for existing auth data first
  const token = localStorage.getItem('access_token')
  const userRole = localStorage.getItem('userRole')
  
  // Onboarding allowance must run BEFORE generic no-token redirect
  const hasSignupData = !!localStorage.getItem('signupBasicData')
  const onboardingPrefixes = ['/client/welcome', '/client/congrats', '/agent/welcome', '/agent/congrats', '/agent/welcome-back']
  const isOnboarding = onboardingPrefixes.some(prefix => to.path.startsWith(prefix))
  if (!token && hasSignupData && isOnboarding) {
    next()
    return
  }
  if (!token && !hasSignupData && isOnboarding) {
    toast.error('Signup is incomplete or expired. Please start again.')
    next('/sign-up')
    return
  }

  
  // If no token but trying to access protected route, redirect to sign-in
  if (!token && !isAuthPage) {
    // Store the intended path in sessionStorage instead of URL
    if (to.path !== '/sign-in') {
      sessionStorage.setItem('intendedPath', to.fullPath)
      next({ name: 'sign-in' })
    } else {
      next()
    }
    return
  }
  
  // If token exists and going to auth page, redirect to appropriate dashboard
  if (token && isAuthPage) {
    let defaultRoute = 'sign-in' // Fallback
    
    if (userRole === 'admin') {
      defaultRoute = 'admin-user-management'
    } else if (userRole === 'agent') {
      defaultRoute = 'agent-explore-gigs'
    } else if (userRole === 'client') {
      defaultRoute = 'client-dashboard'
    }
    
    next({ name: defaultRoute })
    return
  }
  
  // Validate the session for protected routes
  if (token && !isAuthPage) {
    const isValidSession = await validateSession()
    if (!isValidSession) {
      // Try to refresh the session first
      const { refreshSession } = await import('@/utils/auth')
      const refreshSuccess = await refreshSession()

      if (refreshSuccess) {
        // Session refreshed successfully, continue
        next()
        return
      } else {
        // Clear invalid session data
        clearAuthData()
        toast.warning('Your session has expired. Please sign in again.')
        next({ name: 'sign-in', query: { redirect: to.fullPath } })
        return
      }
    }
    
    // Check route permissions based on user role
    if (to.meta.role && to.meta.role !== userRole) {
      // If user doesn't have permission, redirect to their dashboard
      const defaultRoute = userRole === 'admin' ? 'admin-user-management' : `${userRole}-dashboard`
      next({ name: defaultRoute })
      return
    }
  }

  const requiredRole = (to.meta as any)?.role as string | undefined
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on user's role
    if (userRole === 'admin') return next('/admin/user-management')
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
