// src/components/IconCreator.tsx
import { useState } from "react";

// src/utils/iconUtils.ts
import * as fse from "fs-extra";
import * as path from "path";
var isValidSVG = (svgString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const errorElement = doc.querySelector("parsererror");
  return !errorElement;
};
var optimizeSVG = async (svg, config = {}) => {
  return svg;
};
var generateCSS = (className, optimizedSvg, displayType) => {
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
var downloadCSS = (cssContent, fileName) => {
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
var calculateCompressionStats = (originalSvg, optimizedSvg) => {
  const originalSize = new TextEncoder().encode(originalSvg).length;
  const optimizedSize = new TextEncoder().encode(optimizedSvg).length;
  const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
  return {
    originalSize,
    optimizedSize,
    savings: `${savings}%`
  };
};
var ensureDirectoryExists = (directory) => {
  try {
    fse.ensureDirSync(directory);
  } catch (error) {
    throw new Error(
      `Failed to create directory: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
var saveToFile = async (directory, filename, content, options = {}) => {
  try {
    ensureDirectoryExists(directory);
    const filePath = path.join(directory, filename);
    const fileExt = path.extname(filename).slice(1);
    const className = path.basename(filename, path.extname(filename));
    await fse.writeFile(filePath, content, {
      encoding: options.encoding || "utf8",
      flag: options.flag || "w",
      mode: options.mode || 438
    });
    return {
      success: true,
      message: `File saved successfully at ${filePath}`,
      filePath,
      className,
      fileType: fileExt
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to save file: ${error instanceof Error ? error.message : String(error)}`,
      className: path.basename(filename, path.extname(filename)),
      fileType: path.extname(filename).slice(1)
    };
  }
};
var saveIconToDirectory = async (directory, className, cssContent) => {
  const filename = `${className}.css`;
  return saveToFile(directory, filename, cssContent);
};
var saveSvgToDirectory = async (directory, iconName, svgContent) => {
  const filename = `${iconName}.svg`;
  return saveToFile(directory, filename, svgContent);
};

// src/components/IconCreator.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var IconCreator = ({
  onIconCreated,
  onError,
  className = "",
  style = {},
  saveToDirectory = false,
  outputDirectory = "public/icons",
  onFileSaved
}) => {
  const [svg, setSvg] = useState("");
  const [iconClassName, setIconClassName] = useState("");
  const [displayType, setDisplayType] = useState("svg");
  const [isProcessing, setIsProcessing] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!svg.trim()) {
      onError == null ? void 0 : onError("SVG data is required");
      return;
    }
    if (!iconClassName.trim()) {
      onError == null ? void 0 : onError("Icon class name is required");
      return;
    }
    if (!isValidSVG(svg)) {
      onError == null ? void 0 : onError("Invalid SVG data");
      return;
    }
    setIsProcessing(true);
    try {
      const optimizedSvg = await optimizeSVG(svg);
      const cssContent = generateCSS(iconClassName, optimizedSvg, displayType);
      const iconData = {
        className: iconClassName,
        type: displayType,
        file: saveToDirectory ? `${outputDirectory}/${iconClassName}.css` : "generated",
        svgData: optimizedSvg
      };
      if (saveToDirectory) {
        const cssSaveResult = await saveIconToDirectory(
          outputDirectory,
          iconClassName,
          cssContent
        );
        const svgSaveResult = await saveSvgToDirectory(
          outputDirectory,
          iconClassName,
          optimizedSvg
        );
        if (cssSaveResult.success) {
          onFileSaved == null ? void 0 : onFileSaved(cssSaveResult);
          onIconCreated == null ? void 0 : onIconCreated(iconData);
        } else {
          onError == null ? void 0 : onError(cssSaveResult.message);
        }
      } else {
        downloadCSS(cssContent, `${iconClassName}.css`);
        onIconCreated == null ? void 0 : onIconCreated(iconData);
      }
      setSvg("");
      setIconClassName("");
      setDisplayType("svg");
    } catch (error) {
      onError == null ? void 0 : onError(
        error instanceof Error ? error.message : "Failed to process icon"
      );
    } finally {
      setIsProcessing(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: `icon-creator ${className}`, style, children: /* @__PURE__ */ jsxs("div", { className: "card", children: [
    /* @__PURE__ */ jsx("div", { className: "card-header", children: /* @__PURE__ */ jsxs("h2", { className: "card-title", children: [
      "Create Custom Icon",
      /* @__PURE__ */ jsxs(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: "16",
          height: "16",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: "text-gray-500",
          children: [
            /* @__PURE__ */ jsx("path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" }),
            /* @__PURE__ */ jsx("path", { d: "m9 16 3-3 3 3" }),
            /* @__PURE__ */ jsx("path", { d: "M5 6v-.5a2.5 2.5 0 0 1 5 0V6" }),
            /* @__PURE__ */ jsx("path", { d: "M14 6v-.5a2.5 2.5 0 0 1 5 0V6" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: saveToDirectory ? "SVGs are saved to directory and compressed" : "SVGs are automatically compressed" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "card-content", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "svg", className: "form-label", children: "SVG Data" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            id: "svg",
            value: svg,
            onChange: (e) => setSvg(e.target.value),
            placeholder: "Paste your SVG data here",
            required: true,
            className: "form-textarea"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "className", className: "form-label", children: "Icon Class Name" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            id: "className",
            value: iconClassName,
            onChange: (e) => setIconClassName(e.target.value),
            placeholder: "e.g., my-custom-icon",
            required: true,
            className: "form-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", children: "Display Type" }),
        /* @__PURE__ */ jsxs("div", { className: "radio-group", children: [
          /* @__PURE__ */ jsxs("div", { className: "radio-option", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                id: "svg-option",
                name: "displayType",
                value: "svg",
                checked: displayType === "svg",
                onChange: () => setDisplayType("svg")
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "svg-option", children: "SVG (mask-based)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "radio-option", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                id: "background-option",
                name: "displayType",
                value: "background",
                checked: displayType === "background",
                onChange: () => setDisplayType("background")
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "background-option", children: "Background Image" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "btn btn-primary",
          disabled: isProcessing,
          children: isProcessing ? "Processing..." : saveToDirectory ? `Create Icon & Save to ${outputDirectory}` : "Create Icon & Download CSS"
        }
      )
    ] }) })
  ] }) });
};

// src/components/IconEditor.tsx
import { useState as useState2 } from "react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var IconEditor = ({
  icon,
  onClose,
  onUpdate,
  onError
}) => {
  const [svg, setSvg] = useState2("");
  const [className, setClassName] = useState2(icon.className);
  const [displayType, setDisplayType] = useState2(
    icon.type
  );
  const [isProcessing, setIsProcessing] = useState2(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!svg.trim() && className === icon.className && displayType === icon.type) {
      onError == null ? void 0 : onError("No changes detected");
      return;
    }
    if (svg.trim() && !isValidSVG(svg)) {
      onError == null ? void 0 : onError("Invalid SVG data");
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
        svgData: optimizedSvg
      };
      if (optimizedSvg) {
        const cssContent = generateCSS(className, optimizedSvg, displayType);
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
      onError == null ? void 0 : onError(
        error instanceof Error ? error.message : "Failed to update icon"
      );
    } finally {
      setIsProcessing(false);
    }
  };
  return /* @__PURE__ */ jsx2("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxs2("div", { className: "modal modal-wide", children: [
    /* @__PURE__ */ jsx2("div", { className: "modal-header", children: /* @__PURE__ */ jsxs2("h3", { className: "modal-title", children: [
      "Edit Icon: ",
      icon.className
    ] }) }),
    /* @__PURE__ */ jsxs2("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs2("div", { className: "form-group", children: [
        /* @__PURE__ */ jsx2("label", { htmlFor: "svg", className: "form-label", children: "New SVG Data (optional)" }),
        /* @__PURE__ */ jsx2(
          "textarea",
          {
            id: "svg",
            value: svg,
            onChange: (e) => setSvg(e.target.value),
            placeholder: "Paste your new SVG data here (leave empty to keep current)",
            className: "form-textarea"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "form-group", children: [
        /* @__PURE__ */ jsx2("label", { htmlFor: "className", className: "form-label", children: "Icon Class Name" }),
        /* @__PURE__ */ jsx2(
          "input",
          {
            type: "text",
            id: "className",
            value: className,
            onChange: (e) => setClassName(e.target.value),
            placeholder: "e.g., my-custom-icon",
            required: true,
            className: "form-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "form-group", children: [
        /* @__PURE__ */ jsx2("label", { className: "form-label", children: "Display Type" }),
        /* @__PURE__ */ jsxs2("div", { className: "radio-group", children: [
          /* @__PURE__ */ jsxs2("div", { className: "radio-option", children: [
            /* @__PURE__ */ jsx2(
              "input",
              {
                type: "radio",
                id: "svg-option-edit",
                name: "displayType",
                value: "svg",
                checked: displayType === "svg",
                onChange: () => setDisplayType("svg")
              }
            ),
            /* @__PURE__ */ jsx2("label", { htmlFor: "svg-option-edit", children: "SVG (mask-based)" })
          ] }),
          /* @__PURE__ */ jsxs2("div", { className: "radio-option", children: [
            /* @__PURE__ */ jsx2(
              "input",
              {
                type: "radio",
                id: "background-option-edit",
                name: "displayType",
                value: "background",
                checked: displayType === "background",
                onChange: () => setDisplayType("background")
              }
            ),
            /* @__PURE__ */ jsx2("label", { htmlFor: "background-option-edit", children: "Background Image" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "modal-footer", children: [
        /* @__PURE__ */ jsx2(
          "button",
          {
            type: "button",
            className: "btn btn-outline",
            onClick: onClose,
            disabled: isProcessing,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx2(
          "button",
          {
            type: "submit",
            className: "btn btn-primary",
            disabled: isProcessing,
            children: isProcessing ? "Processing..." : "Save Changes"
          }
        )
      ] })
    ] })
  ] }) });
};

// src/components/IconManager.tsx
import { useState as useState3 } from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var IconManager = ({
  icons = [],
  onIconEdit,
  onIconCopy,
  onIconDelete,
  className = "",
  style = {}
}) => {
  const [editingIcon, setEditingIcon] = useState3(null);
  const handleEditIcon = (icon) => {
    setEditingIcon(icon);
    onIconEdit == null ? void 0 : onIconEdit(icon);
  };
  const handleUpdateIcon = (updatedIcon) => {
    setEditingIcon(null);
  };
  const copyToClipboard = (icon) => {
    const textToCopy = icon.type === "svg" ? `<i className="${icon.className}" style="width: 24px; height: 24px;" />` : `<i className="${icon.className}" style="width: 24px; height: 24px;" />`;
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        onIconCopy == null ? void 0 : onIconCopy(icon);
      },
      () => {
        console.error("Failed to copy to clipboard");
      }
    );
  };
  const handleDeleteIcon = (icon) => {
    if (window.confirm(
      `Are you sure you want to delete the icon "${icon.className}"?`
    )) {
      onIconDelete == null ? void 0 : onIconDelete(icon);
    }
  };
  return /* @__PURE__ */ jsxs3("div", { className: `icon-manager ${className}`, style, children: [
    /* @__PURE__ */ jsxs3("div", { className: "card", children: [
      /* @__PURE__ */ jsx3("div", { className: "card-header", children: /* @__PURE__ */ jsx3("h2", { className: "card-title", children: "Icon Library" }) }),
      /* @__PURE__ */ jsx3("div", { className: "card-content", children: icons.length === 0 ? /* @__PURE__ */ jsx3("div", { className: "empty-state", children: /* @__PURE__ */ jsx3("p", { className: "text-gray-500", children: "No icons created yet. Use the Icon Creator to add some icons." }) }) : /* @__PURE__ */ jsx3("div", { className: "icon-grid", children: icons.map((icon, index) => /* @__PURE__ */ jsxs3("div", { className: "icon-card", children: [
        /* @__PURE__ */ jsx3("div", { className: "icon-preview", children: /* @__PURE__ */ jsx3(
          "i",
          {
            className: `${icon.className} ${icon.type === "svg" ? "text-black" : ""}`,
            style: { width: "48px", height: "48px" }
          }
        ) }),
        /* @__PURE__ */ jsx3("span", { className: "icon-type-badge", children: icon.type }),
        /* @__PURE__ */ jsxs3("div", { className: "icon-actions", children: [
          /* @__PURE__ */ jsxs3(
            "button",
            {
              onClick: () => copyToClipboard(icon),
              className: "icon-button",
              title: `Copy ${icon.className} to clipboard`,
              children: [
                /* @__PURE__ */ jsx3("span", { children: icon.className }),
                /* @__PURE__ */ jsxs3(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "14",
                    height: "14",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: [
                      /* @__PURE__ */ jsx3(
                        "rect",
                        {
                          x: "9",
                          y: "9",
                          width: "13",
                          height: "13",
                          rx: "2",
                          ry: "2"
                        }
                      ),
                      /* @__PURE__ */ jsx3("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx3(
            "button",
            {
              onClick: () => handleEditIcon(icon),
              className: "icon-button edit-button",
              title: `Edit ${icon.className}`,
              children: /* @__PURE__ */ jsxs3(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ jsx3("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                    /* @__PURE__ */ jsx3("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsx3(
            "button",
            {
              onClick: () => handleDeleteIcon(icon),
              className: "icon-button delete-button",
              title: `Delete ${icon.className}`,
              children: /* @__PURE__ */ jsxs3(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ jsx3("polyline", { points: "3,6 5,6 21,6" }),
                    /* @__PURE__ */ jsx3("path", { d: "m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" })
                  ]
                }
              )
            }
          )
        ] })
      ] }, `${icon.className}-${index}`)) }) })
    ] }),
    editingIcon && /* @__PURE__ */ jsx3(
      IconEditor,
      {
        icon: editingIcon,
        onClose: () => setEditingIcon(null),
        onUpdate: handleUpdateIcon,
        onError: (error) => console.error("Icon update error:", error)
      }
    )
  ] });
};

// src/hooks/useIconManager.ts
import { useState as useState4, useCallback } from "react";
var useIconManager = (initialIcons = []) => {
  const [icons, setIcons] = useState4(initialIcons);
  const addIcon = useCallback((icon) => {
    setIcons((prev) => [...prev, icon]);
  }, []);
  const updateIcon = useCallback((updatedIcon) => {
    setIcons(
      (prev) => prev.map(
        (icon) => icon.className === updatedIcon.className ? updatedIcon : icon
      )
    );
  }, []);
  const removeIcon = useCallback((className) => {
    setIcons((prev) => prev.filter((icon) => icon.className !== className));
  }, []);
  const getIcon = useCallback(
    (className) => {
      return icons.find((icon) => icon.className === className);
    },
    [icons]
  );
  const clearIcons = useCallback(() => {
    setIcons([]);
  }, []);
  const exportIcons = useCallback(() => {
    return JSON.stringify(icons, null, 2);
  }, [icons]);
  const importIcons = useCallback((jsonData) => {
    try {
      const parsedIcons = JSON.parse(jsonData);
      setIcons(parsedIcons);
      return true;
    } catch (error) {
      console.error("Failed to import icons:", error);
      return false;
    }
  }, []);
  return {
    icons,
    addIcon,
    updateIcon,
    removeIcon,
    getIcon,
    clearIcons,
    exportIcons,
    importIcons,
    iconCount: icons.length
  };
};
export {
  IconCreator,
  IconEditor,
  IconManager,
  calculateCompressionStats,
  downloadCSS,
  ensureDirectoryExists,
  generateCSS,
  isValidSVG,
  optimizeSVG,
  saveIconToDirectory,
  saveSvgToDirectory,
  saveToFile,
  useIconManager
};
