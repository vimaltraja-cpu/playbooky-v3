export type CsvRow = Record<string, string>;

function parseCsvCells(input: string) {
  const rows: string[][] = [];
  let cell = "";
  let currentRow: string[] = [];
  let insideQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const nextCharacter = input[index + 1];

    if (character === '"' && insideQuotes && nextCharacter === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (character === "," && !insideQuotes) {
      currentRow.push(cell);
      cell = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !insideQuotes) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }

      currentRow.push(cell);
      rows.push(currentRow);
      currentRow = [];
      cell = "";
      continue;
    }

    cell += character;
  }

  if (cell.length > 0 || currentRow.length > 0) {
    currentRow.push(cell);
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((value) => value.trim().length > 0));
}

export function parseCsv(input: string): CsvRow[] {
  const normalizedInput = input.replace(/^\uFEFF/, "");
  const [headerRow, ...dataRows] = parseCsvCells(normalizedInput);

  if (!headerRow) {
    return [];
  }

  const headers = headerRow.map((header) => header.trim());

  return dataRows.map((row) =>
    Object.fromEntries(
      headers.map((header, index) => [header, row[index]?.trim() ?? ""])
    )
  );
}
