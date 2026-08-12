export function getActivityGridRowCount(
  viewport: "desktop" | "mobile" | "tablet",
  itemCount: number,
  columns: number
) {
  if (viewport === "desktop") {
    return 2;
  }

  return Math.ceil(itemCount / columns);
}
