import React, { useState } from "react";
import { IconEditorProps } from "../types";
import { optimizeSVG, generateCSS, isValidSVG } from "../utils/iconUtils";

export const IconEditor: React.FC<IconEditorProps> = ({
  icon,
  onClose,
  onUpdate,
  onError,
}) => {
  const [svg, setSvg] = useState("");
  const [className, setClassName] = useState(icon.className);
  const [displayType, setDisplayType] = useState<"svg" | "background">(
    icon.type
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !svg.trim() &&
      className === icon.className &&
      displayType === icon.type
    ) {
      onError?.("No changes detected");
      return;
    }

    if (svg.trim() && !isValidSVG(svg)) {
      onError?.("Invalid SVG data");
      return;
    }

    setIsProcessing(true);

    try {
      let optimizedSvg = icon.svgData;

      if (svg.trim()) {
        optimizedSvg = await optimizeSVG(svg);
      }

      const updatedIcon = {
        ...icon,
        className,
        type: displayType,
        svgData: optimizedSvg,
      };

      // Generate new CSS
      if (optimizedSvg) {
        const cssContent = generateCSS(className, optimizedSvg, displayType);

        // Create and trigger download of updated CSS
        const blob = new Blob([cssContent], { type: "text/css" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${className}.css`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      onUpdate(updatedIcon);
      onClose();
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : "Failed to update icon"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal-wide">
        <div className="modal-header">
          <h3 className="modal-title">Edit Icon: {icon.className}</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="svg" className="form-label">
              New SVG Data (optional)
            </label>
            <textarea
              id="svg"
              value={svg}
              onChange={(e) => setSvg(e.target.value)}
              placeholder="Paste your new SVG data here (leave empty to keep current)"
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
              value={className}
              onChange={(e) => setClassName(e.target.value)}
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
                  id="svg-option-edit"
                  name="displayType"
                  value="svg"
                  checked={displayType === "svg"}
                  onChange={() => setDisplayType("svg")}
                />
                <label htmlFor="svg-option-edit">SVG (mask-based)</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="background-option-edit"
                  name="displayType"
                  value="background"
                  checked={displayType === "background"}
                  onChange={() => setDisplayType("background")}
                />
                <label htmlFor="background-option-edit">Background Image</label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
