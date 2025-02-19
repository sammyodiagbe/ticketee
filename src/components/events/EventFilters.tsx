import type {
  EventFilters as EventFiltersType,
  EventSortOptions,
} from "@/types/events";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import { debounce } from "@/lib/utils";

interface EventFiltersProps {
  onFilterChange: (filters: EventFiltersType) => void;
  onSortChange: (sort: EventSortOptions) => void;
}

export function EventFilters({
  onFilterChange,
  onSortChange,
}: EventFiltersProps) {
  const [filters, setFilters] = useState<EventFiltersType>({});
  const [sort, setSort] = useState<EventSortOptions>({
    field: "startDate",
    direction: "asc",
  });

  // Debounce the search to avoid too many updates
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      const newFilters = { ...filters, searchQuery: query };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }, 300),
    [filters, onFilterChange]
  );

  const handleSortChange = (field: EventSortOptions["field"]) => {
    const newSort: EventSortOptions = {
      field,
      direction:
        sort.field === field && sort.direction === "asc" ? "desc" : "asc",
    };
    setSort(newSort);
    onSortChange(newSort);
  };

  const handleDateChange = (
    type: "startDate" | "endDate",
    value: string | undefined
  ) => {
    const date = value ? new Date(value) : undefined;
    const newFilters = { ...filters, [type]: date };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div>
          <span className="text-sm font-medium mr-2">Search</span>
          <div className="relative inline-block w-[300px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 h-10 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm font-medium mr-2">From</span>
            <input
              type="date"
              className="h-10 px-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => handleDateChange("startDate", e.target.value)}
            />
          </div>
          <div>
            <span className="text-sm font-medium mr-2">To</span>
            <input
              type="date"
              className="h-10 px-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => handleDateChange("endDate", e.target.value)}
            />
          </div>
        </div>

        {/* Sort Buttons */}
        <div>
          <span className="text-sm font-medium mr-2">Filter by</span>
          <div className="inline-flex gap-2">
            {(["startDate", "title", "price"] as const).map((field) => (
              <button
                key={field}
                onClick={() => handleSortChange(field)}
                className={`h-10 px-4 text-sm rounded-lg border transition-colors ${
                  sort.field === field
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-accent"
                }`}
              >
                {field === "startDate"
                  ? "Date"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
                {sort.field === field && (
                  <span className="ml-1">
                    {sort.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Available tickets checkbox */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            checked={filters.hasAvailableTickets}
            onChange={(e) => {
              const newFilters = {
                ...filters,
                hasAvailableTickets: e.target.checked,
              };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
          />
          <span className="text-sm">Available tickets only</span>
        </label>
      </div>
    </div>
  );
}
