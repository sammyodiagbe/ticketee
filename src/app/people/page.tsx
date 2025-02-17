import Sidebar from "@/components/Sidebar";

export default function PeoplePage() {
  return (
    <>
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold">People</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage students, instructors, and staff
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              Add Person
            </button>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select className="rounded-md border bg-card px-3 py-2 text-sm">
                <option>All Roles</option>
                <option>Students</option>
                <option>Instructors</option>
                <option>Staff</option>
              </select>
              <select className="rounded-md border bg-card px-3 py-2 text-sm">
                <option>All Programs</option>
                <option>Karate</option>
                <option>Judo</option>
                <option>Taekwondo</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search people..."
                className="rounded-md border bg-card px-3 py-2 pl-10 text-sm w-64"
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
          </div>

          {/* People List */}
          <div className="bg-card text-card-foreground overflow-hidden shadow rounded-lg border">
            <div className="p-6">
              <div className="divide-y divide-border">
                {[1, 2, 3, 4, 5].map((person) => (
                  <div key={person} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold">JD</span>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium">John Doe</h4>
                          <p className="text-sm text-muted-foreground">
                            Student • Karate Program
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          Active
                        </span>
                        <button className="text-sm font-medium text-primary hover:text-primary/90">
                          View Profile
                        </button>
                      </div>
                    </div>
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
