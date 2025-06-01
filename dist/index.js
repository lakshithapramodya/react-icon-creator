"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  IconCreator: () => IconCreator,
  IconEditor: () => IconEditor,
  IconManager: () => IconManager,
  calculateCompressionStats: () => calculateCompressionStats,
  downloadCSS: () => downloadCSS,
  ensureDirectoryExists: () => ensureDirectoryExists,
  generateCSS: () => generateCSS,
  isValidSVG: () => isValidSVG,
  optimizeSVG: () => optimizeSVG,
  saveIconToDirectory: () => saveIconToDirectory,
  saveSvgToDirectory: () => saveSvgToDirectory,
  saveToFile: () => saveToFile,
  useIconManager: () => useIconManager
});
module.exports = __toCommonJS(index_exports);

// src/components/IconCreator.tsx
var import_react = require("react");

// src/utils/iconUtils.ts
var fse = __toESM(require("fs-extra"));
var path = __toESM(require("path"));
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
var import_jsx_runtime = require("react/jsx-runtime");
var IconCreator = ({
  onIconCreated,
  onError,
  className = "",
  style = {},
  saveToDirectory = false,
  outputDirectory = "public/icons",
  onFileSaved
}) => {
  const [svg, setSvg] = (0, import_react.useState)("");
  const [iconClassName, setIconClassName] = (0, import_react.useState)("");
  const [displayType, setDisplayType] = (0, import_react.useState)("svg");
  const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `icon-creator ${className}`, style, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card-header", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { className: "card-title", children: [
      "Create Custom Icon",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m9 16 3-3 3 3" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 6v-.5a2.5 2.5 0 0 1 5 0V6" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 6v-.5a2.5 2.5 0 0 1 5 0V6" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-sm text-gray-500", children: saveToDirectory ? "SVGs are saved to directory and compressed" : "SVGs are automatically compressed" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card-content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { htmlFor: "svg", className: "form-label", children: "SVG Data" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { htmlFor: "className", className: "form-label", children: "Icon Class Name" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "form-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "form-label", children: "Display Type" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "radio-group", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "radio-option", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { htmlFor: "svg-option", children: "SVG (mask-based)" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "radio-option", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { htmlFor: "background-option", children: "Background Image" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var IconEditor = ({
  icon,
  onClose,
  onUpdate,
  onError
}) => {
  const [svg, setSvg] = (0, import_react2.useState)("");
  const [className, setClassName] = (0, import_react2.useState)(icon.className);
  const [displayType, setDisplayType] = (0, import_react2.useState)(
    icon.type
  );
  const [isProcessing, setIsProcessing] = (0, import_react2.useState)(false);
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "modal-overlay", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "modal modal-wide", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "modal-header", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("h3", { className: "modal-title", children: [
      "Edit Icon: ",
      icon.className
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "form-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { htmlFor: "svg", className: "form-label", children: "New SVG Data (optional)" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "form-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { htmlFor: "className", className: "form-label", children: "Icon Class Name" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "form-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "form-label", children: "Display Type" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "radio-group", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "radio-option", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { htmlFor: "svg-option-edit", children: "SVG (mask-based)" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "radio-option", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { htmlFor: "background-option-edit", children: "Background Image" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "modal-footer", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            className: "btn btn-outline",
            onClick: onClose,
            disabled: isProcessing,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
var import_react3 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var IconManager = ({
  icons = [],
  onIconEdit,
  onIconCopy,
  onIconDelete,
  className = "",
  style = {}
}) => {
  const [editingIcon, setEditingIcon] = (0, import_react3.useState)(null);
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: `icon-manager ${className}`, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "card-header", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { className: "card-title", children: "Icon Library" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "card-content", children: icons.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "empty-state", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "text-gray-500", children: "No icons created yet. Use the Icon Creator to add some icons." }) }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "icon-grid", children: icons.map((icon, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "icon-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "icon-preview", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "i",
          {
            className: `${icon.className} ${icon.type === "svg" ? "text-black" : ""}`,
            style: { width: "48px", height: "48px" }
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "icon-type-badge", children: icon.type }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "icon-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            "button",
            {
              onClick: () => copyToClipboard(icon),
              className: "icon-button",
              title: `Copy ${icon.className} to clipboard`,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: icon.className }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
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
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              onClick: () => handleEditIcon(icon),
              className: "icon-button edit-button",
              title: `Edit ${icon.className}`,
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
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
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              onClick: () => handleDeleteIcon(icon),
              className: "icon-button delete-button",
              title: `Delete ${icon.className}`,
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
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
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("polyline", { points: "3,6 5,6 21,6" }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" })
                  ]
                }
              )
            }
          )
        ] })
      ] }, `${icon.className}-${index}`)) }) })
    ] }),
    editingIcon && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
var import_react4 = require("react");
var useIconManager = (initialIcons = []) => {
  const [icons, setIcons] = (0, import_react4.useState)(initialIcons);
  const addIcon = (0, import_react4.useCallback)((icon) => {
    setIcons((prev) => [...prev, icon]);
  }, []);
  const updateIcon = (0, import_react4.useCallback)((updatedIcon) => {
    setIcons(
      (prev) => prev.map(
        (icon) => icon.className === updatedIcon.className ? updatedIcon : icon
      )
    );
  }, []);
  const removeIcon = (0, import_react4.useCallback)((className) => {
    setIcons((prev) => prev.filter((icon) => icon.className !== className));
  }, []);
  const getIcon = (0, import_react4.useCallback)(
    (className) => {
      return icons.find((icon) => icon.className === className);
    },
    [icons]
  );
  const clearIcons = (0, import_react4.useCallback)(() => {
    setIcons([]);
  }, []);
  const exportIcons = (0, import_react4.useCallback)(() => {
    return JSON.stringify(icons, null, 2);
  }, [icons]);
  const importIcons = (0, import_react4.useCallback)((jsonData) => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
