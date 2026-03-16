#!/usr/bin/env node

/**
 * extract-tables.mjs - Extract tables from PDF pages using positional text analysis.
 */

import fs from "node:fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const HELP = `Usage: node scripts/extract-tables.mjs <pdf-path> --page <N> [options]

Extract tabular data from PDF pages by analyzing text positions.

Options:
  --page N          Single page to extract from
  --pages RANGE     Page range (e.g., "5-10", "1,3,5")
  --format FORMAT   Output format: markdown (default), csv, json
  --output FILE     Write output to FILE instead of stdout
  --help, -h        Show this help message

  Either --page or --pages is required.

Detection algorithm:
  1. Clusters text items into rows by Y-coordinate
  2. Identifies column boundaries by consistent X-positions
  3. Detects table regions where rows share column structure

Examples:
  node scripts/extract-tables.mjs doc.pdf --page 20
  node scripts/extract-tables.mjs doc.pdf --pages 20-25 --format csv
  node scripts/extract-tables.mjs doc.pdf --page 20 --format json --output tables.json

Exit codes:
  0  Success
  1  Invalid arguments
  2  File not found or read error`;

const args = process.argv.slice(2);
const pdfPath = args.find((a) => !a.startsWith("-") && !args[args.indexOf(a) - 1]?.startsWith("--"));

if (args.includes("--help") || args.includes("-h")) {
  console.log(HELP);
  process.exit(0);
}

if (!pdfPath) {
  console.error("Error: PDF path is required.\n");
  console.error(HELP);
  process.exit(1);
}

if (!fs.existsSync(pdfPath)) {
  console.error(`Error: File not found: ${pdfPath}`);
  process.exit(2);
}

function getArg(name) {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

function parsePageRanges(rangeStr, maxPage) {
  const pages = new Set();
  for (const part of rangeStr.split(",")) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [s, e] = trimmed.split("-").map(Number);
      for (let i = Math.max(1, s); i <= Math.min(e, maxPage); i++) pages.add(i);
    } else {
      const n = parseInt(trimmed, 10);
      if (n >= 1 && n <= maxPage) pages.add(n);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

const format = getArg("--format") || "markdown";
const outputPath = getArg("--output");

if (!["markdown", "csv", "json"].includes(format)) {
  console.error(`Error: --format must be one of: markdown, csv, json. Received: "${format}"`);
  process.exit(1);
}

function clusterValues(values, tolerance) {
  if (values.length === 0) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const clusters = [[sorted[0]]];
  for (let i = 1; i < sorted.length; i++) {
    const lastCluster = clusters[clusters.length - 1];
    if (sorted[i] - lastCluster[lastCluster.length - 1] <= tolerance) {
      lastCluster.push(sorted[i]);
    } else {
      clusters.push([sorted[i]]);
    }
  }
  return clusters.map((c) => ({
    center: c.reduce((a, b) => a + b, 0) / c.length,
    count: c.length,
  }));
}

async function getTextItems(page) {
  const textContent = await page.getTextContent();
  return textContent.items
    .filter((item) => item.str !== undefined && item.str.trim() !== "")
    .map((item) => ({
      text: item.str.trim(),
      x: Math.round(item.transform[4] * 100) / 100,
      y: Math.round(item.transform[5] * 100) / 100,
      width: item.width,
      height: Math.abs(item.transform[3]) || Math.abs(item.transform[0]),
      fontName: item.fontName,
    }));
}

function detectTables(items) {
  if (items.length === 0) return [];

  const Y_TOLERANCE = 3;
  const yClusters = clusterValues(items.map((i) => i.y), Y_TOLERANCE);

  const rows = yClusters.map((yc) => ({
    y: yc.center,
    items: items.filter((i) => Math.abs(i.y - yc.center) <= Y_TOLERANCE + 1),
  }));
  rows.sort((a, b) => b.y - a.y);
  for (const row of rows) row.items.sort((a, b) => a.x - b.x);

  const allXPositions = items.map((i) => i.x);
  const X_TOLERANCE = 8;
  const xClusters = clusterValues(allXPositions, X_TOLERANCE);
  const significantColumns = xClusters.filter(
    (xc) => xc.count >= Math.min(3, rows.length * 0.3)
  );

  if (significantColumns.length < 2) return [];

  const tables = [];
  let currentTable = null;

  for (const row of rows) {
    let alignedCount = 0;
    for (const item of row.items) {
      if (significantColumns.some((col) => Math.abs(item.x - col.center) <= X_TOLERANCE + 2)) {
        alignedCount++;
      }
    }
    const isTableRow =
      row.items.length >= 2 && (row.items.length > 0 ? alignedCount / row.items.length : 0) >= 0.5;

    if (isTableRow) {
      if (!currentTable) currentTable = { rows: [], columns: significantColumns };
      currentTable.rows.push(row);
    } else {
      if (currentTable && currentTable.rows.length >= 2) tables.push(currentTable);
      currentTable = null;
    }
  }
  if (currentTable && currentTable.rows.length >= 2) tables.push(currentTable);

  return tables.map((table) => {
    const colPositions = table.columns.map((c) => c.center).sort((a, b) => a - b);
    const grid = table.rows.map((row) => {
      const cells = new Array(colPositions.length).fill("");
      for (const item of row.items) {
        let bestCol = 0, bestDist = Infinity;
        for (let c = 0; c < colPositions.length; c++) {
          const dist = Math.abs(item.x - colPositions[c]);
          if (dist < bestDist) { bestDist = dist; bestCol = c; }
        }
        cells[bestCol] = cells[bestCol] ? cells[bestCol] + " " + item.text : item.text;
      }
      return cells;
    });

    const nonEmptyCols = [];
    for (let c = 0; c < colPositions.length; c++) {
      if (grid.some((row) => row[c]?.trim())) nonEmptyCols.push(c);
    }
    return grid.map((row) => nonEmptyCols.map((c) => row[c]));
  });
}

function formatMarkdown(tables, pageNum) {
  let out = "";
  for (let t = 0; t < tables.length; t++) {
    const table = tables[t];
    if (table.length === 0) continue;
    out += `\n### Table ${t + 1} (Page ${pageNum})\n\n`;
    const numCols = Math.max(...table.map((r) => r.length));
    const widths = new Array(numCols).fill(3);
    for (const row of table)
      for (let c = 0; c < row.length; c++)
        widths[c] = Math.max(widths[c], (row[c] || "").length);
    out += "| " + table[0].map((cell, i) => (cell || "").padEnd(widths[i])).join(" | ") + " |\n";
    out += "| " + widths.map((w) => "-".repeat(w)).join(" | ") + " |\n";
    for (let r = 1; r < table.length; r++)
      out += "| " + table[r].map((cell, i) => (cell || "").padEnd(widths[i])).join(" | ") + " |\n";
  }
  return out;
}

function formatCSV(tables, pageNum) {
  let out = "";
  for (let t = 0; t < tables.length; t++) {
    const table = tables[t];
    if (table.length === 0) continue;
    out += `# Table ${t + 1} (Page ${pageNum})\n`;
    for (const row of table) {
      out += row.map((cell) => {
        const v = cell || "";
        return v.includes(",") || v.includes('"') || v.includes("\n")
          ? '"' + v.replace(/"/g, '""') + '"'
          : v;
      }).join(",") + "\n";
    }
    out += "\n";
  }
  return out;
}

async function main() {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;

  const singlePage = getArg("--page");
  const pageRange = getArg("--pages");
  let pageNumbers;

  if (singlePage) {
    pageNumbers = [parseInt(singlePage, 10)];
  } else if (pageRange) {
    pageNumbers = parsePageRanges(pageRange, doc.numPages);
  } else {
    console.error("Error: --page or --pages is required. Example: --page 5");
    process.exit(1);
  }

  console.error(`Extracting tables from ${pageNumbers.length} page(s)...`);

  const allTables = [];
  let resultText = "";

  for (const pageNum of pageNumbers) {
    const page = await doc.getPage(pageNum);
    const items = await getTextItems(page);
    const tables = detectTables(items);
    if (tables.length > 0) console.error(`  Page ${pageNum}: ${tables.length} table(s)`);

    if (format === "json") {
      for (let t = 0; t < tables.length; t++)
        allTables.push({ page: pageNum, tableIndex: t + 1, data: tables[t] });
    } else if (format === "csv") {
      resultText += formatCSV(tables, pageNum);
    } else {
      resultText += formatMarkdown(tables, pageNum);
    }
  }

  const finalOutput = format === "json" ? JSON.stringify(allTables, null, 2) : resultText;

  if (outputPath) {
    fs.writeFileSync(outputPath, finalOutput, "utf8");
    console.error(`Written to ${outputPath}`);
  } else {
    console.log(finalOutput);
  }

  await doc.destroy();
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(2);
});
