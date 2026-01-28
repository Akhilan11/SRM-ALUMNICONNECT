// App-wide constants

export const APP_NAME = 'AlumniConnect';
export const APP_VERSION = '2.0.0';

// Firebase collection names
export const COLLECTIONS = {
  USERS: 'users',
  EVENTS: 'events',
  FUNDRAISING: 'fundraising',
  INTERNSHIPS: 'internships',
  NOTIFICATIONS: 'notifications',
  MENTORSHIP: 'mentorship',
};

// User roles
export const ROLES = {
  ADMIN: 'admin',
  ALUMNI: 'alumni',
  STUDENT: 'student',
};

// Route paths
export const ROUTES = {
  HOME: '/home',
  AUTH: '/',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  DIRECTORY: '/directory',
  EVENTS: '/events',
  EVENT_DETAILS: '/events/:id',
  MENTORSHIP: '/mentorship',
  FUNDRAISING: '/fundraising',
  ACHIEVEMENTS: '/achievement',
  NEWSLETTER: '/newsletter',
  PAYMENTS: '/payments',
  ANNOUNCEMENTS: '/announcements',
  CHATBOT: '/chatbot',
  CHAT: '/chat',
  SETTINGS: '/setting',
  USER_PROFILE: '/userprofile',
  CREDITS: '/credits',
  FORGOT_PASSWORD: '/forgot-password',
};

// Default theme colors
export const DEFAULT_THEME = {
  bgColor: '#0f172a',
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  cardBg: 'rgba(0, 0, 0, 0.2)',
  textColor: '#ffffff',
  textSecondary: '#94a3b8',
  textPrimary: '#3b82f6',
  textAccent: '#8b5cf6',
  borderColor: 'rgba(255, 255, 255, 0.2)',
  hoverBg: 'rgba(255, 255, 255, 0.1)',
};

// API endpoints
export const API = {
  CHATBOT: '/api/chatbot',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};

// File upload limits
export const FILE_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['.xlsx', '.xls', '.csv'],
};
