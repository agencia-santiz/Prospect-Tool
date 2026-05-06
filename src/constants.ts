
import { LucideIcon, Globe, ListFilter, Users, Kanban } from 'lucide-react';
import { Language } from './utils/i18n';

export const APP_NAME = "Bloom Leads";

export const LANGUAGES: { label: string; value: Language; flag: string }[] = [
  { label: 'Português', value: 'pt', flag: '🇧🇷' },
  { label: 'English', value: 'en', flag: '🇺🇸' },
  { label: 'Español', value: 'es', flag: '🇪🇸' },
  { label: '日本語', value: 'ja', flag: '🇯🇵' },
  { label: '中文', value: 'zh', flag: '🇨🇳' },
  { label: 'Deutsch', value: 'de', flag: '🇩🇪' },
];

export interface NavGroup {
    title: string;
    items: {
        id: string;
        label: string;
        icon: LucideIcon;
    }[];
}

export const NAV_STRUCTURE: NavGroup[] = [
    {
        title: "Prospecção",
        items: [
            { id: 'explore', label: 'Explorar Negócios', icon: Globe },
            { id: 'lists', label: 'Minhas Listas', icon: ListFilter },
        ]
    },
    {
        title: "Vendas",
        items: [
            { id: 'pipeline', label: 'Pipeline (Kanban)', icon: Kanban },
            { id: 'contacts', label: 'Contatos', icon: Users },
        ]
    }
];

export const STAGE_COLORS = [
    '#9CA3AF', // Gray (Cold)
    '#60A5FA', // Blue (Contacted)
    '#FBBF24', // Amber (Qualified)
    '#A78BFA', // Purple (Proposal)
    '#34D399', // Emerald (Won)
    '#F87171', // Red (Lost)
    '#F472B6', // Pink
    '#2DD4BF', // Teal
];
