import { useContext } from 'react';
import { ToastContext } from '@/context/ToastContext';

/**
 * const toast = useToast();
 * toast.success('Course created');
 * toast.error('Something went wrong', { description: 'Please try again.' });
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
