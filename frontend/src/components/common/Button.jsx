/**
 * Button - Reusable button component using DaisyUI
 */
import React from 'react';
import { motion } from 'framer-motion';

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, accent, ghost, link, info, success, warning, error
  size = 'md', // xs, sm, md, lg
  disabled = false,
  loading = false,
  fullWidth = false,
  outline = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) {
  const sizeClasses = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    link: 'btn-link',
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
    neutral: 'btn-neutral',
  };

  const baseClasses = `btn ${variantClasses[variant] || 'btn-primary'} ${sizeClasses[size]} ${outline ? 'btn-outline' : ''} ${fullWidth ? 'w-full' : ''} ${className}`;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      className={baseClasses}
      {...props}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          {children}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
      )}
    </motion.button>
  );
}

// Icon-only button variant
export function IconButton({
  icon: Icon,
  onClick,
  variant = 'ghost',
  size = 'md',
  className = '',
  title,
  ...props
}) {
  const sizeClasses = {
    sm: 'btn-sm btn-square',
    md: 'btn-square',
    lg: 'btn-lg btn-square',
  };

  const variantClasses = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    error: 'btn-error',
    circle: 'btn-circle',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      title={title}
      {...props}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  );
}

export default Button;
