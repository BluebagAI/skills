#!/usr/bin/env node

/**
 * get-info.mjs - Get PDF metadata, page count, and table of contents.
 */

import fs from "node:fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const HELP = `Usage: node scripts/get-info.mjs <pdf-path>

Get metadata, page count, and table of contents from a PDF.

Options:
  --help, -h    Show this help message

Output (JSON to stdout):
  pageCount     Total number of pages
  metadata      Title, author, subject, creator, producer, dates
  outline       Table of contents / bookmarks with page numbers

Examples:
  node scripts/get-info.mjs document.pdf
  node scripts/get-info.mjs ./manuals/spec.pdf | jq .pageCount

Exit codes:
  0  Success
  1  Invalid arguments
  2  File not found or read error`;

const args = process.argv.slice(2);
const pdfPath = args.find((a) => !a.startsWith("-"));

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

async function getOutlineItems(doc, items) {
  if (!items || items.length === 0) return [];
  const result = [];
  for (const item of items) {
    const entry = { title: item.title };
    if (item.dest) {
      try {
        let dest = item.dest;
        if (typeof dest === "string") dest = await doc.getDestination(dest);
        if (dest && dest[0]) {
          entry.page = (await doc.getPageIndex(dest[0])) + 1;
        }
      } catch {
        // Some destinations can't be resolved
      }
    }
    if (item.items && item.items.length > 0) {
      entry.children = await getOutlineItems(doc, item.items);
    }
    result.push(entry);
  }
  return result;
}

async function main() {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;
  const metadata = await doc.getMetadata();
  const outline = await doc.getOutline();

  const info = {
    pageCount: doc.numPages,
    metadata: {
      title: metadata.info?.Title || null,
      author: metadata.info?.Author || null,
      subject: metadata.info?.Subject || null,
      creator: metadata.info?.Creator || null,
      producer: metadata.info?.Producer || null,
      creationDate: metadata.info?.CreationDate || null,
      modDate: metadata.info?.ModDate || null,
    },
    outline: await getOutlineItems(doc, outline),
  };

  console.log(JSON.stringify(info, null, 2));
  await doc.destroy();
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(2);
});
