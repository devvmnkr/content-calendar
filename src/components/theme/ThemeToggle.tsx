import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "@/components/ui/button";
import { ARIA_LABELS } from "@/constants/strings";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={ARIA_LABELS.TOGGLE_THEME}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-text-secondary" />
      ) : (
        <Sun className="h-5 w-5 text-text-secondary" />
      )}
    </Button>
  );
}
