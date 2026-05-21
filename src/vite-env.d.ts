interface BloomDesktopBridge {
  isDesktop?: boolean;
  backendUrl?: string;
  frontendUrl?: string;
  frontendHost?: string;
  frontendPort?: string;
  backendHost?: string;
  backendPort?: string;
  updates?: {
    enabled?: boolean;
    provider?: string;
    updateUrl?: string;
    updateChannel?: string;
    autoDownload?: boolean;
    checkOnStartup?: boolean;
  };
  storage?: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => string | null;
    removeItem: (key: string) => string | null;
    clear: () => string | null;
  };
}

declare global {
  interface Window {
    bloomDesktop?: BloomDesktopBridge;
  }
}

export {};
