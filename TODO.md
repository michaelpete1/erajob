# Admin Job Approval Update Plan

## Current Status
- AdminJobApproval.vue uses hardcoded mock data
- Need to integrate with real API endpoints

## Tasks

### 1. Add Job Approval/Rejection API Methods
- [x] Add `approveJob(jobId: string)` method to apiService.ts
- [x] Add `rejectJob(jobId: string, reason?: string)` method to apiService.ts
- [x] Update API object structure to include job approval methods

### 2. Update AdminJobApproval.vue Component
- [x] Replace mock data with API call to `listAdminJobs(0, 50)` on component mount
- [x] Add loading state for job fetching
- [x] Add error handling for API failures
- [x] Update job data structure to match JobsOut interface
- [x] Implement approveJob function with API call and local state update
- [x] Implement rejectJob function with API call and local state update
- [x] Add loading states for approve/reject actions
- [x] Update filteredJobs computed to work with real data
- [x] Handle authentication errors and redirect if needed

### 3. Testing and Validation
- [ ] Test job fetching on component load
- [ ] Test approve/reject functionality
- [ ] Test error handling scenarios
- [ ] Verify admin authentication flow

### 4. Follow-up Tasks
- [ ] Update other admin pages (AdminJobDetails.vue, AdminJobRejection.vue, AdminUserApprovals.vue)
- [ ] Test end-to-end admin workflow
- [ ] Handle edge cases (no jobs, network errors, etc.)
