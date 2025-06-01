import { useState, useCallback } from "react";
import { IconData } from "../types";

export const useIconManager = (initialIcons: IconData[] = []) => {
  const [icons, setIcons] = useState<IconData[]>(initialIcons);

  const addIcon = useCallback((icon: IconData) => {
    setIcons((prev) => [...prev, icon]);
  }, []);

  const updateIcon = useCallback((updatedIcon: IconData) => {
    setIcons((prev) =>
      prev.map((icon) =>
        icon.className === updatedIcon.className ? updatedIcon : icon
      )
    );
  }, []);

  const removeIcon = useCallback((className: string) => {
    setIcons((prev) => prev.filter((icon) => icon.className !== className));
  }, []);

  const getIcon = useCallback(
    (className: string) => {
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

  const importIcons = useCallback((jsonData: string) => {
    try {
      const parsedIcons = JSON.parse(jsonData) as IconData[];
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
    iconCount: icons.length,
  };
};
