# TODO: Update Budget to Include Fees and Rename Project to Job

## 1. Update Type Definitions
- [x] Update `src/types/api/jobs.ts` to clarify that `budget` is the total amount including service fee (10%) and tax (7%).

## 2. Modify Admin Job Approval Logic
- [x] Update `src/views/admin/AdminJobApproval.vue`:
  - Change prompt to ask for total budget (including fees).
  - Calculate base_budget = total_budget / 1.17.
  - Send base_budget to API.
  - Display total budget in UI.

## 3. Update Budget Displays
- [ ] Ensure all budget displays show the total amount (budget * 1.17).
- [ ] Update relevant files where budget is displayed (e.g., AdminJobApproval.vue, AdminProfile.vue, etc.).

## 4. Rename "Project" to "Job" in Client-Side Code
- [x] Search for all instances of "project" (case-insensitive) in client-side files.
- [x] Replace with "job" where appropriate (e.g., project_title -> job_title).
- [x] Rename files:
  - `src/views/client/ClientCreateProject.vue` -> `src/views/client/ClientCreateJob.vue` (completed)
  - `src/views/client/ClientProjectDetails.vue` -> `src/views/client/ClientJobDetails.vue` (file already exists as ClientJobDetails.vue)
  - `src/views/client/ClientProjects.vue` -> `src/views/client/ClientJobs.vue` (file already exists as ClientJobs.vue)
  - `src/views/agent/AgentProjectListing.vue` -> `src/views/agent/AgentJobListing.vue` (file already exists as AgentJobListing.vue)
- [x] Update imports and references in router, components, etc.
- [x] Updated JobsBase interface to support both job_title and project_title for backward compatibility

## 5. Verification and Testing
- [ ] Verify budget calculations are correct.
- [ ] Test admin approval process.
- [ ] Ensure no broken references after renaming.
- [ ] Run the application to check for errors.
