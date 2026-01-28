/**
 * Utility functions for formatting data
 */

/**
 * Format a number as currency (INR)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date string to a readable format
 * @param {string|Date} dateString - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'No date';
  
  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  };
  
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return date.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format a date to show relative time (e.g., "2 hours ago")
 * @param {Date|string|object} timestamp - Firestore timestamp or date
 * @returns {string} Relative time string
 */
export const getTimeAgo = (timestamp) => {
  if (!timestamp) return 'Recently';
  
  // Handle Firestore timestamp
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
};

/**
 * Capitalize the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Normalize a string for comparison (lowercase, trimmed)
 * @param {string} val - The value to normalize
 * @returns {string} Normalized string
 */
export const normalize = (val) => {
  return val ? val.toString().toLowerCase().trim() : '';
};

/**
 * Calculate progress percentage
 * @param {number} current - Current value
 * @param {number} total - Total/goal value
 * @returns {number} Percentage (0-100)
 */
export const calculateProgress = (current, total) => {
  if (!current || !total) return 0;
  return Math.min(100, (current / total) * 100);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create slug from title
 * @param {string} title - Title to convert to slug
 * @returns {string} URL-friendly slug
 */
export const createSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
