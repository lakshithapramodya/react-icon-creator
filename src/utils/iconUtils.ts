import { IconUtilsConfig } from "../types";

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
