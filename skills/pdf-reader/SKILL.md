---
name: pdf-reader
description: 'WHAT: Read and extract content from PDF files — text, tables, and images. WHEN: the user asks about content in a PDF, mentions a .pdf file, or needs data extracted from technical documents, manuals, specifications, or reports. KEYWORDS: PDF, extract text, extract tables, extract images, pdf reader, document, datasheet, manual, specification, report.'
---

# PDF Reader

Extract text, tables, and images from any PDF using `pdfjs-dist` scripts. All extraction is deterministic — no artificial inference.

## Workflow for Large Documents

For documents over ~20 pages, follow this sequence. For short documents, skip to step 3.

### 1. Understand the document

```bash
node scripts/get-info.mjs <pdf>
```

Returns page count, metadata (title, author, dates), and table of contents.

### 2. Find relevant pages

```bash
node scripts/search-text.mjs <pdf> --query "search term"
```

Searches all pages. Returns JSON array of matches with page numbers and context.
Use `--max-results 10` and `--offset N` for pagination.

### 3. Extract text from targeted pages

```bash
node scripts/extract-text.mjs <pdf> --pages 1-5,10,20
```

For large documents, `--pages` is required (unless `--all` is passed).
Use `--output file.txt` to write to a file instead of stdout.

### 4. Extract tables

```bash
node scripts/extract-tables.mjs <pdf> --page 20
```

Detects tables by analyzing text positions. Supports `--format markdown` (default), `csv`, or `json`.
Use `--output file.json` for large results.

### 5. Extract images

```bash
node scripts/extract-images.mjs <pdf> --pages 1-30 --list-only
node scripts/extract-images.mjs <pdf> --page 5 --output-dir ./images
```

Use `--list-only` first to scan, then extract specific pages. Saves images as PNG.

### 6. Raw structural analysis (advanced)

```bash
node scripts/extract-structure.mjs <pdf> --page 20
```

Returns every text item with exact x/y coordinates, font info, and dimensions.
Use when table extraction doesn't capture a complex layout correctly.

## Quick Reference

| Task           | Script                  | Key flags                               |
| -------------- | ----------------------- | --------------------------------------- |
| Document info  | `get-info.mjs`          |                                         |
| Search text    | `search-text.mjs`       | `--query`, `--max-results`, `--offset`  |
| Extract text   | `extract-text.mjs`      | `--pages`, `--all`, `--output`          |
| Extract tables | `extract-tables.mjs`    | `--page`, `--format`, `--output`        |
| Extract images | `extract-images.mjs`    | `--page`, `--output-dir`, `--list-only` |
| Raw positions  | `extract-structure.mjs` | `--page`, `--output`                    |

All scripts support `--help` for full usage details.

## If text extraction returns empty results

The PDF may be scanned (image-only). Use `extract-images.mjs` to extract page images instead.

## If table extraction misses a table

Use `extract-structure.mjs` to get raw positional data and analyze the layout from coordinates.
