import { useState, useEffect } from 'react';

export interface UseMenuStateOptions {
  initialOpen?: boolean;
  autoClose?: boolean;
}

export function useMenuState(options: UseMenuStateOptions = {}) {
  const { initialOpen = false, autoClose = true } = options;
  
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  // Auto-close functionality
  useEffect(() => {
    if (!autoClose || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-menu-container]')) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, autoClose]);

  return {
    isOpen,
    mounted,
    open,
    close,
    toggle,
  };
}
