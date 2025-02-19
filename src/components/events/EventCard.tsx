import { Event } from "@/types/events";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";

interface EventCardProps {
  event: Event;
  variant?: "default" | "compact";
}

export function EventCard({ event, variant = "default" }: EventCardProps) {
  const hasAvailableTickets = event.ticketTypes.some(
    (type) =>
      !type.quantity || (type.availableQuantity && type.availableQuantity > 0)
  );

  if (variant === "compact") {
    return (
      <Link
        href={`/events/${event.id}`}
        className="block bg-card hover:bg-accent/50 transition-colors p-4 rounded-lg border"
      >
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted">
            {event.coverImageUrl ? (
              <Image
                src={event.coverImageUrl}
                alt={event.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary/10">
                <CalendarIcon className="h-8 w-8 text-primary" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{event.title}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(event.startDate)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/events/${event.id}`}
      className="block bg-card hover:bg-accent/50 transition-colors rounded-lg border overflow-hidden group"
    >
      <div className="relative h-48 bg-muted">
        {event.coverImageUrl ? (
          <Image
            src={event.coverImageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-primary/10">
            <CalendarIcon className="h-12 w-12 text-primary" />
          </div>
        )}
        {!hasAvailableTickets && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <p className="text-lg font-medium text-muted-foreground">
              Sold Out
            </p>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium truncate group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        {event.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-3 border-t bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <TicketIcon className="h-4 w-4" />
            <span>
              From{" "}
              {event.ticketTypes
                .reduce(
                  (min, type) => (type.price < min ? type.price : min),
                  Infinity
                )
                .toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
            </span>
          </div>
          <span className="text-sm font-medium text-primary group-hover:text-primary/90">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
