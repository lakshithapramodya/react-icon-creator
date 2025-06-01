export interface IconData {
  className: string;
  type: "svg" | "background";
  file: string;
  svgData?: string;
}

export interface IconCreatorProps {
  onIconCreated?: (icon: IconData) => void;
  onError?: (error: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface IconEditorProps {
  icon: IconData;
  onClose: () => void;
  onUpdate: (updatedIcon: IconData) => void;
  onError?: (error: string) => void;
}

export interface IconManagerProps {
  icons?: IconData[];
  onIconEdit?: (icon: IconData) => void;
  onIconCopy?: (icon: IconData) => void;
  onIconDelete?: (icon: IconData) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface IconUtilsConfig {
  compressionLevel?: number;
  removeViewBox?: boolean;
  removeDimensions?: boolean;
}

export interface SaveIconResult {
  success: boolean;
  message: string;
  originalSize?: number;
  optimizedSize?: number;
}
