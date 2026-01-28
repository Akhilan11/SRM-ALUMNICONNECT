/**
 * Loading - Reusable loading spinner and states using DaisyUI
 */
import React from 'react';

// Simple spinning loader
export function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
    xl: 'loading-lg',
  };

  return (
    <span className={`loading loading-spinner text-primary ${sizeClasses[size]} ${className}`}></span>
  );
}

// Button loader (inline)
export function ButtonLoader({ className = '' }) {
  return (
    <span className={`loading loading-spinner loading-sm ${className}`}></span>
  );
}

// Full page loading state
export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="mt-4 text-base-content/70">{message}</p>
    </div>
  );
}

// Inline loading indicator
export function LoadingIndicator({ message = 'Loading...', className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Spinner size="sm" />
      <span className="text-base-content/70">{message}</span>
    </div>
  );
}

// Skeleton loader for content
export function Skeleton({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-48 rounded-2xl',
    button: 'h-10 w-24 rounded-lg',
  };

  return (
    <div className={`skeleton ${variants[variant]} ${className}`} />
  );
}

// Card skeleton loader
export function CardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="title" className="w-1/2" />
            <Skeleton className="w-1/4" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton />
          <Skeleton />
          <Skeleton className="w-3/4" />
        </div>
      </div>
    </div>
  );
}

export default PageLoader;
