import path from "path";
import { promises as fs } from "fs";
import Papa from "papaparse";
import type { FriendlinessMatrix } from "./types";

// Constants
const CSV_FILE_PATH = "src/lib/data/friendliness.csv";
const ROW_IDENTIFIER = "x";
const EMPTY_VALUES = ["-", ""];

/**
 * Loads the friendliness matrix from CSV file
 * @returns Promise resolving to a matrix of prefecture friendliness scores
 * @throws {Error} When file cannot be read or parsed
 */
export async function loadFriendlinessMatrix(): Promise<FriendlinessMatrix> {
  try {
    const filePath = path.join(process.cwd(), CSV_FILE_PATH);
    const fileContent = await readCSVFile(filePath);
    const rows = parseCSVContent(fileContent);
    return buildFriendlinessMatrix(rows);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load friendliness matrix: ${message}`);
  }
}

/**
 * Reads CSV file content
 */
async function readCSVFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, "utf8");
}

/**
 * Parses CSV content into structured data
 */
function parseCSVContent(content: string): Record<string, string>[] {
  const parsed = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
  });

  if (!parsed.data.length) {
    throw new Error("CSV is empty or invalid");
  }

  return parsed.data;
}

/**
 * Builds the friendliness matrix from parsed CSV rows
 */
function buildFriendlinessMatrix(rows: Record<string, string>[]): FriendlinessMatrix {
  // Filter out empty or whitespace-only column headers, which may appear if the CSV has extra columns with no prefecture name.
  const prefectures = Object.keys(rows[0]).filter(
    (key) => key !== ROW_IDENTIFIER && key.trim() !== ""
  );
  const matrix: FriendlinessMatrix = {};

  for (const [index, row] of rows.entries()) {
    validateRow(row, index);
    const from = row[ROW_IDENTIFIER];
    matrix[from] = {};

    for (const to of prefectures) {
      const value = parseValue(row[to]);
      if (value !== undefined) {
        matrix[from][to] = value;
      }
    }
  }
  console.log("Parsed Friendliness Matrix:", matrix);

  return matrix;
}

/**
 * Validates a CSV row has required fields
 */
function validateRow(row: Record<string, string>, rowIndex: number): void {
  if (!row[ROW_IDENTIFIER]) {
    throw new Error(`Missing row identifier at row ${rowIndex}`);
  }
}

/**
 * Parses a string value to number, handling empty values
 */
function parseValue(value: string): number | undefined {
  if (EMPTY_VALUES.includes(value)) {
    return undefined;
  }

  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Invalid number: ${value}`);
  }

  return num;
}
