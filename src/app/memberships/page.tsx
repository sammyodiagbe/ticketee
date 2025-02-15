import Sidebar from "@/components/Sidebar";

export default function MembershipsPage() {
  return (
    <>
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold">Memberships</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage membership plans and subscriptions
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              Create Plan
            </button>
          </div>

          {/* Membership Plans Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((plan) => (
              <div
                key={plan}
                className="bg-card text-card-foreground overflow-hidden shadow rounded-lg border"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">P</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Premium Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        Unlimited Access
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">$99/mo</div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Unlimited classes
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Private sessions
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 px-6 py-3 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    25 active members
                  </div>
                  <button className="text-sm font-medium text-primary hover:text-primary/90">
                    Edit plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
