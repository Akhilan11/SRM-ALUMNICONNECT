/**
 * PageLayout - Common page layout components using DaisyUI
 */
import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageBackground - Simple background using DaisyUI base colors
 */
export function PageBackground() {
  return (
    <div className="min-h-screen w-full fixed top-0 left-0 z-[-1] bg-base-200 transition-colors duration-300" />
  );
}

/**
 * PageContainer - Standard page container with background
 */
export function PageContainer({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-base-200 ${className}`}>
      {children}
    </div>
  );
}

/**
 * PageHeader - Animated page header with title and description
 */
export function PageHeader({ 
  title, 
  description, 
  icon: Icon,
  actions,
  className = '' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="p-3 bg-primary/10 rounded-xl">
              <Icon className="w-8 h-8 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-base-content">{title}</h1>
            {description && (
              <p className="text-base-content/60 mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex gap-2">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * ContentCard - Standard content card with optional title
 */
export function ContentCard({ 
  title, 
  icon: Icon,
  children, 
  className = '',
  actions,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card bg-base-100 shadow-lg ${className}`}
    >
      <div className="card-body">
        {(title || actions) && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {Icon && <Icon className="w-5 h-5 text-primary" />}
              {title && <h2 className="card-title">{title}</h2>}
            </div>
            {actions}
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
}

/**
 * GridLayout - Responsive grid layout
 */
export function GridLayout({ 
  children, 
  cols = 3, 
  gap = 6,
  className = '' 
}) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${colClasses[cols]} gap-${gap} ${className}`}>
      {children}
    </div>
  );
}

export default PageContainer;
