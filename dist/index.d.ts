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

export { IconCreator, type IconCreatorProps, type IconData, IconEditor, type IconEditorProps, IconManager, type IconManagerProps, type IconUtilsConfig, type SaveIconResult, calculateCompressionStats, downloadCSS, generateCSS, isValidSVG, optimizeSVG, useIconManager };
