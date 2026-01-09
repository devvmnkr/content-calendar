import { Link, useLocation } from "react-router-dom";
import { APP_NAME, BUTTONS } from "@/constants/strings";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function PublicNavbar() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border-default bg-bg/80 px-4 backdrop-blur-sm lg:px-6">
      {/* Logo */}
      <Link to="/" className="text-lg font-semibold text-text-primary">
        {APP_NAME}
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {!isAuthPage && (
          <Button asChild size="sm">
            <Link to="/auth">{BUTTONS.LOGIN}</Link>
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
