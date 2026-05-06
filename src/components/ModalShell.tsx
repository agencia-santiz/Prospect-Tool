import React, { useEffect, useRef } from 'react';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  overlayClassName?: string;
  panelClassName?: string;
  children: React.ReactNode;
}

const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  overlayClassName = '',
  panelClassName = '',
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center backdrop-blur-sm animate-fadeIn p-4 overflow-y-auto ${overlayClassName}`}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={panelClassName}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalShell;
