#!/usr/bin/env node

/**
 * extract-images.mjs - Extract embedded images from PDF pages.
 */

import fs from "node:fs";
import path from "node:path";
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";
import { PNG } from "pngjs";

const HELP = `Usage: node scripts/extract-images.mjs <pdf-path> [options]

Extract embedded images from a PDF and save as PNG files.

Options:
  --page N          Extract from a single page
  --pages RANGE     Extract from page range (e.g., "1-10", "5,10,15")
  --output-dir DIR  Directory to save images (default: ./pdf-images)
  --list-only       List images without extracting (fast scan)
  --min-size N      Minimum image dimension in pixels (default: 10)
  --help, -h        Show this help message

  Without --page or --pages, scans all pages.

Output (JSON to stdout):
  Array of { page, name, width, height, dataSize, savedAs? }

Examples:
  node scripts/extract-images.mjs doc.pdf --list-only
  node scripts/extract-images.mjs doc.pdf --pages 1-30 --list-only
  node scripts/extract-images.mjs doc.pdf --page 5 --output-dir ./images
  node scripts/extract-images.mjs doc.pdf --output-dir ./images

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

function getArg(name, defaultValue) {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultValue;
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

const listOnly = args.includes("--list-only");
const outputDir = getArg("--output-dir", "./pdf-images");
const minSize = parseInt(getArg("--min-size", "10"), 10);

function toPNG(imgData) {
  const { width, height, data, kind } = imgData;
  const png = new PNG({ width, height });
  const pixelCount = width * height;

  if (kind === 3 || (!kind && data.length === pixelCount * 4)) {
    for (let i = 0; i < data.length; i++) png.data[i] = data[i];
  } else if (kind === 2 || (!kind && data.length === pixelCount * 3)) {
    let src = 0, dst = 0;
    for (let i = 0; i < pixelCount; i++) {
      png.data[dst++] = data[src++];
      png.data[dst++] = data[src++];
      png.data[dst++] = data[src++];
      png.data[dst++] = 255;
    }
  } else if (kind === 1 || (!kind && data.length === pixelCount)) {
    let src = 0, dst = 0;
    for (let i = 0; i < pixelCount; i++) {
      const g = data[src++];
      png.data[dst++] = g;
      png.data[dst++] = g;
      png.data[dst++] = g;
      png.data[dst++] = 255;
    }
  } else {
    const expected = pixelCount * 4;
    if (data.length >= expected) {
      for (let i = 0; i < expected; i++) png.data[i] = data[i];
    } else {
      return null;
    }
  }
  return PNG.sync.write(png);
}

function getImageObj(page, name) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), 5000);
    try {
      page.objs.get(name, (data) => { clearTimeout(timeout); resolve(data); });
    } catch { clearTimeout(timeout); resolve(null); }
  });
}

async function main() {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;

  const singlePage = getArg("--page", null);
  const pageRange = getArg("--pages", null);
  let pageNumbers;

  if (singlePage) {
    pageNumbers = [parseInt(singlePage, 10)];
  } else if (pageRange) {
    pageNumbers = parsePageRanges(pageRange, doc.numPages);
  } else {
    pageNumbers = Array.from({ length: doc.numPages }, (_, i) => i + 1);
  }

  if (!listOnly) fs.mkdirSync(outputDir, { recursive: true });

  console.error(`${listOnly ? "Listing" : "Extracting"} images from ${pageNumbers.length} page(s)...`);

  const imageList = [];

  for (const pageNum of pageNumbers) {
    const page = await doc.getPage(pageNum);
    const ops = await page.getOperatorList();
    const processed = new Set();

    for (let i = 0; i < ops.fnArray.length; i++) {
      const fn = ops.fnArray[i];
      if (fn !== OPS.paintImageXObject && fn !== OPS.paintJpegXObject && fn !== OPS.paintImageXObjectRepeat) continue;

      const imgName = ops.argsArray[i][0];
      if (processed.has(imgName)) continue;
      processed.add(imgName);

      const imgData = await getImageObj(page, imgName);
      if (!imgData?.width || !imgData?.height) continue;
      if (imgData.width < minSize || imgData.height < minSize) continue;

      const imgInfo = {
        page: pageNum,
        name: imgName,
        width: imgData.width,
        height: imgData.height,
        dataSize: imgData.data ? imgData.data.length : 0,
      };
      imageList.push(imgInfo);

      if (!listOnly && imgData.data) {
        const filename = `page${pageNum}_${imgName.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
        const filepath = path.join(outputDir, filename);
        try {
          const pngBuffer = toPNG(imgData);
          if (pngBuffer) {
            fs.writeFileSync(filepath, pngBuffer);
            imgInfo.savedAs = filepath;
            console.error(`  Page ${pageNum}: ${imgName} (${imgData.width}x${imgData.height}) -> ${filename}`);
          } else {
            console.error(`  Page ${pageNum}: ${imgName} (${imgData.width}x${imgData.height}) - could not encode`);
          }
        } catch (err) {
          console.error(`  Page ${pageNum}: ${imgName} - error: ${err.message}`);
        }
      } else if (listOnly) {
        console.error(`  Page ${pageNum}: ${imgName} (${imgData.width}x${imgData.height})`);
      }
    }
  }

  console.error(`\nTotal: ${imageList.length} image(s)`);
  console.log(JSON.stringify(imageList, null, 2));
  await doc.destroy();
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(2);
});
