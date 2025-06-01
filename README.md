# React Icon Creator

A React component library for creating and managing SVG icons with automatic CSS generation and optimization.

## Features

- 🎨 **Icon Creator**: Convert SVG files to optimized CSS icons
- 📝 **Icon Manager**: Manage and organize your icon library
- ✏️ **Icon Editor**: Edit existing icons with real-time preview
- 🗜️ **SVG Optimization**: Automatic compression using SVGO
- 🎯 **Two Display Types**: SVG mask-based icons and background images
- 📱 **Responsive Design**: Mobile-friendly interface
- 🎛️ **Custom Hooks**: Easy state management with `useIconManager`
- 📦 **TypeScript Support**: Full type definitions included

## Installation

```bash
npm install react-icon-creator
```

## Quick Start

```jsx
import React from 'react';
import { IconCreator, IconManager, useIconManager } from 'react-icon-creator';

function App() {
  const { icons, addIcon, updateIcon, removeIcon } = useIconManager();

  const handleIconCreated = (icon) => {
    addIcon(icon);
    console.log('Icon created:', icon);
  };

  return (
    <div>
      <IconCreator 
        onIconCreated={handleIconCreated}
        onError={(error) => console.error(error)}
      />
      
      <IconManager 
        icons={icons}
        onIconEdit={(icon) => console.log('Editing:', icon)}
        onIconCopy={(icon) => console.log('Copied:', icon)}
        onIconDelete={(icon) => removeIcon(icon.className)}
      />
    </div>
  );
}

export default App;
```

## Components

### IconCreator

The main component for creating new icons from SVG data.

```jsx
import { IconCreator } from 'react-icon-creator';

<IconCreator 
  onIconCreated={(icon) => console.log('New icon:', icon)}
  onError={(error) => console.error(error)}
  className="my-icon-creator"
  style={{ maxWidth: '800px' }}
/>
```

**Props:**
- `onIconCreated?`: Callback when an icon is successfully created
- `onError?`: Callback for error handling
- `className?`: Additional CSS class name
- `style?`: Inline styles

### IconManager

Component for displaying and managing a collection of icons.

```jsx
import { IconManager } from 'react-icon-creator';

<IconManager 
  icons={myIcons}
  onIconEdit={(icon) => setEditingIcon(icon)}
  onIconCopy={(icon) => console.log('Copied to clipboard')}
  onIconDelete={(icon) => removeIcon(icon.className)}
/>
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
import { IconEditor } from 'react-icon-creator';

{editingIcon && (
  <IconEditor 
    icon={editingIcon}
    onClose={() => setEditingIcon(null)}
    onUpdate={(updatedIcon) => updateIcon(updatedIcon)}
    onError={(error) => console.error(error)}
  />
)}
```

## Hooks

### useIconManager

Custom hook for managing icon state and operations.

```jsx
import { useIconManager } from 'react-icon-creator';

const {
  icons,           // Current icons array
  addIcon,         // Add a new icon
  updateIcon,      // Update an existing icon
  removeIcon,      // Remove an icon by className
  getIcon,         // Get an icon by className
  clearIcons,      // Clear all icons
  exportIcons,     // Export icons as JSON
  importIcons,     // Import icons from JSON
  iconCount        // Number of icons
} = useIconManager(initialIcons);
```

## Utility Functions

### optimizeSVG

Optimize SVG content using SVGO.

```jsx
import { optimizeSVG } from 'react-icon-creator';

const optimized = await optimizeSVG(svgString, {
  compressionLevel: 1,
  removeViewBox: false,
  removeDimensions: true
});
```

### generateCSS

Generate CSS from optimized SVG.

```jsx
import { generateCSS } from 'react-icon-creator';

const css = generateCSS('my-icon', optimizedSvg, 'svg');
```

### isValidSVG

Validate SVG content.

```jsx
import { isValidSVG } from 'react-icon-creator';

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

### 1.0.0
- Initial release
- IconCreator, IconManager, and IconEditor components
- useIconManager hook
- SVG optimization with SVGO
- TypeScript support