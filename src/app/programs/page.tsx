import Sidebar from "@/components/Sidebar";

export default function ProgramsPage() {
  return (
    <>
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold">Programs</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your martial arts programs and classes
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              Create Program
            </button>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((program) => (
              <div
                key={program}
                className="bg-card text-card-foreground overflow-hidden shadow rounded-lg border"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">KP</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Karate Program</h3>
                      <p className="text-sm text-muted-foreground">
                        Advanced Training
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      3 Classes per week
                    </div>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      45 active students
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm text-muted-foreground">
                      Belt levels: White to Black
                    </div>
                  </div>
                  <button className="text-sm font-medium text-primary hover:text-primary/90">
                    View details
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
