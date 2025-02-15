import Sidebar from "@/components/Sidebar";

export default function DocumentsPage() {
  return (
    <>
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold">Documents</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage forms, waivers, and other important documents
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              Upload Document
            </button>
          </div>

          {/* Documents List */}
          <div className="bg-card text-card-foreground overflow-hidden shadow rounded-lg border">
            <div className="p-6">
              <div className="divide-y divide-border">
                {[1, 2, 3, 4].map((doc) => (
                  <div key={doc} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <svg
                            className="h-5 w-5 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">
                            Liability Waiver.pdf
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Updated 2 days ago • 245 KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button className="text-sm font-medium text-primary hover:text-primary/90">
                          Download
                        </button>
                        <button className="text-sm font-medium text-primary hover:text-primary/90">
                          Share
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
