/**
 * Theme utility functions for DaisyUI
 */

/**
 * Generate a CSS gradient using DaisyUI color variables
 * @param {number} angle - Gradient angle in degrees
 * @returns {string} CSS gradient string using DaisyUI colors
 */
export const createGradient = (theme = null, angle = 135) => {
  // Use DaisyUI CSS variables for gradient
  return `linear-gradient(${angle}deg, oklch(var(--p)) 0%, oklch(var(--s)) 100%)`;
};

/**
 * Create inline style object for gradient text
 * @param {string} gradient - CSS gradient string
 * @returns {object} Style object for gradient text
 */
export const gradientTextStyle = (gradient) => ({
  background: gradient || createGradient(),
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
});

/**
 * Get role-specific badge class for DaisyUI
 * @param {string} role - User role (admin, alumni, student)
 * @returns {string} DaisyUI badge class
 */
export const getRoleBadgeClass = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'badge-primary';
    case 'alumni':
      return 'badge-secondary';
    case 'student':
      return 'badge-accent';
    default:
      return 'badge-neutral';
  }
};

/**
 * Get type-specific badge class for DaisyUI
 * @param {string} type - Type (internship, job, hackathon, etc.)
 * @returns {string} DaisyUI badge class
 */
export const getTypeBadgeClass = (type) => {
  switch (type?.toLowerCase()) {
    case 'internship':
      return 'badge-info';
    case 'job':
      return 'badge-success';
    case 'hackathon':
      return 'badge-secondary';
    case 'fellowship':
      return 'badge-warning';
    case 'scholarship':
      return 'badge-accent';
    default:
      return 'badge-neutral';
  }
};

/**
 * Get card type class for styling
 * @param {string} type - Card type
 * @returns {string} Additional classes for card styling
 */
export const getCardTypeClass = (type) => {
  switch (type) {
    case 'event':
      return 'border-l-4 border-l-primary';
    case 'fundraising':
      return 'border-l-4 border-l-success';
    case 'announcement':
      return 'border-l-4 border-l-secondary';
    case 'opportunity':
      return 'border-l-4 border-l-warning';
    default:
      return '';
  }
};

/**
 * Legacy function for backward compatibility - returns empty since DaisyUI handles this
 */
export const hexToRgba = (hex, alpha = 1) => {
  if (!hex) return `oklch(var(--p) / ${alpha})`;
  return `oklch(var(--p) / ${alpha})`;
};
