"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Mail,
  MessageSquare,
  Ban,
  Bell,
  Settings,
  LogOut,
  HelpCircle,
  User,
  FileText,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface Attendee {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive" | "Blacklisted";
  beltLevel: string;
  joinDate: string;
  initials: string;
}

// Mock data
const mockAttendees: Attendee[] = Array.from({ length: 5 }, (_, i) => ({
  id: `${i + 1}`,
  name: "John Doe",
  email: "john@example.com",
  status: "Active",
  beltLevel: "Yellow Belt",
  joinDate: "Jan 15, 2024",
  initials: "JD",
}));

export default function AttendeesPage() {
  const [attendees] = useState<Attendee[]>(mockAttendees);

  const handleSendEmail = (email: string) => {
    // Implement email sending logic
    console.log("Sending email to:", email);
  };

  const handleSendText = (id: string) => {
    // Implement text message sending logic
    console.log("Sending text to attendee:", id);
  };

  const handleBlacklist = (id: string) => {
    // Implement blacklist logic
    console.log("Blacklisting attendee:", id);
  };

  return (
    <div className="flex-1">
      {/* Navigation Bar */}
      <div className="border-b dark:border-muted">
        <div className="flex h-16 items-center px-8">
          <div className="ml-auto flex items-center gap-4">
            {/* Quick Links */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <FileText className="h-5 w-5" />
                  <span className="sr-only">Quick links</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/events/create" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Create Event</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/documents" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Documents</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2 border-b dark:border-muted">
                  <h3 className="font-medium">Notifications</h3>
                  <Button variant="ghost" size="sm">
                    Mark all as read
                  </Button>
                </div>
                <div className="py-2">
                  <div className="px-4 py-2 hover:bg-muted transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        JD
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">John Doe</span>{" "}
                          registered for Summer Music Festival
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          2 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Add more notifications here */}
                </div>
                <div className="px-4 py-2 border-t dark:border-muted">
                  <Button variant="ghost" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help */}
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    SA
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    SA
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Sammy Osaro</span>
                    <span className="text-xs text-muted-foreground">
                      admin@karatestudio.com
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Attendees</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage event attendees and their status
              </p>
            </div>
            <Button>Add Attendee</Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search attendees..."
                className="w-full pl-10 pr-4 h-10 bg-background border dark:border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select className="h-10 px-3 bg-background border dark:border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blacklisted">Blacklisted</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-card border dark:border-muted rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-muted">
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Belt Level
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Join Date
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((attendee) => (
                  <tr
                    key={attendee.id}
                    className="border-b dark:border-muted last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {attendee.initials}
                        </div>
                        <div>
                          <div className="font-medium">{attendee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {attendee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          attendee.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                            : attendee.status === "Inactive"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400"
                            : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400"
                        }`}
                      >
                        {attendee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{attendee.beltLevel}</td>
                    <td className="px-6 py-4 text-sm">{attendee.joinDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSendEmail(attendee.email)}
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSendText(attendee.id)}
                          title="Send Text"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/attendees/${attendee.id}`}>
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSendEmail(attendee.email)}
                          >
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSendText(attendee.id)}
                          >
                            Send Text
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleBlacklist(attendee.id)}
                            className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Add to Blacklist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t dark:border-muted">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>Showing 5 of 25 attendees</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
