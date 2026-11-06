/**
 * Service layer.
 *
 * Every page talks to data through these functions — never to demoData directly.
 * Today they resolve mock data after a short delay. To connect a real backend,
 * replace the body of each function with a `request()` call; the UI does not change.
 *
 * Example (real API):
 *   list: (params) => request('/courses', { params }),
  *
 * The functions live in one file per area (services/*Api.js); this file re-exports them so pages keep importing
 * from '@/services/api'.
 */
export { API_BASE_URL, request } from './coreApi';
export { DEMO_CREDENTIALS, authApi, DEMO_OTP, profileApi } from './authApi';
export { coursesApi, studentsApi, instructorsApi } from './learningApi';
export { entitiesApi, subEntitiesApi, expenseHeadsApi } from './financeMastersApi';
export { locationsApi, peopleMastersApi, sapBpApi } from './mastersApi';
export { programCategoriesApi, modulesApi, programsApi } from './contentApi';
export { menusApi, ACCESS_ACTIONS, menuActions, rolesAccessApi } from './accessApi';
export { usersApi } from './usersApi';
export { financialYearOf, facilitatorsApi } from './facilitatorsApi';
export { clientsApi } from './clientsApi';
export { scheduleApi, messagesApi, activityApi, analyticsApi, coachingApi, securityApi, dashboardApi, notificationsApi, lookupsApi } from './dashboardApi';
export { searchAll } from './searchApi';
export { partnersApi, DEFAULT_SETTINGS as PARTNER_DEFAULT_SETTINGS } from './partnersApi';
