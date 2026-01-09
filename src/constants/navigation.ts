import { Home, Calendar, type LucideIcon } from "lucide-react";
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
    id: "home",
    label: NAV_LABELS.HOME,
    path: "/",
    icon: Home,
    pageTitle: PAGE_TITLES.HOME,
  },
  {
    id: "schedule",
    label: NAV_LABELS.SCHEDULE,
    path: "/schedule",
    icon: Calendar,
    pageTitle: PAGE_TITLES.SCHEDULE,
  },
];
