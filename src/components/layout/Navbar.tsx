import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useSidebarStore } from "@/stores/sidebarStore";
import { NAV_ITEMS } from "@/constants/navigation";
import { ARIA_LABELS, AVATAR, PAGE_TITLES } from "@/constants/strings";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const AVATAR_URL = `https://api.dicebear.com/7.x/avataaars/svg?seed=${AVATAR.SEED}`;

export function Navbar() {
  const { toggleOpen } = useSidebarStore();
  const location = useLocation();

  const currentNavItem = NAV_ITEMS.find(
    (item) => item.path === location.pathname
  );
  const pageTitle = currentNavItem?.pageTitle || PAGE_TITLES.NOT_FOUND;

  return (
    <header className="flex h-16 items-center justify-between border-b border-border-default bg-bg px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleOpen}
          aria-label={ARIA_LABELS.TOGGLE_SIDEBAR}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5 text-text-secondary" />
        </Button>
        <h1 className="text-lg font-semibold text-text-primary">{pageTitle}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Avatar>
          <AvatarImage src={AVATAR_URL} alt={ARIA_LABELS.USER_AVATAR} />
          <AvatarFallback>{AVATAR.FALLBACK}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
