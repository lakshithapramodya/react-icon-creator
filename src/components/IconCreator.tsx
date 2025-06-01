import React, { useState } from "react";
import { IconCreatorProps, IconData } from "../types";
import { optimizeSVG, generateCSS, isValidSVG } from "../utils/iconUtils";

export const IconCreator: React.FC<IconCreatorProps> = ({
  onIconCreated,
  onError,
  className = "",
  style = {},
}) => {
  const [svg, setSvg] = useState("");
  const [iconClassName, setIconClassName] = useState("");
  const [displayType, setDisplayType] = useState<"svg" | "background">("svg");
  const [isProcessing, setIsProcessing] = useState(false);

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
        file: "generated",
        svgData: optimizedSvg,
      };

      // Create and trigger download of CSS file
      const blob = new Blob([cssContent], { type: "text/css" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${iconClassName}.css`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onIconCreated?.(iconData);

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
              SVGs are automatically compressed
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
              {isProcessing ? "Processing..." : "Create Icon & Download CSS"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
