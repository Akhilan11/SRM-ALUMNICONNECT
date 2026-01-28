/**
 * EmptyState - Empty state placeholders using DaisyUI
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, Search, FileX, Users, Calendar, Briefcase } from 'lucide-react';

const icons = {
  default: Inbox,
  search: Search,
  file: FileX,
  users: Users,
  events: Calendar,
  jobs: Briefcase,
};

export function EmptyState({
  icon = 'default',
  title = 'No data found',
  message = 'There is nothing here yet.',
  action,
  actionLabel = 'Add New',
  onAction,
  className = '',
}) {
  const Icon = typeof icon === 'string' ? icons[icon] || icons.default : icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`text-center py-16 bg-base-100 rounded-2xl shadow-lg ${className}`}
    >
      <Icon className="w-24 h-24 text-base-content/30 mx-auto mb-4" />
      <h3 className="text-2xl font-semibold text-base-content mb-2">
        {title}
      </h3>
      <p className="text-base-content/60 text-lg mb-6">{message}</p>
      {(action || onAction) && (
        <button onClick={onAction || action} className="btn btn-primary">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}

// Search empty state
export function NoSearchResults({ query, onClear }) {
  return (
    <EmptyState
      icon="search"
      title="No results found"
      message={query ? `No results for "${query}". Try a different search.` : 'Try adjusting your search or filter criteria.'}
      actionLabel="Clear Search"
      onAction={onClear}
    />
  );
}

// Access denied state
export function AccessDenied({ message = 'You do not have permission to view this page.' }) {
  return (
    <EmptyState
      icon="default"
      title="Access Denied"
      message={message}
    />
  );
}

export default EmptyState;
