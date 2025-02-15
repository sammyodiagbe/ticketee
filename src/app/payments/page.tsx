import Sidebar from "@/components/Sidebar";

export default function PaymentsPage() {
  return (
    <>
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold">Payments</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Track and manage payments and transactions
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              Record Payment
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[
              {
                title: "Total Revenue",
                value: "$12,345",
                change: "+12.3%",
                changeType: "positive",
              },
              {
                title: "Pending Payments",
                value: "$2,345",
                change: "5 pending",
                changeType: "neutral",
              },
              {
                title: "Overdue Payments",
                value: "$567",
                change: "2 overdue",
                changeType: "negative",
              },
              {
                title: "Active Subscriptions",
                value: "234",
                change: "+6 this month",
                changeType: "positive",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-card text-card-foreground p-6 rounded-lg border"
              >
                <h3 className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </h3>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold">{card.value}</p>
                  <p
                    className={`ml-2 text-sm ${
                      card.changeType === "positive"
                        ? "text-green-600 dark:text-green-400"
                        : card.changeType === "negative"
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {card.change}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Transactions */}
          <div className="bg-card text-card-foreground overflow-hidden shadow rounded-lg border">
            <div className="p-6">
              <h3 className="text-lg font-medium">Recent Transactions</h3>
              <div className="mt-6 divide-y divide-border">
                {[1, 2, 3, 4].map((transaction) => (
                  <div key={transaction} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold">JD</span>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium">John Doe</h4>
                          <p className="text-sm text-muted-foreground">
                            Premium Membership - Monthly
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">$99.00</span>
                        <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">
                          Paid
                        </span>
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
