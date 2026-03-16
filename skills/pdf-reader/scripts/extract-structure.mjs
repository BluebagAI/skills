#!/usr/bin/env node

/**
 * extract-structure.mjs - Extract raw text with positional data from a PDF page.
 */

import fs from "node:fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const HELP = `Usage: node scripts/extract-structure.mjs <pdf-path> --page <N> [options]

Extract every text item with exact coordinates, font info, and dimensions.
Use for advanced layout analysis when other scripts don't capture a complex
table or diagram correctly.

Options:
  --page N        Page number to extract (required)
  --output FILE   Write JSON to FILE instead of stdout
  --help, -h      Show this help message

Output (JSON):
  { page, totalPages, viewport: {width, height}, itemCount,
    items: [{ text, x, y, scaleX, scaleY, width, height, fontName, hasEOL }] }

Examples:
  node scripts/extract-structure.mjs doc.pdf --page 20
  node scripts/extract-structure.mjs doc.pdf --page 20 --output structure.json

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

const pageArg = getArg("--page");
const outputPath = getArg("--output");

if (!pageArg) {
  console.error("Error: --page is required. Example: --page 20");
  process.exit(1);
}

const pageNum = parseInt(pageArg, 10);

async function main() {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;

  if (pageNum < 1 || pageNum > doc.numPages) {
    console.error(`Error: Page ${pageNum} out of range. Document has ${doc.numPages} pages (1-${doc.numPages}).`);
    process.exit(1);
  }

  const page = await doc.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1.0 });
  const textContent = await page.getTextContent();

  const items = textContent.items
    .filter((item) => item.str !== undefined)
    .map((item) => ({
      text: item.str,
      x: Math.round(item.transform[4] * 100) / 100,
      y: Math.round(item.transform[5] * 100) / 100,
      scaleX: Math.round(item.transform[0] * 100) / 100,
      scaleY: Math.round(item.transform[3] * 100) / 100,
      width: Math.round((item.width || 0) * 100) / 100,
      height: Math.round((Math.abs(item.transform[3]) || Math.abs(item.transform[0]) || 0) * 100) / 100,
      fontName: item.fontName,
      hasEOL: item.hasEOL || false,
    }));

  const result = {
    page: pageNum,
    totalPages: doc.numPages,
    viewport: {
      width: Math.round(viewport.width * 100) / 100,
      height: Math.round(viewport.height * 100) / 100,
    },
    itemCount: items.length,
    items,
  };

  const json = JSON.stringify(result, null, 2);
  if (outputPath) {
    fs.writeFileSync(outputPath, json, "utf8");
    console.error(`Written to ${outputPath}`);
  } else {
    console.log(json);
  }

  await doc.destroy();
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(2);
});
