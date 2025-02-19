"use client";

import { EventCard } from "@/components/events/EventCard";
import { EventFilters } from "@/components/events/EventFilters";
import type {
  Event,
  EventFilters as EventFiltersType,
  EventSortOptions,
} from "@/types/events";
import Link from "next/link";
import { useState } from "react";

// This would normally come from an API
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Summer Music Festival",
    description: "A day of live music and entertainment",
    location: "Central Park",
    startDate: new Date("2024-07-15T14:00:00"),
    endDate: new Date("2024-07-15T23:00:00"),
    mediaUrls: [],
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ticketTypes: [
      {
        id: "1",
        name: "General Admission",
        price: 50,
        quantity: 1000,
        availableQuantity: 750,
      },
      {
        id: "2",
        name: "VIP",
        price: 150,
        quantity: 100,
        availableQuantity: 25,
      },
    ],
  },
  // Add more mock events as needed
];

export default function EventsPage() {
  const [events] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);

  const handleFilterChange = (filters: EventFiltersType) => {
    let filtered = [...events];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query)
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (event) => new Date(event.startDate) >= filters.startDate!
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (event) => new Date(event.startDate) <= filters.endDate!
      );
    }

    if (filters.hasAvailableTickets) {
      filtered = filtered.filter((event) =>
        event.ticketTypes.some(
          (type) =>
            !type.quantity ||
            (type.availableQuantity && type.availableQuantity > 0)
        )
      );
    }

    setFilteredEvents(filtered);
  };

  const handleSortChange = (sort: EventSortOptions) => {
    const sorted = [...filteredEvents].sort((a, b) => {
      if (sort.field === "startDate") {
        return sort.direction === "asc"
          ? a.startDate.getTime() - b.startDate.getTime()
          : b.startDate.getTime() - a.startDate.getTime();
      }

      if (sort.field === "title") {
        return sort.direction === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }

      if (sort.field === "price") {
        const aPrice = Math.min(...a.ticketTypes.map((type) => type.price));
        const bPrice = Math.min(...b.ticketTypes.map((type) => type.price));
        return sort.direction === "asc" ? aPrice - bPrice : bPrice - aPrice;
      }

      return 0;
    });

    setFilteredEvents(sorted);
  };

  return (
    <main className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Events</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse and book upcoming events
            </p>
          </div>
          <Link
            href="/events/create"
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create Event
          </Link>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <EventFilters
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-muted-foreground mb-1">
              No events found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or create a new event
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
