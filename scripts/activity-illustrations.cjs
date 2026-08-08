#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const ROOT = process.cwd();
const ACTIVITY_DIR = path.join(ROOT, "assets", "illustrations", "activity");
const AUDIT_DIR = path.join(ACTIVITY_DIR, "_audit");
const PROCESSED_DIR = path.join(ACTIVITY_DIR, "_processed");
const AUDIT_JSON = path.join(AUDIT_DIR, "activity-illustration-audit.json");
const AUDIT_MD = path.join(AUDIT_DIR, "activity-illustration-audit.md");

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const TARGET_SIZE = 1080;
const TARGET_ARTWORK_MAX = 900;
const EDGE_MARGIN_RATIO = 0.015;

const mode = process.argv.includes("--process") ? "process" : "audit";

function round(value, places = 3) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function rgbaIndex(width, x, y) {
  return (y * width + x) * 4;
}

function colorDistance(pixel, color) {
  const dr = pixel[0] - color.r;
  const dg = pixel[1] - color.g;
  const db = pixel[2] - color.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function isLightNeutral(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return r >= 226 && g >= 226 && b >= 220 && max - min <= 24;
}

function getBorderSample(data, width, height) {
  const sample = [];
  const push = (x, y) => {
    const idx = rgbaIndex(width, x, y);
    sample.push([data[idx], data[idx + 1], data[idx + 2], data[idx + 3]]);
  };

  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    if (height > 1) push(x, height - 1);
  }
  for (let y = 1; y < height - 1; y += 1) {
    push(0, y);
    if (width > 1) push(width - 1, y);
  }

  return sample;
}

function analyzeBackground(data, width, height) {
  const border = getBorderSample(data, width, height);
  const opaque = border.filter((px) => px[3] >= 245);
  const transparent = border.filter((px) => px[3] <= 12);
  const light = opaque.filter((px) => isLightNeutral(px[0], px[1], px[2]));
  const lightRatio = border.length ? light.length / border.length : 0;
  const transparentRatio = border.length
    ? transparent.length / border.length
    : 0;

  const averageLight = light.length
    ? light.reduce(
        (acc, px) => {
          acc.r += px[0];
          acc.g += px[1];
          acc.b += px[2];
          return acc;
        },
        { r: 0, g: 0, b: 0 }
      )
    : null;

  const color = averageLight
    ? {
        r: averageLight.r / light.length,
        g: averageLight.g / light.length,
        b: averageLight.b / light.length
      }
    : null;

  return {
    likelyFlatWhiteBackground: lightRatio >= 0.82 && transparentRatio < 0.1,
    borderLightRatio: round(lightRatio),
    borderTransparentRatio: round(transparentRatio),
    backgroundColor: color
      ? {
          r: Math.round(color.r),
          g: Math.round(color.g),
          b: Math.round(color.b)
        }
      : null
  };
}

function floodFillBackground(data, width, height, backgroundColor) {
  if (!backgroundColor) return { data, removedPixelCount: 0 };

  const removable = new Uint8Array(width * height);
  const visited = new Uint8Array(width * height);
  const queue = [];
  const hardThreshold = 27;
  const softThreshold = 48;

  const canEnter = (x, y) => {
    const offset = y * width + x;
    if (visited[offset]) return false;
    const idx = rgbaIndex(width, x, y);
    if (data[idx + 3] < 245) return false;
    return (
      colorDistance(
        [data[idx], data[idx + 1], data[idx + 2]],
        backgroundColor
      ) <= softThreshold
    );
  };

  const enqueue = (x, y) => {
    if (!canEnter(x, y)) return;
    const offset = y * width + x;
    visited[offset] = 1;
    queue.push([x, y]);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 1; y < height - 1; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const [x, y] = queue[cursor];
    removable[y * width + x] = 1;
    if (x > 0) enqueue(x - 1, y);
    if (x < width - 1) enqueue(x + 1, y);
    if (y > 0) enqueue(x, y - 1);
    if (y < height - 1) enqueue(x, y + 1);
  }

  const output = Buffer.from(data);
  let removedPixelCount = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = y * width + x;
      if (!removable[offset]) continue;

      const idx = rgbaIndex(width, x, y);
      const distance = colorDistance(
        [output[idx], output[idx + 1], output[idx + 2]],
        backgroundColor
      );
      if (distance <= hardThreshold) {
        output[idx + 3] = 0;
        removedPixelCount += 1;
      } else if (distance <= softThreshold) {
        const keepRatio =
          (distance - hardThreshold) / (softThreshold - hardThreshold);
        output[idx + 3] = Math.round(output[idx + 3] * keepRatio);
        removedPixelCount += 1;
      }
    }
  }

  return { data: output, removedPixelCount };
}

function getVisibleBounds(data, width, height, backgroundInfo) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let visiblePixels = 0;
  const alphaThreshold = 7;
  const backgroundColor = backgroundInfo.backgroundColor;
  const whiteBackground =
    backgroundInfo.likelyFlatWhiteBackground && backgroundColor;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = rgbaIndex(width, x, y);
      const alpha = data[idx + 3];
      if (alpha <= alphaThreshold) continue;

      let visible = true;
      if (whiteBackground && alpha >= 245) {
        const distance = colorDistance(
          [data[idx], data[idx + 1], data[idx + 2]],
          backgroundColor
        );
        visible =
          distance > 12 ||
          !isLightNeutral(data[idx], data[idx + 1], data[idx + 2]);
      }

      if (!visible) continue;
      visiblePixels += 1;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX === -1) return null;

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    right: maxX,
    bottom: maxY,
    visiblePixelCount: visiblePixels
  };
}

function boundsTouchEdge(bounds, width, height) {
  if (!bounds) return false;
  const margin = Math.max(
    12,
    Math.round(Math.min(width, height) * EDGE_MARGIN_RATIO)
  );
  return (
    bounds.x <= margin ||
    bounds.y <= margin ||
    width - 1 - bounds.right <= margin ||
    height - 1 - bounds.bottom <= margin
  );
}

function chooseRecommendation({
  metadata,
  backgroundInfo,
  bounds,
  touchesEdge,
  hasAlphaTransparency
}) {
  const already1080 =
    metadata.width === TARGET_SIZE && metadata.height === TARGET_SIZE;
  const needsScaleDown =
    bounds && Math.max(bounds.width, bounds.height) > TARGET_ARTWORK_MAX;

  if (!bounds) return "needs manual review";
  if (!hasAlphaTransparency && !backgroundInfo.likelyFlatWhiteBackground)
    return "needs manual review";
  if (backgroundInfo.likelyFlatWhiteBackground) return "remove background";
  if (touchesEdge || needsScaleDown) return "add padding / scale down";
  if (!already1080 || metadata.format !== "png") return "normalise only";
  return "keep";
}

async function listImageFiles() {
  const entries = await fs.readdir(ACTIVITY_DIR, { withFileTypes: true });
  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
    )
    .map((entry) => entry.name)
    .sort(naturalCompare);
}

async function analyzeImage(filename) {
  const sourcePath = path.join(ACTIVITY_DIR, filename);
  const image = sharp(sourcePath, { limitInputPixels: false });
  const metadata = await image.metadata();
  const { data, info } = await sharp(sourcePath, { limitInputPixels: false })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let transparentPixels = 0;
  for (let idx = 3; idx < data.length; idx += 4) {
    if (data[idx] < 245) transparentPixels += 1;
  }

  const backgroundInfo = analyzeBackground(data, info.width, info.height);
  const auditData = backgroundInfo.likelyFlatWhiteBackground
    ? floodFillBackground(
        data,
        info.width,
        info.height,
        backgroundInfo.backgroundColor
      ).data
    : data;
  const auditBoundsBackgroundInfo = backgroundInfo.likelyFlatWhiteBackground
    ? {
        ...backgroundInfo,
        likelyFlatWhiteBackground: false,
        backgroundColor: null
      }
    : backgroundInfo;
  const bounds = getVisibleBounds(
    auditData,
    info.width,
    info.height,
    auditBoundsBackgroundInfo
  );
  const touchesEdge = boundsTouchEdge(bounds, info.width, info.height);
  const hasAlphaTransparency = transparentPixels > 0;
  const already1080 =
    metadata.width === TARGET_SIZE && metadata.height === TARGET_SIZE;
  const recommendation = chooseRecommendation({
    metadata,
    backgroundInfo,
    bounds,
    touchesEdge,
    hasAlphaTransparency
  });

  return {
    filename,
    dimensions: {
      width: metadata.width,
      height: metadata.height
    },
    fileType: metadata.format,
    hasAlpha: Boolean(metadata.hasAlpha),
    hasTransparency: hasAlphaTransparency,
    likelyHasFlatWhiteOffWhiteBackground:
      backgroundInfo.likelyFlatWhiteBackground,
    background: backgroundInfo,
    visibleArtworkBounds: bounds
      ? {
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
          right: bounds.right,
          bottom: bounds.bottom,
          visiblePixelCount: bounds.visiblePixelCount
        }
      : null,
    artworkTouchesOrNearlyTouchesCanvasEdge: touchesEdge,
    appearsAlready1080x1080: already1080,
    recommendedAction: recommendation,
    notes: buildNotes({
      metadata,
      backgroundInfo,
      bounds,
      touchesEdge,
      recommendation
    })
  };
}

function buildNotes({
  metadata,
  backgroundInfo,
  bounds,
  touchesEdge,
  recommendation
}) {
  const notes = [];
  if (!bounds) notes.push("No reliable visible artwork bounds were detected.");
  if (backgroundInfo.likelyFlatWhiteBackground) {
    notes.push(
      "Edge-connected flat white/off-white background will be removed."
    );
  }
  if (!metadata.hasAlpha && !backgroundInfo.likelyFlatWhiteBackground) {
    notes.push(
      "Opaque image without a flat light edge background; inspect manually before removal."
    );
  }
  if (touchesEdge)
    notes.push("Artwork touches or nearly touches the source canvas edge.");
  if (bounds && Math.max(bounds.width, bounds.height) > TARGET_ARTWORK_MAX) {
    notes.push(
      "Artwork is larger than the target safe area and will be scaled down."
    );
  }
  if (metadata.width !== TARGET_SIZE || metadata.height !== TARGET_SIZE) {
    notes.push("Canvas is not 1080x1080 and will be normalized.");
  }
  if (recommendation === "keep")
    notes.push("Already matches the target canvas and safe-area checks.");
  return notes;
}

async function processImage(filename) {
  const sourcePath = path.join(ACTIVITY_DIR, filename);
  const metadata = await sharp(sourcePath, {
    limitInputPixels: false
  }).metadata();
  const raw = await sharp(sourcePath, { limitInputPixels: false })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const backgroundInfo = analyzeBackground(
    raw.data,
    raw.info.width,
    raw.info.height
  );
  const backgroundRemoved = backgroundInfo.likelyFlatWhiteBackground
    ? floodFillBackground(
        raw.data,
        raw.info.width,
        raw.info.height,
        backgroundInfo.backgroundColor
      )
    : { data: raw.data, removedPixelCount: 0 };

  const processedBackgroundInfo = {
    ...backgroundInfo,
    likelyFlatWhiteBackground: false,
    backgroundColor: null
  };
  const bounds =
    getVisibleBounds(
      backgroundRemoved.data,
      raw.info.width,
      raw.info.height,
      processedBackgroundInfo
    ) ||
    getVisibleBounds(raw.data, raw.info.width, raw.info.height, backgroundInfo);

  if (!bounds) {
    throw new Error(`No visible artwork bounds detected for ${filename}`);
  }

  const inputForComposite = sharp(backgroundRemoved.data, {
    raw: {
      width: raw.info.width,
      height: raw.info.height,
      channels: 4
    },
    limitInputPixels: false
  });

  const cropPad = Math.max(
    8,
    Math.round(Math.min(raw.info.width, raw.info.height) * 0.01)
  );
  const crop = {
    left: Math.max(0, bounds.x - cropPad),
    top: Math.max(0, bounds.y - cropPad),
    right: Math.min(raw.info.width - 1, bounds.right + cropPad),
    bottom: Math.min(raw.info.height - 1, bounds.bottom + cropPad)
  };
  const cropWidth = crop.right - crop.left + 1;
  const cropHeight = crop.bottom - crop.top + 1;
  const scale = Math.min(
    1,
    TARGET_ARTWORK_MAX / Math.max(bounds.width, bounds.height)
  );
  const outputWidth = Math.max(1, Math.round(cropWidth * scale));
  const outputHeight = Math.max(1, Math.round(cropHeight * scale));
  const left = Math.round((TARGET_SIZE - outputWidth) / 2);
  const top = Math.round((TARGET_SIZE - outputHeight) / 2);
  const outputFilename = filename.replace(/\.(jpe?g|webp|png)$/i, ".png");
  const outputPath = path.join(PROCESSED_DIR, outputFilename);

  const artwork = await inputForComposite
    .extract({
      left: crop.left,
      top: crop.top,
      width: cropWidth,
      height: cropHeight
    })
    .resize(outputWidth, outputHeight, {
      fit: "inside",
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: true
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: TARGET_SIZE,
      height: TARGET_SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: artwork, left, top }])
    .png()
    .toFile(outputPath);

  return {
    filename,
    outputFilename,
    outputPath: path.relative(ROOT, outputPath),
    originalDimensions: {
      width: metadata.width,
      height: metadata.height
    },
    outputDimensions: {
      width: TARGET_SIZE,
      height: TARGET_SIZE
    },
    removedBackground: backgroundInfo.likelyFlatWhiteBackground,
    removedBackgroundPixelCount: backgroundRemoved.removedPixelCount,
    scale: round(scale),
    placement: { left, top, width: outputWidth, height: outputHeight }
  };
}

function renderMarkdown(audit, processed) {
  const manualReview = audit.images.filter(
    (image) => image.recommendedAction === "needs manual review"
  );
  const actionCounts = audit.images.reduce((acc, image) => {
    acc[image.recommendedAction] = (acc[image.recommendedAction] || 0) + 1;
    return acc;
  }, {});

  const lines = [
    "# Activity Illustration Audit",
    "",
    `Generated: ${audit.generatedAt}`,
    `Source folder: \`${audit.sourceFolder}\``,
    `Processed folder: \`${audit.processedFolder}\``,
    "",
    "## Summary",
    "",
    `- Images scanned: ${audit.images.length}`,
    `- Already 1080x1080: ${audit.images.filter((image) => image.appearsAlready1080x1080).length}`,
    `- Likely flat white/off-white background: ${
      audit.images.filter((image) => image.likelyHasFlatWhiteOffWhiteBackground)
        .length
    }`,
    `- Touches or nearly touches canvas edge: ${
      audit.images.filter(
        (image) => image.artworkTouchesOrNearlyTouchesCanvasEdge
      ).length
    }`,
    `- Manual visual review recommended: ${manualReview.length}`,
    "",
    "## Recommended Actions",
    "",
    ...Object.entries(actionCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([action, count]) => `- ${action}: ${count}`),
    "",
    "## Manual Review Notes",
    ""
  ];

  if (manualReview.length === 0) {
    lines.push(
      "No files were automatically classified as needing manual review."
    );
  } else {
    for (const image of manualReview) {
      lines.push(`- \`${image.filename}\`: ${image.notes.join(" ")}`);
    }
  }

  lines.push(
    "",
    "## Processing Rules Applied",
    "",
    "- Output files are written as 1080x1080 PNGs.",
    "- Originals are never overwritten.",
    "- Existing filenames are preserved, with JPG/WebP extensions converted to `.png` in `_processed`.",
    "- Only edge-connected flat white/off-white backgrounds are removed.",
    "- Artwork is not redrawn, regenerated, restyled, sharpened, blurred, or recoloured.",
    "- Faint visible pixels are included in artwork bounds so splatters and translucent washes are preserved.",
    "- Artwork larger than the safe area is scaled down; smaller artwork is not enlarged.",
    "",
    "## Image Audit",
    "",
    "| File | Size | Type | Alpha | Flat light bg | Bounds | Edge | 1080 | Recommended action | Notes |",
    "| --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- |"
  );

  for (const image of audit.images) {
    const bounds = image.visibleArtworkBounds
      ? `${image.visibleArtworkBounds.x},${image.visibleArtworkBounds.y} ${image.visibleArtworkBounds.width}x${image.visibleArtworkBounds.height}`
      : "none";
    lines.push(
      `| \`${image.filename}\` | ${image.dimensions.width}x${image.dimensions.height} | ${image.fileType} | ${
        image.hasAlpha ? "yes" : "no"
      } | ${image.likelyHasFlatWhiteOffWhiteBackground ? "yes" : "no"} | ${bounds} | ${
        image.artworkTouchesOrNearlyTouchesCanvasEdge ? "yes" : "no"
      } | ${image.appearsAlready1080x1080 ? "yes" : "no"} | ${image.recommendedAction} | ${
        image.notes.join(" ") || "-"
      } |`
    );
  }

  if (processed) {
    lines.push("", "## Processed Output", "");
    for (const item of processed) {
      lines.push(
        `- \`${item.outputFilename}\`: ${item.outputDimensions.width}x${item.outputDimensions.height}, scale ${item.scale}, background removed: ${
          item.removedBackground ? "yes" : "no"
        }`
      );
    }
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  await fs.mkdir(AUDIT_DIR, { recursive: true });
  if (mode === "process") await fs.mkdir(PROCESSED_DIR, { recursive: true });

  const filenames = await listImageFiles();
  const images = [];
  for (const filename of filenames) {
    images.push(await analyzeImage(filename));
  }

  const processed = [];
  if (mode === "process") {
    for (const filename of filenames) {
      processed.push(await processImage(filename));
    }
  }

  const audit = {
    generatedAt: new Date().toISOString(),
    sourceFolder: path.relative(ROOT, ACTIVITY_DIR),
    auditFolder: path.relative(ROOT, AUDIT_DIR),
    processedFolder: path.relative(ROOT, PROCESSED_DIR),
    mode,
    images,
    processed: mode === "process" ? processed : undefined
  };

  await fs.writeFile(AUDIT_JSON, `${JSON.stringify(audit, null, 2)}\n`);
  await fs.writeFile(
    AUDIT_MD,
    renderMarkdown(audit, mode === "process" ? processed : null)
  );

  console.log(
    `${mode === "process" ? "Processed" : "Audited"} ${images.length} activity illustration image${
      images.length === 1 ? "" : "s"
    }.`
  );
  console.log(`Audit JSON: ${path.relative(ROOT, AUDIT_JSON)}`);
  console.log(`Audit Markdown: ${path.relative(ROOT, AUDIT_MD)}`);
  if (mode === "process")
    console.log(`Processed output: ${path.relative(ROOT, PROCESSED_DIR)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
