/**
 * Alert - Notification and alert components
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

const alertStyles = {
  error: {
    bg: 'bg-red-100/20 border-red-400/50',
    text: 'text-red-200',
    icon: XCircle,
  },
  success: {
    bg: 'bg-green-100/20 border-green-400/50',
    text: 'text-green-200',
    icon: CheckCircle,
  },
  warning: {
    bg: 'bg-yellow-100/20 border-yellow-400/50',
    text: 'text-yellow-200',
    icon: AlertCircle,
  },
  info: {
    bg: 'bg-blue-100/20 border-blue-400/50',
    text: 'text-blue-200',
    icon: Info,
  },
};

export function Alert({
  type = 'info',
  title,
  message,
  onClose,
  onRetry,
  className = '',
}) {
  const style = alertStyles[type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`backdrop-blur-md border rounded-lg px-4 py-3 ${style.bg} ${style.text} ${className}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {title && <strong className="block">{title}</strong>}
          {message && <span className="text-sm">{message}</span>}
        </div>
        <div className="flex items-center gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-current/20 text-base-content px-3 py-1 rounded text-sm hover:bg-current/30 transition-colors"
            >
              Retry
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="hover:bg-current/20 p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Toast notification (positioned at top-right)
export function Toast({ message, type = 'info', onClose }) {
  const style = alertStyles[type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed top-4 right-4 z-50 backdrop-blur-md border rounded-lg px-4 py-3 shadow-lg max-w-sm ${style.bg} ${style.text}`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="hover:bg-current/20 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Inline error message for forms
export function FormError({ message }) {
  if (!message) return null;

  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="text-red-200 text-sm bg-red-500/20 p-3 rounded-lg backdrop-blur-sm"
    >
      {message}
    </motion.p>
  );
}

export default Alert;
