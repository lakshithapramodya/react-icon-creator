// Components
export { IconCreator } from "./components/IconCreator";
export { IconEditor } from "./components/IconEditor";
export { IconManager } from "./components/IconManager";

// Hooks
export { useIconManager } from "./hooks/useIconManager";

// Utils
export {
  optimizeSVG,
  generateCSS,
  downloadCSS,
  isValidSVG,
  calculateCompressionStats,
  // New file saving utilities
  ensureDirectoryExists,
  saveToFile,
  saveIconToDirectory,
  saveSvgToDirectory,
} from "./utils/iconUtils";

// Types
export type {
  IconData,
  IconCreatorProps,
  IconEditorProps,
  IconManagerProps,
  IconUtilsConfig,
  SaveIconResult,
  // New types for file saving
  FileSaveResult,
  FileSystemOptions,
} from "./types";
