import { IconUtilsConfig, FileSaveResult, FileSystemOptions } from "../types";
import { isBrowser, isNode, supportsFileSystem } from "./envUtils";

// Import types but not the actual modules to avoid browser issues
import type * as fseType from "fs-extra";
import type * as pathType from "path";

// Only load fs-extra and path modules in Node environment
let fse: typeof fseType | null = null;
let path: typeof pathType | null = null;

// Dynamically import modules only when needed and in Node environment
const loadNodeModules = (): boolean => {
  if (supportsFileSystem()) {
    try {
      // Dynamic imports using require - these will only execute in Node.js
      fse = require("fs-extra");
      path = require("path");
      return true;
    } catch (e) {
      console.error("Failed to load Node.js modules:", e);
      return false;
    }
  }
  return false;
};

export const isValidSVG = (svgString: string): boolean => {
  if (isBrowser()) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const errorElement = doc.querySelector("parsererror");
    return !errorElement;
  } else {
    // Simple validation for non-browser environments
    return svgString.includes("<svg") && svgString.includes("</svg>");
  }
};

// This function now just returns the original SVG - optimization is handled server-side
export const optimizeSVG = async (
  svg: string,
  config: IconUtilsConfig = {}
): Promise<string> => {
  // For client-side usage, we'll just return the original SVG
  // Real optimization happens server-side through form actions
  return svg;
};

export const generateCSS = (
  className: string,
  optimizedSvg: string,
  displayType: "svg" | "background"
): string => {
  const encodedSvg = encodeURIComponent(optimizedSvg);

  if (displayType === "background") {
    return `
.${className} {
  background-image: url("data:image/svg+xml,${encodedSvg}");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
`;
  } else {
    return `
.${className} {
  --svg: url("data:image/svg+xml,${encodedSvg}");
  display: inline-block;
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
`;
  }
};

export const downloadCSS = (cssContent: string, fileName: string): void => {
  if (!isBrowser()) {
    console.warn("downloadCSS is only available in browser environments");
    return;
  }

  const blob = new Blob([cssContent], { type: "text/css" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".css") ? fileName : `${fileName}.css`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const calculateCompressionStats = (
  originalSvg: string,
  optimizedSvg: string
): { originalSize: number; optimizedSize: number; savings: string } => {
  let originalSize: number;
  let optimizedSize: number;

  if (isBrowser() && typeof TextEncoder !== "undefined") {
    const encoder = new TextEncoder();
    originalSize = encoder.encode(originalSvg).length;
    optimizedSize = encoder.encode(optimizedSvg).length;
  } else {
    // Fallback for environments without TextEncoder
    originalSize = Buffer.byteLength(originalSvg, "utf8");
    optimizedSize = Buffer.byteLength(optimizedSvg, "utf8");
  }

  const savings = (
    ((originalSize - optimizedSize) / originalSize) *
    100
  ).toFixed(1);

  return {
    originalSize,
    optimizedSize,
    savings: `${savings}%`,
  };
};

/**
 * Ensures a directory exists, creating it if necessary
 * @param directory - Path to the directory
 * @returns {boolean} - True if successful, false if failed or not supported
 */
export const ensureDirectoryExists = (directory: string): boolean => {
  if (!loadNodeModules() || !fse) {
    console.warn(
      "File system operations are not supported in this environment"
    );
    return false;
  }

  try {
    fse.ensureDirSync(directory);
    return true;
  } catch (error) {
    console.error(
      `Failed to create directory: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return false;
  }
};

/**
 * Saves content to a file in the specified directory
 * @param directory - Directory to save the file in
 * @param filename - Name of the file
 * @param content - Content to save
 * @param options - File system options
 * @returns Promise resolving to a FileSaveResult object
 */
export const saveToFile = async (
  directory: string,
  filename: string,
  content: string,
  options: FileSystemOptions = {}
): Promise<FileSaveResult> => {
  if (!loadNodeModules() || !fse || !path) {
    return {
      success: false,
      message: "File system operations are not supported in this environment",
      className: filename.split(".")[0],
      fileType: (filename.split(".").pop() || "css") as "css" | "svg",
    };
  }

  try {
    const directoryCreated = ensureDirectoryExists(directory);
    if (!directoryCreated) {
      throw new Error("Could not create directory");
    }

    const filePath = path.join(directory, filename);
    const fileExt = path.extname(filename).slice(1) as "css" | "svg";
    const className = path.basename(filename, path.extname(filename));

    await fse.writeFile(filePath, content, {
      encoding: (options.encoding as BufferEncoding | undefined) || "utf8",
      flag: options.flag || "w",
      mode: options.mode || 0o666,
    });

    return {
      success: true,
      message: `File saved successfully at ${filePath}`,
      filePath,
      className,
      fileType: fileExt,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to save file: ${
        error instanceof Error ? error.message : String(error)
      }`,
      className: path.basename(filename, path.extname(filename)),
      fileType: path.extname(filename).slice(1) as "css" | "svg",
    };
  }
};

/**
 * Saves an icon as CSS to the specified directory
 * @param directory - Directory to save the file in
 * @param className - CSS class name for the icon
 * @param cssContent - CSS content to save
 * @returns Promise resolving to a FileSaveResult object
 */
export const saveIconToDirectory = async (
  directory: string,
  className: string,
  cssContent: string
): Promise<FileSaveResult> => {
  const filename = `${className}.css`;
  return saveToFile(directory, filename, cssContent);
};

/**
 * Saves an SVG file to the specified directory
 * @param directory - Directory to save the file in
 * @param iconName - Name for the icon
 * @param svgContent - SVG content to save
 * @returns Promise resolving to a FileSaveResult object
 */
export const saveSvgToDirectory = async (
  directory: string,
  iconName: string,
  svgContent: string
): Promise<FileSaveResult> => {
  const filename = `${iconName}.svg`;
  return saveToFile(directory, filename, svgContent);
};
