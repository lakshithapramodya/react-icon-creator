# React Icon Creator

A React component library for creating and managing SVG icons with automatic CSS generation and optimization.

## Features

- 🎨 **Icon Creator**: Convert SVG files to optimized CSS icons
- 📝 **Icon Manager**: Manage and organize your icon library
- ✏️ **Icon Editor**: Edit existing icons with real-time preview
- 🗜️ **SVG Optimization**: Automatic compression using SVGO
- 🎯 **Two Display Types**: SVG mask-based icons and background images
- 📁 **File System Support**: Save icons directly to your project's public folder
- 📱 **Responsive Design**: Mobile-friendly interface
- 🎛️ **Custom Hooks**: Easy state management with `useIconManager`
- 📦 **TypeScript Support**: Full type definitions included

## Installation

```bash
npm install react-icon-creator
```

## Quick Start

```jsx
import React from "react";
import { IconCreator, IconManager, useIconManager } from "react-icon-creator";

function App() {
  const { icons, addIcon, updateIcon, removeIcon } = useIconManager();

  const handleIconCreated = (icon) => {
    addIcon(icon);
    console.log("Icon created:", icon);
  };

  return (
    <div>
      <IconCreator
        onIconCreated={handleIconCreated}
        onError={(error) => console.error(error)}
      />

      <IconManager
        icons={icons}
        onIconEdit={(icon) => console.log("Editing:", icon)}
        onIconCopy={(icon) => console.log("Copied:", icon)}
        onIconDelete={(icon) => removeIcon(icon.className)}
      />
    </div>
  );
}

export default App;
```

## Environment Support

This package supports both Node.js and browser environments:

- In browsers (including CodeSandbox, Stackblitz, etc.), file system operations are automatically disabled and the package falls back to downloading icons.
- In Node.js environments (like Next.js server components or Node.js scripts), the package can save files directly to the file system.

The package automatically detects the environment and adjusts its behavior accordingly. You don't need to change your code when moving between environments.

```jsx
// This code works in both browser and Node.js environments
<IconCreator
  saveToDirectory={true} // Will be ignored in browsers and enabled in Node.js
  outputDirectory="public/icons"
  onIconCreated={(icon) => console.log("Icon created:", icon)}
  onFileSaved={(result) => console.log(`File saved: ${result.filePath}`)}
/>
```

## Components

### IconCreator

The main component for creating new icons from SVG data.

```jsx
import { IconCreator } from 'react-icon-creator';

// Default behavior - download icons
<IconCreator
  onIconCreated={(icon) => console.log('New icon:', icon)}
  onError={(error) => console.error(error)}
  className="my-icon-creator"
  style={{ maxWidth: '800px' }}
/>

// Save directly to public folder instead of downloading
<IconCreator
  saveToDirectory={true}
  outputDirectory="public/assets/icons"
  onIconCreated={(icon) => console.log('New icon:', icon)}
  onFileSaved={(result) => {
    if (result.success) {
      console.log(`File saved at: ${result.filePath}`);
    } else {
      console.error(`Error: ${result.message}`);
    }
  }}
  onError={(error) => console.error(error)}
/>
```

**Props:**

- `onIconCreated?`: Callback when an icon is successfully created
- `onError?`: Callback for error handling
- `className?`: Additional CSS class name
- `style?`: Inline styles
- `saveToDirectory?`: Whether to save files to directory instead of downloading (default: false)
- `outputDirectory?`: Directory path where files will be saved (default: "public/icons")
- `onFileSaved?`: Callback when a file is saved to directory

### IconManager

Component for displaying and managing a collection of icons.

```jsx
import { IconManager } from "react-icon-creator";

<IconManager
  icons={myIcons}
  onIconEdit={(icon) => setEditingIcon(icon)}
  onIconCopy={(icon) => console.log("Copied to clipboard")}
  onIconDelete={(icon) => removeIcon(icon.className)}
/>;
```

**Props:**

- `icons?`: Array of IconData objects
- `onIconEdit?`: Callback when editing an icon
- `onIconCopy?`: Callback when copying an icon
- `onIconDelete?`: Callback when deleting an icon
- `className?`: Additional CSS class name
- `style?`: Inline styles

### IconEditor

Modal component for editing existing icons.

```jsx
import { IconEditor } from "react-icon-creator";

{
  editingIcon && (
    <IconEditor
      icon={editingIcon}
      onClose={() => setEditingIcon(null)}
      onUpdate={(updatedIcon) => updateIcon(updatedIcon)}
      onError={(error) => console.error(error)}
    />
  );
}
```

## Hooks

### useIconManager

Custom hook for managing icon state and operations.

```jsx
import { useIconManager } from "react-icon-creator";

const {
  icons, // Current icons array
  addIcon, // Add a new icon
  updateIcon, // Update an existing icon
  removeIcon, // Remove an icon by className
  getIcon, // Get an icon by className
  clearIcons, // Clear all icons
  exportIcons, // Export icons as JSON
  importIcons, // Import icons from JSON
  iconCount, // Number of icons
} = useIconManager(initialIcons);
```

## Environment Utilities

The package includes utilities to detect the current environment:

```jsx
import { isBrowser, isNode, supportsFileSystem } from "react-icon-creator";

// Check if running in a browser
if (isBrowser()) {
  console.log("Running in a browser environment");
}

// Check if running in Node.js
if (isNode()) {
  console.log("Running in a Node.js environment");
}

// Check if file system operations are supported
if (supportsFileSystem()) {
  console.log("File system operations are supported");
} else {
  console.log("File system operations are not supported");
}
```

## Utility Functions

### optimizeSVG

Optimize SVG content using SVGO.

```jsx
import { optimizeSVG } from "react-icon-creator";

const optimized = await optimizeSVG(svgString, {
  compressionLevel: 1,
  removeViewBox: false,
  removeDimensions: true,
});
```

### generateCSS

Generate CSS from optimized SVG.

```jsx
import { generateCSS } from "react-icon-creator";

const css = generateCSS("my-icon", optimizedSvg, "svg");
```

### saveIconToDirectory

Save an icon CSS file directly to a directory.

```jsx
import { saveIconToDirectory } from "react-icon-creator";

const result = await saveIconToDirectory(
  "public/icons",
  "my-custom-icon",
  cssContent
);
if (result.success) {
  console.log(`Icon CSS saved at: ${result.filePath}`);
}
```

### saveSvgToDirectory

Save an SVG file directly to a directory.

```jsx
import { saveSvgToDirectory } from "react-icon-creator";

const result = await saveSvgToDirectory(
  "public/icons",
  "my-custom-icon",
  svgContent
);
if (result.success) {
  console.log(`SVG saved at: ${result.filePath}`);
}
```

### isValidSVG

Validate SVG content.

```jsx
import { isValidSVG } from "react-icon-creator";

if (isValidSVG(svgString)) {
  // Process the SVG
}
```

## Types

```typescript
interface IconData {
  className: string;
  type: "svg" | "background";
  file: string;
  svgData?: string;
}

interface IconUtilsConfig {
  compressionLevel?: number;
  removeViewBox?: boolean;
  removeDimensions?: boolean;
}

interface FileSaveResult {
  success: boolean;
  message: string;
  filePath?: string;
  className: string;
  fileType: "css" | "svg";
}
```

## Styling

The package includes default styles, but you can customize them by overriding the CSS classes:

```css
.icon-creator {
  /* Customize the icon creator container */
}

.icon-manager {
  /* Customize the icon manager container */
}

.icon-card {
  /* Customize individual icon cards */
}
```

## Display Types

### SVG (Mask-based)

Creates icons using CSS masks, allowing for color customization via the `color` property.

```css
.my-icon {
  --svg: url("data:image/svg+xml,...");
  display: inline-block;
  background-color: currentColor;
  mask-image: var(--svg);
  mask-size: 100% 100%;
}
```

### Background Image

Creates icons as background images with fixed colors from the original SVG.

```css
.my-icon {
  background-image: url("data:image/svg+xml,...");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
```

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### 1.1.1

- Improved browser compatibility for CodeSandbox and other browser environments
- Added automatic environment detection to gracefully handle file system operations
- Fixed "process.emitWarning is not a function" error in browser environments

### 1.1.0

- Added support for saving icons directly to a project's public folder
- Added file system utilities: saveIconToDirectory, saveSvgToDirectory
- Added new props to IconCreator: saveToDirectory, outputDirectory, onFileSaved

### 1.0.0

- Initial release
- IconCreator, IconManager, and IconEditor components
- useIconManager hook
- SVG optimization with SVGO
- TypeScript support

## Usage Examples

### Saving Icons to Public Folder in Next.js

Here's an example of integrating the icon creator to save files directly to your Next.js project's public folder:

```jsx
// pages/admin/icon-manager.js
import React, { useState } from "react";
import { IconCreator, IconManager, useIconManager } from "react-icon-creator";

export default function IconManagerPage() {
  const { icons, addIcon, removeIcon } = useIconManager();
  const [saveResult, setSaveResult] = useState(null);

  const handleIconCreated = (icon) => {
    addIcon(icon);
  };

  const handleFileSaved = (result) => {
    setSaveResult(result);
    setTimeout(() => setSaveResult(null), 3000); // Clear notification after 3 seconds
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Icon Manager</h1>

      {saveResult && (
        <div
          className={`p-4 mb-4 rounded ${
            saveResult.success
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {saveResult.message}
        </div>
      )}

      <IconCreator
        saveToDirectory={true}
        outputDirectory="public/assets/icons" // Files will be saved here
        onIconCreated={handleIconCreated}
        onFileSaved={handleFileSaved}
        onError={(error) => console.error(error)}
      />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Icons</h2>
        <IconManager
          icons={icons}
          onIconDelete={(icon) => removeIcon(icon.className)}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Usage</h2>
        <p>
          Add the generated CSS to your global styles or import individually.
        </p>
        <p className="text-sm mt-2">
          Path to CSS: <code>/assets/icons/[icon-name].css</code>
        </p>
      </div>
    </div>
  );
}
```

### Using in Node.js Script

You can also use the file saving utilities in a Node.js script:

```js
// scripts/generate-icons.js
const {
  optimizeSVG,
  generateCSS,
  saveIconToDirectory,
} = require("react-icon-creator");
const fs = require("fs");
const path = require("path");

async function generateIcons() {
  const sourceDir = path.join(__dirname, "../svg-sources");
  const outputDir = path.join(__dirname, "../public/icons");

  // Read source SVG files
  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".svg"));

  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    const svgContent = fs.readFileSync(filePath, "utf8");
    const iconName = path.basename(file, ".svg");

    try {
      // Optimize the SVG
      const optimizedSvg = await optimizeSVG(svgContent);

      // Generate CSS (using SVG mask type)
      const cssContent = generateCSS(iconName, optimizedSvg, "svg");

      // Save to public folder
      const result = await saveIconToDirectory(outputDir, iconName, cssContent);

      console.log(
        `Processed ${file}: ${result.success ? "Success" : "Failed"}`
      );
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
}

generateIcons().catch(console.error);
```

## Browser vs Node.js Usage

This package supports two environments:

1. **Browser Environment**: When used in a browser, the default behavior is to generate and download icon files.
2. **Node.js Environment**: When used in Node.js, you can save files directly to the file system.

To use Node.js file system capabilities, make sure to set `saveToDirectory` to `true` when using the `IconCreator` component on the server side or in a build script.
