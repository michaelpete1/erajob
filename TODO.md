# Notification System Unification

## Current Status
- AdminNotifications: Uses direct API calls, custom logic
- AgentNotifications: Uses useAlerts composable, custom UI
- ClientNotifications: Uses useAlerts composable, different UI
- Notifications.vue: Placeholder view

## Tasks
- [ ] Create unified NotificationService for all roles
- [ ] Update useAlerts composable to use new service and read endpoints
- [ ] Create shared notification components (NotificationCard, NotificationFilters, etc.)
- [ ] Update AdminNotifications.vue to use unified system
- [ ] Update AgentNotifications.vue to use unified system
- [ ] Update ClientNotifications.vue to use unified system
- [ ] Update Notifications.vue to redirect to role-specific view
- [ ] Test all notification views for consistency
- [ ] Ensure proper read/unread handling across all views

## API Endpoints to Use
- `/v1/alertss/{role}` - Get all alerts
- `/v1/alertss/{role}/read` - Get unread alerts (auto-marks as read)
- Individual alert endpoints for actions
