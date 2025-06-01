import { IconUtilsConfig, FileSaveResult, FileSystemOptions } from "../types";
import * as fse from "fs-extra";
import * as path from "path";

export const isValidSVG = (svgString: string): boolean => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const errorElement = doc.querySelector("parsererror");
  return !errorElement;
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
  const originalSize = new TextEncoder().encode(originalSvg).length;
  const optimizedSize = new TextEncoder().encode(optimizedSvg).length;
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
 */
export const ensureDirectoryExists = (directory: string): void => {
  try {
    fse.ensureDirSync(directory);
  } catch (error) {
    throw new Error(
      `Failed to create directory: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
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
  try {
    ensureDirectoryExists(directory);

    const filePath = path.join(directory, filename);
    const fileExt = path.extname(filename).slice(1) as "css" | "svg";
    const className = path.basename(filename, path.extname(filename));

    // Fix typing issue by using correct overload for writeFile
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
