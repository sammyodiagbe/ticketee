"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  TicketIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function EventDetailsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-3 mb-6">
            <Link
              href="/events"
              className="text-muted-foreground hover:text-foreground flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </nav>

          {/* Event Header */}
          <div className="bg-card border rounded-lg p-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold mb-2">
                  Little Tigers Karate Class
                </h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Mon, Thu 3:00 PM - 4:00 PM
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    Main Dojo
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    25 of 30 members
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 text-sm border rounded-md hover:bg-accent">
                  Edit Event
                </button>
                <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  Register Student
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b mb-8">
            <nav className="-mb-px flex space-x-8">
              {["overview", "attendees", "schedule", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                    ${
                      activeTab === tab
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="col-span-2 space-y-8">
                {/* Description */}
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-lg font-medium mb-4">About this Event</h2>
                  <p className="text-muted-foreground">
                    Our Little Tigers program is designed for children aged 5-7,
                    focusing on basic martial arts techniques, discipline, and
                    fun! Each class includes warm-up exercises, basic
                    techniques, and games that develop coordination and
                    confidence.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        What to Bring
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Comfortable workout clothes</li>
                        <li>• Water bottle</li>
                        <li>• Martial arts uniform (if you have one)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Prerequisites
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• No prior experience needed</li>
                        <li>• Age 5-7 years</li>
                        <li>• Signed waiver form</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-lg font-medium mb-4">
                    Upcoming Sessions
                  </h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((session) => (
                      <div
                        key={session}
                        className="flex items-center justify-between p-4 border rounded-md"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <CalendarIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">
                              Monday Session
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              March 18, 2024 • 3:00 PM - 4:00 PM
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                              23
                            </span>
                            /30 spots filled
                          </div>
                          <button className="px-3 py-1 text-sm border rounded-md hover:bg-accent">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-sm font-medium mb-4">
                    Quick Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-sm text-muted-foreground">
                          60 minutes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <TicketIcon className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <p className="text-sm font-medium">Pricing</p>
                        <p className="text-sm text-muted-foreground">
                          $50/month
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <UsersIcon className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <p className="text-sm font-medium">Class Size</p>
                        <p className="text-sm text-muted-foreground">
                          30 students max
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructor */}
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-sm font-medium mb-4">Instructor</h2>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">JS</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">John Smith</p>
                      <p className="text-sm text-muted-foreground">
                        Head Instructor
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendees" && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search attendees..."
                      className="w-64 rounded-md border bg-background px-3 py-2 pl-10 text-sm"
                    />
                    <svg
                      className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <select className="rounded-md border bg-background px-3 py-2 text-sm">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <button className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                  Add Attendee
                </button>
              </div>

              {/* Attendees List */}
              <div className="bg-card border rounded-lg">
                <div className="p-4 border-b">
                  <div className="grid grid-cols-6 text-sm font-medium text-muted-foreground">
                    <div className="col-span-2">Name</div>
                    <div>Status</div>
                    <div>Belt Level</div>
                    <div>Join Date</div>
                    <div></div>
                  </div>
                </div>
                <div className="divide-y">
                  {[1, 2, 3, 4, 5].map((attendee) => (
                    <div key={attendee} className="p-4">
                      <div className="grid grid-cols-6 items-center">
                        <div className="col-span-2 flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-sm font-medium">
                              JD
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-xs text-muted-foreground">
                              john@example.com
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">
                            Active
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Yellow Belt
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Jan 15, 2024
                        </div>
                        <div className="flex justify-end">
                          <button className="text-sm font-medium text-primary hover:text-primary/90">
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing 5 of 25 attendees
                    </p>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50">
                        Previous
                      </button>
                      <button className="p-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="space-y-6">
              {/* Schedule Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <select className="rounded-md border bg-background px-3 py-2 text-sm">
                    <option>All Sessions</option>
                    <option>Upcoming</option>
                    <option>Past</option>
                    <option>Cancelled</option>
                  </select>
                  <div className="relative">
                    <input
                      type="date"
                      className="rounded-md border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <button className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                  Add Session
                </button>
              </div>

              {/* Schedule Calendar */}
              <div className="bg-card border rounded-lg">
                <div className="p-6">
                  <div className="grid grid-cols-7 gap-px">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-muted-foreground p-2"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-px mt-2">
                    {Array.from({ length: 35 }).map((_, index) => (
                      <div
                        key={index}
                        className="aspect-square p-2 border rounded-md hover:bg-accent/50 cursor-pointer"
                      >
                        <span className="text-sm text-muted-foreground">
                          {index + 1}
                        </span>
                        {index === 7 && (
                          <div className="mt-1 p-1 text-xs bg-primary/10 text-primary rounded">
                            3:00 PM
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upcoming Sessions */}
              <div className="bg-card border rounded-lg">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-medium">Upcoming Sessions</h3>
                </div>
                <div className="divide-y">
                  {[1, 2, 3].map((session) => (
                    <div key={session} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <CalendarIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">
                              Monday Session
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              March 18, 2024 • 3:00 PM - 4:00 PM
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-muted-foreground">
                            23/30 spots
                          </span>
                          <button className="text-sm font-medium text-primary hover:text-primary/90">
                            Edit
                          </button>
                          <button className="text-sm font-medium text-destructive hover:text-destructive/90">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Event Settings */}
              <div className="bg-card border rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-6">Event Settings</h3>

                  <div className="space-y-6">
                    {/* Basic Settings */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Basic Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Event Name
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-md border bg-background px-3 py-2"
                            defaultValue="Little Tigers Karate Class"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-md border bg-background px-3 py-2"
                            defaultValue="Main Dojo"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Capacity Settings */}
                    <div className="space-y-4 pt-6 border-t">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Capacity & Schedule
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Maximum Capacity
                          </label>
                          <input
                            type="number"
                            className="w-full rounded-md border bg-background px-3 py-2"
                            defaultValue="30"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Session Duration (minutes)
                          </label>
                          <input
                            type="number"
                            className="w-full rounded-md border bg-background px-3 py-2"
                            defaultValue="60"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="space-y-4 pt-6 border-t">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Notifications
                      </h4>
                      <div className="space-y-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-primary text-primary"
                            defaultChecked
                          />
                          <span className="text-sm">
                            Send reminder emails before sessions
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-primary text-primary"
                            defaultChecked
                          />
                          <span className="text-sm">
                            Notify when capacity is reached
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-primary text-primary"
                            defaultChecked
                          />
                          <span className="text-sm">Allow waitlist</span>
                        </label>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="space-y-4 pt-6 border-t">
                      <h4 className="text-sm font-medium text-destructive">
                        Danger Zone
                      </h4>
                      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-destructive mb-2">
                          Delete Event
                        </h5>
                        <p className="text-sm text-muted-foreground mb-4">
                          Once you delete an event, there is no going back.
                          Please be certain.
                        </p>
                        <button className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive rounded-md hover:bg-destructive/90">
                          Delete Event
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
