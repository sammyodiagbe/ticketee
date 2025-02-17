"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UserGroupIcon,
  ChatBubbleLeftIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

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
  const router = useRouter();
  const { signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            setProfile(profile);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="h-full bg-card border-r">
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

        <div className="border-t">
          <div className="flex items-center p-4">
            <img
              src={`https://ui-avatars.com/api/?name=${profile?.first_name}+${profile?.last_name}`}
              alt="Profile"
              className="w-8 h-8 rounded-full ring-1 ring-border"
            />
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profile
                  ? `${profile.first_name} ${profile.last_name}`
                  : "Loading..."}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.business_name || "Loading..."}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="ml-2 p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent"
              title="Sign out"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
