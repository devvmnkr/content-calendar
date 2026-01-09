import { NavLink, useLocation } from "react-router-dom";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebarStore";
import { NAV_ITEMS } from "@/constants/navigation";
import { ARIA_LABELS, APP_NAME } from "@/constants/strings";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function Sidebar() {
  const { isOpen, isCollapsed, toggleCollapsed, closeMobile } =
    useSidebarStore();
  const location = useLocation();

  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.5)] lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-border-default bg-bg transition-all duration-300",
          "lg:relative lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "lg:w-[68px]" : "w-64"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-border-default px-4",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!isCollapsed && (
            <span className="text-lg font-semibold text-text-primary">
              {APP_NAME}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            aria-label={
              isCollapsed
                ? ARIA_LABELS.EXPAND_SIDEBAR
                : ARIA_LABELS.COLLAPSE_SIDEBAR
            }
            className="hidden lg:flex"
          >
            {isCollapsed ? (
              <PanelLeft className="h-5 w-5 text-text-secondary" />
            ) : (
              <PanelLeftClose className="h-5 w-5 text-text-secondary" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-4"
          aria-label={ARIA_LABELS.NAVIGATION}
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  style={{ padding: "12px 16px" }}
                  className={({ isActive }) =>
                    cn(
                      "flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                      "hover:bg-surface-1",
                      isActive
                        ? "bg-[rgba(var(--primary-main)/0.12)] text-primary-main"
                        : "text-text-secondary",
                      isCollapsed && "justify-center px-3!"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
