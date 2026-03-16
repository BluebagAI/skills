#!/usr/bin/env node

/**
 * search-text.mjs - Full-text search across all pages of a PDF.
 */

import fs from "node:fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const HELP = `Usage: node scripts/search-text.mjs <pdf-path> --query <term> [options]

Search for text across all pages of a PDF. Returns matches with page numbers
and surrounding context.

Options:
  --query TEXT        Search term (required)
  --case-sensitive    Match case exactly (default: case-insensitive)
  --max-results N     Maximum matches to return (default: 50)
  --offset N          Skip first N matches (for pagination, default: 0)
  --context N         Characters of context around each match (default: 150)
  --help, -h          Show this help message

Output (JSON to stdout):
  Array of { page, matchIndex, context, matchText }

Examples:
  node scripts/search-text.mjs doc.pdf --query "risk management"
  node scripts/search-text.mjs doc.pdf --query "Table" --max-results 10
  node scripts/search-text.mjs doc.pdf --query "Table" --max-results 10 --offset 10
  node scripts/search-text.mjs doc.pdf --query "NASA" --case-sensitive

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

function getArg(name, defaultValue) {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultValue;
}

const query = getArg("--query", null);

if (!pdfPath) {
  console.error("Error: PDF path is required.\n");
  console.error(HELP);
  process.exit(1);
}

if (!query) {
  console.error('Error: --query is required. Example: --query "search term"');
  process.exit(1);
}

if (!fs.existsSync(pdfPath)) {
  console.error(`Error: File not found: ${pdfPath}`);
  process.exit(2);
}

const caseSensitive = args.includes("--case-sensitive");
const maxResults = parseInt(getArg("--max-results", "50"), 10);
const offset = parseInt(getArg("--offset", "0"), 10);
const contextChars = parseInt(getArg("--context", "150"), 10);

async function getPageText(page) {
  const textContent = await page.getTextContent();
  const items = textContent.items.filter((item) => item.str !== undefined);
  let text = "";
  let lastY = null;
  const Y_TOLERANCE = 2;
  for (const item of items) {
    if (lastY !== null && Math.abs(item.transform[5] - lastY) > Y_TOLERANCE) {
      text += "\n";
    } else if (text.length > 0 && !text.endsWith(" ") && !text.endsWith("\n")) {
      text += " ";
    }
    text += item.str;
    lastY = item.transform[5];
  }
  return text;
}

async function main() {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;

  console.error(
    `Searching ${doc.numPages} pages for "${query}"${caseSensitive ? " (case-sensitive)" : ""}...`
  );

  const searchTerm = caseSensitive ? query : query.toLowerCase();
  const results = [];
  let skipped = 0;

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    if (results.length >= maxResults) break;

    const page = await doc.getPage(pageNum);
    const text = await getPageText(page);
    const searchText = caseSensitive ? text : text.toLowerCase();

    let startIdx = 0;
    while (startIdx < searchText.length) {
      const matchIdx = searchText.indexOf(searchTerm, startIdx);
      if (matchIdx === -1) break;

      if (skipped < offset) {
        skipped++;
        startIdx = matchIdx + query.length;
        continue;
      }

      if (results.length >= maxResults) break;

      const contextStart = Math.max(0, matchIdx - contextChars);
      const contextEnd = Math.min(text.length, matchIdx + query.length + contextChars);
      const context = text.slice(contextStart, contextEnd);

      results.push({
        page: pageNum,
        matchIndex: matchIdx,
        context:
          (contextStart > 0 ? "..." : "") +
          context +
          (contextEnd < text.length ? "..." : ""),
        matchText: text.slice(matchIdx, matchIdx + query.length),
      });

      startIdx = matchIdx + query.length;
    }
  }

  console.error(`Found ${results.length} match(es)${offset > 0 ? ` (skipped ${skipped})` : ""}.`);
  console.log(JSON.stringify(results, null, 2));
  await doc.destroy();
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(2);
});
