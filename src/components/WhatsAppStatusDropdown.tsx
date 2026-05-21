import React from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, MessageCircle } from 'lucide-react';
import { Company, WhatsAppStatus } from '../types';
import { Language, translations } from '../utils/i18n';
import BloomCard from './ui/card';

interface WhatsAppStatusDropdownProps {
  company: Company;
  lang: Language;
  status: WhatsAppStatus;
  onUpdateWhatsAppStatus: (company: Company, nextStatus: WhatsAppStatus) => void;
  buttonClassName?: string;
  triggerLabelClassName?: string;
  placement?: 'start' | 'end';
}

const MENU_WIDTH = 248;
const ESTIMATED_MENU_HEIGHT = 168;

const WhatsAppStatusDropdown: React.FC<WhatsAppStatusDropdownProps> = ({
  company,
  lang,
  status,
  onUpdateWhatsAppStatus,
  buttonClassName = '',
  triggerLabelClassName = '',
  placement = 'start',
}) => {
  const t = translations[lang];
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [menuStyle, setMenuStyle] = React.useState<{ top: number; left: number; transform: string }>({
    top: 0,
    left: 0,
    transform: 'translateY(0)',
  });

  const statusLabel =
    status === 'CONFIRMED'
      ? t.whatsapp_confirmed
      : status === 'UNCONFIRMED'
        ? t.whatsapp_unconfirmed
        : t.whatsapp_not_available;

  const statusClass =
    status === 'CONFIRMED'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
      : status === 'UNCONFIRMED'
        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';

  const updateMenuPosition = React.useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger || typeof window === 'undefined') {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const placeAbove = rect.bottom + ESTIMATED_MENU_HEIGHT + 12 > window.innerHeight && rect.top > ESTIMATED_MENU_HEIGHT;
    const top = placeAbove ? rect.top - 12 : rect.bottom + 8;
    let left = placement === 'end' ? rect.right - MENU_WIDTH : rect.left;
    left = Math.max(8, Math.min(left, window.innerWidth - MENU_WIDTH - 8));

    setMenuStyle({
      top,
      left,
      transform: placeAbove ? 'translateY(-100%)' : 'translateY(0)',
    });
  }, [placement]);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    updateMenuPosition();

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleReposition = () => updateMenuPosition();

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isOpen, updateMenuPosition]);

  const handleSelect = (nextStatus: WhatsAppStatus) => {
    onUpdateWhatsAppStatus(company, nextStatus);
    setIsOpen(false);
  };

  const options: Array<{ value: WhatsAppStatus; label: string }> = [
    { value: 'CONFIRMED', label: t.whatsapp_confirmed },
    { value: 'UNCONFIRMED', label: t.whatsapp_unconfirmed },
    { value: 'NONE', label: t.whatsapp_not_available },
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((current) => !current);
        }}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${statusClass} ${buttonClassName}`}
        title={t.whatsapp_confirm_action}
      >
        <MessageCircle className="h-3 w-3" />
        <span className={`truncate ${triggerLabelClassName}`}>{statusLabel}</span>
        <ChevronDown className="h-3 w-3 shrink-0 opacity-80" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-[2200] w-[248px]"
            style={{
              top: `${menuStyle.top}px`,
              left: `${menuStyle.left}px`,
              transform: menuStyle.transform,
            }}
          >
            <BloomCard className="overflow-hidden">
            <div className="border-b border-nexus-sandLight px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-nexus-warmGray">
                WhatsApp
              </div>
            </div>
            <div className="p-2">
              {options.map((option) => {
                const selected = status === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={selected}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleSelect(option.value);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      selected ? 'bg-nexus-accent text-nexus-royal' : 'hover:bg-nexus-sandLight text-nexus-charcoal'
                    }`}
                  >
                    <Check className={`h-3.5 w-3.5 shrink-0 ${selected ? 'opacity-100' : 'opacity-0'}`} />
                    <span className="flex-1">{option.label}</span>
                  </button>
                );
              })}
            </div>
            </BloomCard>
          </div>,
          document.body
        )}
    </>
  );
};

export default WhatsAppStatusDropdown;
