import { createPortal } from 'react-dom';
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { cn } from '../../lib/cn';

type FloatingMenuProps = {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  children: ReactNode;
  className?: string;
  offset?: number;
  zIndex?: number;
  maxViewportPadding?: number;
  menuRef?: RefObject<HTMLDivElement | null>;
};

const DEFAULT_PADDING = 12;

export default function FloatingMenu({
  anchorRef,
  open,
  children,
  className,
  offset = 8,
  zIndex = 1000,
  maxViewportPadding = DEFAULT_PADDING,
  menuRef,
}: FloatingMenuProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties | null>(null);

  const resolvedRef = menuRef ?? internalRef;

  useLayoutEffect(() => {
    if (!open) {
      setStyle(null);
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const availableWidth = Math.max(240, window.innerWidth - maxViewportPadding * 2);
      const width = Math.min(rect.width, availableWidth);
      const left = Math.max(
        maxViewportPadding,
        Math.min(rect.left, window.innerWidth - width - maxViewportPadding),
      );
      const top = rect.bottom + offset;
      const maxHeight = Math.max(160, window.innerHeight - top - maxViewportPadding);

      setStyle({
        position: 'fixed',
        top,
        left,
        width,
        maxHeight,
        zIndex,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchorRef, maxViewportPadding, offset, open, zIndex]);

  if (!open || typeof document === 'undefined' || !style) return null;

  return createPortal(
    <div
      ref={resolvedRef}
      style={{ position: 'fixed', top: style.top, left: style.left, width: style.width, zIndex: style.zIndex }}
      className="pointer-events-auto"
    >
      <div
        className="overflow-hidden rounded-2xl border border-nexus-border bg-white shadow-float"
        style={{ maxHeight: style.maxHeight }}
      >
        <div className={cn('w-full', className)}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
