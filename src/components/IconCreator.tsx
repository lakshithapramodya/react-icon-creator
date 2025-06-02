import React, { useState, useEffect } from "react";
import { IconCreatorProps, IconData } from "../types";
import {
  optimizeSVG,
  generateCSS,
  isValidSVG,
  downloadCSS,
  saveIconToDirectory,
  saveSvgToDirectory,
} from "../utils/iconUtils";
import { isBrowser, supportsFileSystem } from "../utils/envUtils";

export const IconCreator: React.FC<IconCreatorProps> = ({
  onIconCreated,
  onError,
  className = "",
  style = {},
  saveToDirectory = false,
  outputDirectory = "public/icons",
  onFileSaved,
}) => {
  const [svg, setSvg] = useState("");
  const [iconClassName, setIconClassName] = useState("");
  const [displayType, setDisplayType] = useState<"svg" | "background">("svg");
  const [isProcessing, setIsProcessing] = useState(false);
  const [canSaveToDirectory, setCanSaveToDirectory] = useState(false);

  // Check if file system operations are supported
  useEffect(() => {
    setCanSaveToDirectory(supportsFileSystem());

    // Warn if user wants to save to directory but it's not supported
    if (saveToDirectory && !supportsFileSystem()) {
      console.warn(
        "File system operations are not supported in this environment. Files will be downloaded instead."
      );
    }
  }, [saveToDirectory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!svg.trim()) {
      onError?.("SVG data is required");
      return;
    }

    if (!iconClassName.trim()) {
      onError?.("Icon class name is required");
      return;
    }

    if (!isValidSVG(svg)) {
      onError?.("Invalid SVG data");
      return;
    }

    setIsProcessing(true);

    try {
      const optimizedSvg = await optimizeSVG(svg);
      const cssContent = generateCSS(iconClassName, optimizedSvg, displayType);

      const iconData: IconData = {
        className: iconClassName,
        type: displayType,
        file: saveToDirectory && canSaveToDirectory
          ? `${outputDirectory}/${iconClassName}.css`
          : "generated",
        svgData: optimizedSvg,
      };

      // Determine whether to save to directory or download
      const shouldSaveToDirectory = saveToDirectory && canSaveToDirectory;

      if (shouldSaveToDirectory) {
        // Save the CSS file to the directory
        const cssSaveResult = await saveIconToDirectory(
          outputDirectory,
          iconClassName,
          cssContent
        );

        // Also save the SVG file for reference
        const svgSaveResult = await saveSvgToDirectory(
          outputDirectory,
          iconClassName,
          optimizedSvg
        );

        if (cssSaveResult.success) {
          onFileSaved?.(cssSaveResult);
          onIconCreated?.(iconData);
        } else {
          // If saving to directory fails, fall back to downloading
          onError?.(cssSaveResult.message);
          downloadCSS(cssContent, `${iconClassName}.css`);
        }
      } else {
        // Use the existing download functionality
        downloadCSS(cssContent, `${iconClassName}.css`);
        onIconCreated?.(iconData);
      }

      // Reset form
      setSvg("");
      setIconClassName("");
      setDisplayType("svg");
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : "Failed to process icon"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`icon-creator ${className}`} style={style}>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            Create Custom Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <path d="m9 16 3-3 3 3"></path>
              <path d="M5 6v-.5a2.5 2.5 0 0 1 5 0V6"></path>
              <path d="M14 6v-.5a2.5 2.5 0 0 1 5 0V6"></path>
            </svg>
            <span className="text-sm text-gray-500">
              {saveToDirectory && canSaveToDirectory
                ? "SVGs are saved to directory and compressed"
                : "SVGs are automatically compressed"}
              {saveToDirectory && !canSaveToDirectory && (
                <span className="text-yellow-500">
                  {" "}
                  (Directory save not available in this environment)
                </span>
              )}
            </span>
          </h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="svg" className="form-label">
                SVG Data
              </label>
              <textarea
                id="svg"
                value={svg}
                onChange={(e) => setSvg(e.target.value)}
                placeholder="Paste your SVG data here"
                required
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="className" className="form-label">
                Icon Class Name
              </label>
              <input
                type="text"
                id="className"
                value={iconClassName}
                onChange={(e) => setIconClassName(e.target.value)}
                placeholder="e.g., my-custom-icon"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Display Type</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="svg-option"
                    name="displayType"
                    value="svg"
                    checked={displayType === "svg"}
                    onChange={() => setDisplayType("svg")}
                  />
                  <label htmlFor="svg-option">SVG (mask-based)</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="background-option"
                    name="displayType"
                    value="background"
                    checked={displayType === "background"}
                    onChange={() => setDisplayType("background")}
                  />
                  <label htmlFor="background-option">Background Image</label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing..."
                : saveToDirectory && canSaveToDirectory
                ? `Create Icon & Save to ${outputDirectory}`
                : "Create Icon & Download CSS"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
