import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function EventsPage() {
  const currentMonth = "March 2024";
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Dummy events data
  const events = [
    {
      id: 1,
      name: "Little Tigers Karate",
      time: "3:00 PM - 4:00 PM",
      type: "Weekly",
      members: "25 out of 30",
    },
  ];

  return (
    <>
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <nav className="flex items-center text-muted-foreground text-sm">
              <a href="/events" className="hover:text-foreground">
                Events
              </a>
              <span className="mx-2">/</span>
              <span>Little Tigers Karate</span>
            </nav>
          </div>

          <div className="bg-card text-card-foreground shadow rounded-lg border">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Little Tigers Karate</h2>
                <button className="text-sm text-primary hover:text-primary/90 font-medium">
                  Edit Master Event
                </button>
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
                {Array.from({ length: 35 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-card min-h-[120px] p-2 relative"
                  >
                    <span className="text-sm text-muted-foreground">
                      {index + 1}
                    </span>
                    {/* Event indicator */}
                    {index === 7 && (
                      <div className="mt-1">
                        <Link
                          href="/events/little-tigers"
                          className="block bg-primary/10 text-primary text-xs rounded p-1 hover:bg-primary/20 transition-colors"
                        >
                          Little Tigers Karate
                          <div className="text-muted-foreground">3:00 PM</div>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
