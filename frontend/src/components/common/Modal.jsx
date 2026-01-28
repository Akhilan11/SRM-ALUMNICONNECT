/**
 * Modal - Reusable modal dialog component using DaisyUI
 */
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = '',
}) {
  const modalRef = useRef(null);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal modal-open">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`modal-box ${sizeClasses[size]} ${className}`}
            ref={modalRef}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex justify-between items-center mb-4">
                {title && (
                  <h3 className="font-bold text-lg">{title}</h3>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
              {children}
            </div>
          </motion.div>
          <div className="modal-backdrop bg-neutral/50" onClick={onClose}></div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Confirm dialog variant
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'error', // error, warning, info
}) {
  const variantClasses = {
    error: 'btn-error',
    warning: 'btn-warning',
    info: 'btn-info',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="py-4">{message}</p>
      <div className="modal-action">
        <button onClick={onClose} className="btn btn-ghost">
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`btn ${variantClasses[variant]}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export default Modal;
