import Sidebar from "@/components/Sidebar";

export default function CommunicationPage() {
  return (
    <>
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold">Communication</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage announcements, messages, and notifications
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              New Message
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Announcements Section */}
            <div className="lg:col-span-2">
              <div className="bg-card text-card-foreground overflow-hidden shadow rounded-lg border">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">
                    Recent Announcements
                  </h3>
                  <div className="space-y-6">
                    {[1, 2, 3].map((announcement) => (
                      <div
                        key={announcement}
                        className="border-b border-border last:border-0 pb-6 last:pb-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">
                            Holiday Schedule Update
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            2 days ago
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Please note that the dojo will be closed during the
                          upcoming holidays. Regular classes will resume on
                          January 3rd.
                        </p>
                        <div className="flex items-center space-x-4">
                          <button className="text-sm font-medium text-primary hover:text-primary/90">
                            Edit
                          </button>
                          <button className="text-sm font-medium text-primary hover:text-primary/90">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-card text-card-foreground overflow-hidden shadow rounded-lg border">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-3 rounded-md hover:bg-accent">
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 text-primary mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                          />
                        </svg>
                        Send Announcement
                      </div>
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
                    <button className="w-full flex items-center justify-between p-3 rounded-md hover:bg-accent">
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 text-primary mr-3"
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
                        Schedule Message
                      </div>
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
                </div>
              </div>

              <div className="bg-card text-card-foreground overflow-hidden shadow rounded-lg border">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">
                    Message Templates
                  </h3>
                  <div className="space-y-4">
                    <div className="p-3 rounded-md border">
                      <h4 className="text-sm font-medium">
                        Class Cancellation
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Template for emergency class cancellations
                      </p>
                    </div>
                    <div className="p-3 rounded-md border">
                      <h4 className="text-sm font-medium">Welcome Message</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        New student welcome and onboarding
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
