import { LayoutDashboard, type LucideIcon } from "lucide-react";
import { NAV_LABELS, PAGE_TITLES } from "./strings";

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  pageTitle: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: NAV_LABELS.DASHBOARD,
    path: "/dashboard",
    icon: LayoutDashboard,
    pageTitle: PAGE_TITLES.DASHBOARD,
  },
];
