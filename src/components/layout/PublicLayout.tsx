import { Outlet } from "react-router-dom";
import { PublicNavbar } from "./PublicNavbar";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <PublicNavbar />
      <main className="flex flex-1 flex-col pt-16">
        <Outlet />
      </main>
    </div>
  );
}
