"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UserGroupIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Programs", href: "/programs", icon: CalendarIcon },
  { name: "Events", href: "/events", icon: CalendarIcon },
  { name: "Memberships", href: "/memberships", icon: UsersIcon },
  { name: "Documents", href: "/documents", icon: DocumentTextIcon },
];

const secondaryNavigation = [
  { name: "Payments", href: "/payments", icon: CreditCardIcon },
  { name: "People", href: "/people", icon: UserGroupIcon },
  { name: "Communication", href: "/communication", icon: ChatBubbleLeftIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-card border-r">
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <span className="text-xl font-semibold">KarateStudio</span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
          <div>
            <div className="px-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Manage
              </span>
            </div>
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm font-medium rounded-md group",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/60 hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5",
                        isActive ? "text-primary" : "text-foreground/60"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="px-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Engage
              </span>
            </div>
            <div className="space-y-1">
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm font-medium rounded-md group",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/60 hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5",
                        isActive ? "text-primary" : "text-foreground/60"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="flex items-center p-4 border-t">
          <img
            src="https://ui-avatars.com/api/?name=John+Doe"
            alt="Profile"
            className="w-8 h-8 rounded-full ring-1 ring-border"
          />
          <div className="ml-3">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">john@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
