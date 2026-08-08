"use client";

import { useMemo, useState } from "react";

import type { CsvRow } from "@/lib/data/csv";

const searchableFields = [
  "Activity Name",
  "Purpose",
  "Best Used When",
  "Stage",
  "Duration",
  "Inputs Required",
  "Outputs Produced",
  "Layout Type",
  "Facilitator Notes",
  "Instructions",
  "Remote Friendly"
];

const filterFields = [
  "Stage",
  "Duration",
  "Layout Type",
  "Remote Friendly",
  "Inputs Required",
  "Outputs Produced"
];

function getActivityName(activity: CsvRow) {
  return activity["Activity Name"] || "Untitled activity";
}

function getMissingFields(activity: CsvRow, fields: string[]) {
  return fields.filter((field) => !activity[field]?.trim());
}

function getFilterOptions(activities: CsvRow[], field: string) {
  const values = new Set<string>();

  activities.forEach((activity) => {
    const rawValue = activity[field];

    if (!rawValue) {
      return;
    }

    rawValue
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .forEach((value) => values.add(value));
  });

  return Array.from(values).sort((first, second) =>
    first.localeCompare(second)
  );
}

function activityMatchesFilter(activityValue: string, selectedValue: string) {
  if (!selectedValue) {
    return true;
  }

  return activityValue
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .includes(selectedValue.toLowerCase());
}

function formatLongText(value: string) {
  return value.split(/\n{2,}/).filter(Boolean);
}

export function ActivityExplorer({
  activities,
  fields
}: {
  activities: CsvRow[];
  fields: string[];
}) {
  const [query, setQuery] = useState("");
  const [selectedActivityName, setSelectedActivityName] = useState(
    getActivityName(activities[0] ?? {})
  );
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filterOptions = useMemo(
    () =>
      Object.fromEntries(
        filterFields
          .filter((field) => fields.includes(field))
          .map((field) => [field, getFilterOptions(activities, field)])
      ),
    [activities, fields]
  );

  const filteredActivities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return activities.filter((activity) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        searchableFields.some((field) =>
          activity[field]?.toLowerCase().includes(normalizedQuery)
        );

      const matchesFilters = Object.entries(filters).every(
        ([field, selectedValue]) =>
          activityMatchesFilter(activity[field] ?? "", selectedValue)
      );

      return matchesQuery && matchesFilters;
    });
  }, [activities, filters, query]);

  const selectedActivity =
    activities.find(
      (activity) => getActivityName(activity) === selectedActivityName
    ) ??
    filteredActivities[0] ??
    activities[0];

  const blankFieldCount = activities.reduce(
    (total, activity) => total + getMissingFields(activity, fields).length,
    0
  );
  const selectedMissingFields = selectedActivity
    ? getMissingFields(selectedActivity, fields)
    : [];

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[22px] border border-[color:var(--line)] bg-white/55 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]">
            Total activities
          </p>
          <p className="mt-3 text-4xl font-semibold">{activities.length}</p>
        </div>
        <div className="rounded-[22px] border border-[color:var(--line)] bg-white/55 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]">
            Visible results
          </p>
          <p className="mt-3 text-4xl font-semibold">
            {filteredActivities.length}
          </p>
        </div>
        <div className="rounded-[22px] border border-[#E5D2B6] bg-[#FFF8EB] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7D5330]">
            Missing data warnings
          </p>
          <p className="mt-3 text-4xl font-semibold">{blankFieldCount}</p>
          <p className="mt-2 text-sm leading-6 text-[#6E6253]">
            Blank field instances across the canonical CSV.
          </p>
        </div>
      </section>

      <section className="rounded-[28px] border border-[color:var(--line)] bg-white/55 p-5 shadow-[0_18px_50px_rgba(36,31,24,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <label className="flex-1">
            <span className="text-sm font-semibold text-[#2C2924]">
              Search activities
            </span>
            <input
              className="mt-2 h-12 w-full rounded-2xl border border-[#E4D8C8] bg-[#FFFCF7] px-4 text-sm outline-none transition focus:border-[#7D5330] focus:ring-4 focus:ring-[#D99C56]/18"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, purpose, notes, inputs, outputs..."
              type="search"
              value={query}
            />
          </label>
          <button
            className="h-12 rounded-full border border-[#D8C08A] bg-[#FCFBF9] px-5 text-sm font-semibold text-[#7D5330] transition hover:bg-white"
            onClick={() => {
              setQuery("");
              setFilters({});
            }}
            type="button"
          >
            Clear filters
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(filterOptions).map(([field, options]) => (
            <label key={field}>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                {field}
              </span>
              <select
                className="mt-2 h-11 w-full rounded-2xl border border-[#E4D8C8] bg-[#FFFCF7] px-3 text-sm outline-none transition focus:border-[#7D5330] focus:ring-4 focus:ring-[#D99C56]/18"
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    [field]: event.target.value
                  }))
                }
                value={filters[field] ?? ""}
              >
                <option value="">All</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div>
          {filteredActivities.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#D8C08A] bg-[#FFF8EB] p-8 text-center">
              <h3 className="text-xl font-semibold">No activities found</h3>
              <p className="mt-3 text-sm leading-6 text-[#6E6253]">
                Try a different search term or clear the active filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredActivities.map((activity) => {
                const activityName = getActivityName(activity);
                const isSelected =
                  getActivityName(selectedActivity ?? {}) === activityName;
                const missingFields = getMissingFields(activity, fields);

                return (
                  <button
                    aria-pressed={isSelected}
                    className={[
                      "rounded-[24px] border p-5 text-left transition hover:-translate-y-0.5 hover:bg-[#FFFCF7] hover:shadow-[0_18px_44px_rgba(36,31,24,0.08)] motion-reduce:hover:translate-y-0",
                      isSelected
                        ? "border-[#D8C08A] bg-[#FFFCF7] shadow-[inset_3px_0_0_#7D5330]"
                        : "border-[color:var(--line)] bg-white/55"
                    ].join(" ")}
                    key={activityName}
                    onClick={() => setSelectedActivityName(activityName)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-[#171614]">
                        {activityName}
                      </h3>
                      {missingFields.length > 0 ? (
                        <span className="rounded-full bg-[#FFF2D8] px-2.5 py-1 text-xs font-semibold text-[#7D5330]">
                          {missingFields.length} blank
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[color:var(--muted)]">
                      {activity["Purpose"] || "No purpose provided."}
                    </p>
                    <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                      {[
                        ["Stage", activity["Stage"]],
                        ["Duration", activity["Duration"]],
                        ["Layout", activity["Layout Type"]],
                        ["Remote", activity["Remote Friendly"]]
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--gold)]">
                            {label}
                          </dt>
                          <dd className="mt-1 text-[#2C2924]">
                            {value || "Missing"}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-[28px] border border-[color:var(--line)] bg-[#FFFCF7]/88 p-5 shadow-[0_22px_60px_rgba(36,31,24,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]">
                  Inspector
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  {selectedActivity
                    ? getActivityName(selectedActivity)
                    : "No activity selected"}
                </h3>
              </div>
              {selectedMissingFields.length > 0 ? (
                <span className="rounded-full bg-[#FFF2D8] px-3 py-1 text-xs font-semibold text-[#7D5330]">
                  {selectedMissingFields.length} blank
                </span>
              ) : null}
            </div>

            {selectedMissingFields.length > 0 ? (
              <div className="mt-5 rounded-2xl border border-[#E5D2B6] bg-[#FFF8EB] p-4">
                <p className="text-sm font-semibold text-[#7D5330]">
                  Missing fields
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6E6253]">
                  {selectedMissingFields.join(", ")}
                </p>
              </div>
            ) : null}

            <dl className="mt-5 space-y-4">
              {selectedActivity
                ? fields.map((field) => {
                    const value = selectedActivity[field];
                    const paragraphs = formatLongText(value);

                    return (
                      <div
                        className="rounded-2xl border border-[#E8DED0] bg-white/54 p-4"
                        key={field}
                      >
                        <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                          {field}
                        </dt>
                        <dd className="mt-2 text-sm leading-6 text-[#2C2924]">
                          {value ? (
                            paragraphs.length > 1 ? (
                              <div className="space-y-3">
                                {paragraphs.map((paragraph) => (
                                  <p key={paragraph}>{paragraph}</p>
                                ))}
                              </div>
                            ) : (
                              value
                            )
                          ) : (
                            <span className="font-medium text-[#9A5E34]">
                              Missing
                            </span>
                          )}
                        </dd>
                      </div>
                    );
                  })
                : null}
            </dl>
          </div>
        </aside>
      </section>
    </div>
  );
}
