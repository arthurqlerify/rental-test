import { Link, Outlet } from "react-router-dom";
import { Home, ClipboardList, Package, Hammer, Wrench, Building, DoorOpen, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Header } from "@/components/shared/Header";
import React from "react";

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Link
        to={to}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
      >
        <Icon className="h-5 w-5" />
        <span className="sr-only">{label}</span>
      </Link>
    </TooltipTrigger>
    <TooltipContent side="right">{label}</TooltipContent>
  </Tooltip>
);

export function Layout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            to="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Settings className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Rental Management</span>
          </Link>
          <NavLink to="/dashboard" icon={Home} label="Dashboard" />
          <NavLink to="/leases" icon={ClipboardList} label="Leases" />
          <NavLink to="/turnovers" icon={DoorOpen} label="Turnovers" />
          <NavLink to="/inspections" icon={Package} label="Inspections" />
          <NavLink to="/renovations" icon={Hammer} label="Renovations" />
          <NavLink to="/work-orders" icon={Wrench} label="Work Orders" />
          <NavLink to="/properties" icon={Building} label="Properties" />
          {/* Add more navigation links here as needed */}
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}