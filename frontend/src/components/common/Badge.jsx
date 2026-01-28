/**
 * Badge - Status badges and tags using DaisyUI
 */
import React from 'react';

export function Badge({
  children,
  variant = 'neutral', // neutral, primary, secondary, accent, ghost, info, success, warning, error
  size = 'md',
  outline = false,
  className = '',
}) {
  const sizeClasses = {
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg',
  };

  const variantClasses = {
    neutral: 'badge-neutral',
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    ghost: 'badge-ghost',
    info: 'badge-info',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
  };

  return (
    <span
      className={`badge ${variantClasses[variant]} ${sizeClasses[size]} ${outline ? 'badge-outline' : ''} ${className}`}
    >
      {children}
    </span>
  );
}

// Role-specific badge
export function RoleBadge({ role, icon: Icon, className = '' }) {
  const roleClasses = {
    admin: 'badge-primary',
    alumni: 'badge-secondary',
    student: 'badge-accent',
    default: 'badge-neutral',
  };

  const badgeClass = roleClasses[role?.toLowerCase()] || roleClasses.default;

  return (
    <span className={`badge ${badgeClass} gap-1 ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Unknown'}
    </span>
  );
}

// Category/type badge
export function CategoryBadge({ category, variant = 'primary', className = '' }) {
  return (
    <Badge variant={variant} className={className}>
      {category}
    </Badge>
  );
}

// Status indicator dot
export function StatusDot({ status = 'default', className = '' }) {
  const statusColors = {
    online: 'bg-success',
    offline: 'bg-base-content/30',
    busy: 'bg-error',
    away: 'bg-warning',
    default: 'bg-base-content/30',
  };

  return (
    <span
      className={`w-2 h-2 rounded-full inline-block ${statusColors[status]} ${className}`}
    />
  );
}

export default Badge;
