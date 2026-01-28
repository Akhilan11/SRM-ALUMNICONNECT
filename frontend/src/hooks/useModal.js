/**
 * Custom hook for modal state management
 */
import { useState, useCallback } from 'react';

/**
 * Basic modal state hook
 */
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}

/**
 * Modal with data management (for edit modals)
 */
export function useModalWithData(initialData = null) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);

  const openCreate = useCallback(() => {
    setData(null);
    setIsEditing(false);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((editData) => {
    setData(editData);
    setIsEditing(true);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
    setIsEditing(false);
  }, []);

  return {
    isOpen,
    data,
    isEditing,
    openCreate,
    openEdit,
    close,
    setData,
  };
}

/**
 * Confirmation dialog hook
 */
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const confirm = useCallback(({ title, message, onConfirm }) => {
    setConfig({ title, message, onConfirm });
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    config.onConfirm();
    close();
  }, [config, close]);

  return {
    isOpen,
    title: config.title,
    message: config.message,
    confirm,
    close,
    handleConfirm,
  };
}
