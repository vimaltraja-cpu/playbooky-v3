import type { CsvRow } from "@/lib/data/csv";

export type Activity = CsvRow & {
  "Activity Name": string;
};

export const activityLibrarySource = "data/canonical/activity-library.csv";

export function createActivitySlug(activityName: string) {
  return activityName
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function selectRepresentativeActivity(activities: Activity[]) {
  return (
    activities.find(
      (activity) =>
        activity["Activity Name"] &&
        activity["Purpose"] &&
        activity["Duration"] &&
        activity["Stage"]
    ) ?? activities[0]
  );
}
