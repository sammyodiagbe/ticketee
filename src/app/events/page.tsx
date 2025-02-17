import Link from "next/link";
import { getEvents } from "@/lib/events";

export default async function EventsPage() {
  const currentMonth = "March 2024";
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Fetch real events from Supabase
  const events = await getEvents();

  return (
    <>
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <nav className="flex items-center text-muted-foreground text-sm">
              <Link href="/events" className="hover:text-foreground">
                Events
              </Link>
            </nav>
          </div>

          <div className="bg-card text-card-foreground shadow rounded-lg border">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Events Calendar</h2>
                <Link
                  href="/events/create"
                  className="text-sm text-primary hover:text-primary/90 font-medium"
                >
                  Create Event
                </Link>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <button className="p-2 hover:bg-accent rounded-full">
                    <svg
                      className="h-5 w-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <h3 className="mx-4 text-lg font-medium">{currentMonth}</h3>
                  <button className="p-2 hover:bg-accent rounded-full">
                    <svg
                      className="h-5 w-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-2 text-sm font-medium border rounded-md hover:bg-accent">
                    Today
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                {/* Calendar header */}
                {days.map((day) => (
                  <div key={day} className="bg-muted/50 py-2 text-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      {day}
                    </span>
                  </div>
                ))}

                {/* Calendar grid */}
                {Array.from({ length: 35 }).map((_, index) => {
                  const dayEvents = events.filter((event) => {
                    const eventDate = new Date(event.start_date);
                    return (
                      eventDate.getDate() === index + 1 &&
                      eventDate.getMonth() === 2
                    ); // March is 2 (0-based)
                  });

                  return (
                    <div
                      key={index}
                      className="bg-card min-h-[120px] p-2 relative"
                    >
                      <span className="text-sm text-muted-foreground">
                        {index + 1}
                      </span>
                      {/* Event indicators */}
                      <div className="mt-1 space-y-1">
                        {dayEvents.map((event) => (
                          <Link
                            key={event.id}
                            href={`/events/${event.id}`}
                            className="block bg-primary/10 text-primary text-xs rounded p-1 hover:bg-primary/20 transition-colors"
                          >
                            {event.title}
                            <div className="text-muted-foreground">
                              {new Date(event.start_date).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
