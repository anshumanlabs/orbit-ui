import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type FontSize = "small" | "medium" | "large";
type Density = "compact" | "default" | "spacious";
type Contrast = "low" | "medium" | "high";

type ThemeSettings = {
  fontSize: FontSize;
  density: Density;
  contrast: Contrast;
};

type ThemeContextValue = {
  settings: ThemeSettings;
  updateSettings: (partial: Partial<ThemeSettings>) => void;
};

const defaultSettings: ThemeSettings = {
  fontSize: "medium",
  density: "default",
  contrast: "high",
};

const STORAGE_KEY = "orbit-ui-theme-settings";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
    } catch {}
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (partial: Partial<ThemeSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeSettings = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeSettings must be used within ThemeProvider");
  return ctx;
};
