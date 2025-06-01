import React$1 from 'react';

interface IconData {
    className: string;
    type: "svg" | "background";
    file: string;
    svgData?: string;
}
interface IconCreatorProps {
    onIconCreated?: (icon: IconData) => void;
    onError?: (error: string) => void;
    className?: string;
    style?: React.CSSProperties;
    saveToDirectory?: boolean;
    outputDirectory?: string;
    onFileSaved?: (result: FileSaveResult) => void;
}
interface IconEditorProps {
    icon: IconData;
    onClose: () => void;
    onUpdate: (updatedIcon: IconData) => void;
    onError?: (error: string) => void;
}
interface IconManagerProps {
    icons?: IconData[];
    onIconEdit?: (icon: IconData) => void;
    onIconCopy?: (icon: IconData) => void;
    onIconDelete?: (icon: IconData) => void;
    className?: string;
    style?: React.CSSProperties;
}
interface IconUtilsConfig {
    compressionLevel?: number;
    removeViewBox?: boolean;
    removeDimensions?: boolean;
}
interface SaveIconResult {
    success: boolean;
    message: string;
    originalSize?: number;
    optimizedSize?: number;
}
interface FileSaveResult {
    success: boolean;
    message: string;
    filePath?: string;
    className: string;
    fileType: "css" | "svg";
}
interface FileSystemOptions {
    encoding?: string;
    flag?: string;
    mode?: number;
}

declare const IconCreator: React$1.FC<IconCreatorProps>;

declare const IconEditor: React$1.FC<IconEditorProps>;

declare const IconManager: React$1.FC<IconManagerProps>;

declare const useIconManager: (initialIcons?: IconData[]) => {
    icons: IconData[];
    addIcon: (icon: IconData) => void;
    updateIcon: (updatedIcon: IconData) => void;
    removeIcon: (className: string) => void;
    getIcon: (className: string) => IconData | undefined;
    clearIcons: () => void;
    exportIcons: () => string;
    importIcons: (jsonData: string) => boolean;
    iconCount: number;
};

declare const isValidSVG: (svgString: string) => boolean;
declare const optimizeSVG: (svg: string, config?: IconUtilsConfig) => Promise<string>;
declare const generateCSS: (className: string, optimizedSvg: string, displayType: "svg" | "background") => string;
declare const downloadCSS: (cssContent: string, fileName: string) => void;
declare const calculateCompressionStats: (originalSvg: string, optimizedSvg: string) => {
    originalSize: number;
    optimizedSize: number;
    savings: string;
};
/**
 * Ensures a directory exists, creating it if necessary
 * @param directory - Path to the directory
 */
declare const ensureDirectoryExists: (directory: string) => void;
/**
 * Saves content to a file in the specified directory
 * @param directory - Directory to save the file in
 * @param filename - Name of the file
 * @param content - Content to save
 * @param options - File system options
 * @returns Promise resolving to a FileSaveResult object
 */
declare const saveToFile: (directory: string, filename: string, content: string, options?: FileSystemOptions) => Promise<FileSaveResult>;
/**
 * Saves an icon as CSS to the specified directory
 * @param directory - Directory to save the file in
 * @param className - CSS class name for the icon
 * @param cssContent - CSS content to save
 * @returns Promise resolving to a FileSaveResult object
 */
declare const saveIconToDirectory: (directory: string, className: string, cssContent: string) => Promise<FileSaveResult>;
/**
 * Saves an SVG file to the specified directory
 * @param directory - Directory to save the file in
 * @param iconName - Name for the icon
 * @param svgContent - SVG content to save
 * @returns Promise resolving to a FileSaveResult object
 */
declare const saveSvgToDirectory: (directory: string, iconName: string, svgContent: string) => Promise<FileSaveResult>;

export { type FileSaveResult, type FileSystemOptions, IconCreator, type IconCreatorProps, type IconData, IconEditor, type IconEditorProps, IconManager, type IconManagerProps, type IconUtilsConfig, type SaveIconResult, calculateCompressionStats, downloadCSS, ensureDirectoryExists, generateCSS, isValidSVG, optimizeSVG, saveIconToDirectory, saveSvgToDirectory, saveToFile, useIconManager };
