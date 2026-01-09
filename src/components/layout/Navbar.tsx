import { useLocation } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useAuthStore } from "@/stores/authStore";
import { NAV_ITEMS } from "@/constants/navigation";
import { ARIA_LABELS, AVATAR, PAGE_TITLES, BUTTONS } from "@/constants/strings";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Navbar() {
  const { toggleOpen } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const currentNavItem = NAV_ITEMS.find(
    (item) => item.path === location.pathname
  );
  const pageTitle = currentNavItem?.pageTitle || PAGE_TITLES.NOT_FOUND;

  const avatarUrl = user
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${AVATAR.SEED}`;

  const handleLogout = async () => {
    await logout();
  };

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
          <AvatarImage src={avatarUrl} alt={ARIA_LABELS.USER_AVATAR} />
          <AvatarFallback>
            {user?.name?.charAt(0).toUpperCase() || AVATAR.FALLBACK}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          aria-label={BUTTONS.LOGOUT}
        >
          <LogOut className="h-5 w-5 text-text-secondary" />
        </Button>
      </div>
    </header>
  );
}
