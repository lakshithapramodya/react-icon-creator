/**
 * Utility functions for environment detection
 */

/**
 * Check if the code is running in a browser environment
 * @returns {boolean} True if running in a browser
 */
export const isBrowser = (): boolean => {
  return typeof window !== "undefined" && typeof document !== "undefined";
};

/**
 * Check if the code is running in a Node.js environment
 * @returns {boolean} True if running in Node.js
 */
export const isNode = (): boolean => {
  return (
    typeof process !== "undefined" &&
    process.versions != null &&
    process.versions.node != null
  );
};

/**
 * Check if the environment supports file system operations
 * @returns {boolean} True if file system operations are supported
 */
export const supportsFileSystem = (): boolean => {
  try {
    // Try to access fs module - this will throw in a browser
    if (isNode()) {
      // Only import if in Node environment
      require("fs");
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};
