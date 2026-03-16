#!/usr/bin/env node

/**
 * extract-text.mjs - Extract text content from PDF pages.
 */

import fs from "node:fs";
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";

const HELP = `Usage: node scripts/extract-text.mjs <pdf-path> [options]

Extract text content from specific pages of a PDF.

Options:
  --pages RANGE   Pages to extract (e.g., "1-5", "1,3,10-20"). Required for
                  documents over 50 pages unless --all is passed.
  --all           Extract all pages (use with caution on large documents)
  --output FILE   Write output to FILE instead of stdout
  --help, -h      Show this help message

Output:
  Text content with "--- Page N ---" markers between pages.
  Sent to stdout (or to FILE if --output is used).

Examples:
  node scripts/extract-text.mjs doc.pdf --pages 1-5
  node scripts/extract-text.mjs doc.pdf --pages 1,3,50-55,100
  node scripts/extract-text.mjs doc.pdf --pages 42
  node scripts/extract-text.mjs doc.pdf --all --output full.txt

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
      if (isNaN(s) || isNaN(e)) {
        console.error(`Error: Invalid page range "${trimmed}". Expected format: N-M (e.g., 1-5).`);
        process.exit(1);
      }
      for (let i = Math.max(1, s); i <= Math.min(e, maxPage); i++) pages.add(i);
    } else {
      const n = parseInt(trimmed, 10);
      if (isNaN(n)) {
        console.error(`Error: Invalid page number "${trimmed}". Must be a positive integer.`);
        process.exit(1);
      }
      if (n >= 1 && n <= maxPage) pages.add(n);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

async function extractPageText(page) {
  const textContent = await page.getTextContent();
  const items = textContent.items.filter((item) => item.str !== undefined);
  if (items.length === 0) return "";

  const lines = [];
  let currentLine = [];
  let lastY = null;
  const Y_TOLERANCE = 2;

  for (const item of items) {
    if (lastY !== null && Math.abs(item.transform[5] - lastY) > Y_TOLERANCE) {
      if (currentLine.length > 0) {
        currentLine.sort((a, b) => a.x - b.x);
        lines.push(currentLine.map((i) => i.text).join(" "));
      }
      currentLine = [];
    }
    currentLine.push({ text: item.str, x: item.transform[4] });
    lastY = item.transform[5];
  }
  if (currentLine.length > 0) {
    currentLine.sort((a, b) => a.x - b.x);
    lines.push(currentLine.map((i) => i.text).join(" "));
  }
  return lines.join("\n");
}

const MIN_IMAGE_SIZE = 50;

function classifyPosition(y, pageHeight) {
  const ratio = y / pageHeight;
  if (ratio > 0.66) return "top";
  if (ratio > 0.33) return "middle";
  return "bottom";
}

function getImageObj(page, name) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), 3000);
    try {
      page.objs.get(name, (data) => { clearTimeout(timeout); resolve(data); });
    } catch { clearTimeout(timeout); resolve(null); }
  });
}

async function scanPageImages(page) {
  const ops = await page.getOperatorList();
  const viewport = page.getViewport({ scale: 1 });
  const pageHeight = viewport.height;
  const processed = new Set();
  const images = [];

  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i];
    if (fn !== OPS.paintImageXObject && fn !== OPS.paintJpegXObject && fn !== OPS.paintImageXObjectRepeat) continue;

    const imgName = ops.argsArray[i][0];
    if (processed.has(imgName)) continue;
    processed.add(imgName);

    const imgData = await getImageObj(page, imgName);
    if (!imgData?.width || !imgData?.height) continue;
    if (imgData.width < MIN_IMAGE_SIZE || imgData.height < MIN_IMAGE_SIZE) continue;

    const transformIndex = findTransformForImage(ops, i);
    let position = "unknown";
    if (transformIndex !== null) {
      const transformArgs = ops.argsArray[transformIndex];
      const y = transformArgs[0]?.[5] ?? transformArgs[5];
      if (typeof y === "number") position = classifyPosition(y, pageHeight);
    }

    images.push({ width: imgData.width, height: imgData.height, position });
  }

  return images;
}

function findTransformForImage(ops, imageOpIndex) {
  for (let j = imageOpIndex - 1; j >= Math.max(0, imageOpIndex - 5); j--) {
    if (ops.fnArray[j] === OPS.transform) return j;
  }
  return null;
}

function formatImageSummary(images) {
  if (images.length === 0) return "";
  const lines = [`\n[${images.length} embedded image(s) on this page]`];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const size = img.width >= 400 || img.height >= 400 ? "large" : img.width >= 150 || img.height >= 150 ? "medium" : "small";
    lines.push(`  image ${i + 1}: ${img.width}x${img.height}px, ${size}, position: ${img.position}`);
  }
  lines.push(`[If relevant, use extract-images.mjs --page N to extract specific images]`);
  return lines.join("\n");
}

async function main() {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;

  const pagesArg = getArg("--pages");
  const allFlag = args.includes("--all");
  const outputPath = getArg("--output");

  let pageNumbers;
  if (pagesArg) {
    pageNumbers = parsePageRanges(pagesArg, doc.numPages);
  } else if (allFlag || doc.numPages <= 50) {
    pageNumbers = Array.from({ length: doc.numPages }, (_, i) => i + 1);
  } else {
    console.error(
      `Error: Document has ${doc.numPages} pages. Use --pages to specify a range, or --all to extract everything.\n` +
      `Example: --pages 1-10`
    );
    process.exit(1);
  }

  console.error(`Extracting text from ${pageNumbers.length} of ${doc.numPages} page(s)...`);

  const output = [];
  for (const pageNum of pageNumbers) {
    const page = await doc.getPage(pageNum);
    const text = await extractPageText(page);
    const images = await scanPageImages(page);
    const imageSummary = formatImageSummary(images);
    output.push(`\n--- Page ${pageNum} ---\n${text}${imageSummary}`);
  }

  const result = output.join("\n");
  if (outputPath) {
    fs.writeFileSync(outputPath, result, "utf8");
    console.error(`Written to ${outputPath}`);
  } else {
    console.log(result);
  }

  await doc.destroy();
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(2);
});
