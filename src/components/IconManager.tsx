import React, { useState } from "react";
import { IconManagerProps, IconData } from "../types";
import { IconEditor } from "./IconEditor";

export const IconManager: React.FC<IconManagerProps> = ({
  icons = [],
  onIconEdit,
  onIconCopy,
  onIconDelete,
  className = "",
  style = {},
}) => {
  const [editingIcon, setEditingIcon] = useState<IconData | null>(null);

  const handleEditIcon = (icon: IconData) => {
    setEditingIcon(icon);
    onIconEdit?.(icon);
  };

  const handleUpdateIcon = (updatedIcon: IconData) => {
    setEditingIcon(null);
    // This would typically update the parent state
  };

  const copyToClipboard = (icon: IconData) => {
    const textToCopy =
      icon.type === "svg"
        ? `<i className="${icon.className}" style="width: 24px; height: 24px;" />`
        : `<i className="${icon.className}" style="width: 24px; height: 24px;" />`;

    navigator.clipboard.writeText(textToCopy).then(
      () => {
        onIconCopy?.(icon);
      },
      () => {
        console.error("Failed to copy to clipboard");
      }
    );
  };

  const handleDeleteIcon = (icon: IconData) => {
    if (
      window.confirm(
        `Are you sure you want to delete the icon "${icon.className}"?`
      )
    ) {
      onIconDelete?.(icon);
    }
  };

  return (
    <div className={`icon-manager ${className}`} style={style}>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Icon Library</h2>
        </div>
        <div className="card-content">
          {icons.length === 0 ? (
            <div className="empty-state">
              <p className="text-gray-500">
                No icons created yet. Use the Icon Creator to add some icons.
              </p>
            </div>
          ) : (
            <div className="icon-grid">
              {icons.map((icon, index) => (
                <div key={`${icon.className}-${index}`} className="icon-card">
                  <div className="icon-preview">
                    <i
                      className={`${icon.className} ${
                        icon.type === "svg" ? "text-black" : ""
                      }`}
                      style={{ width: "48px", height: "48px" }}
                    />
                  </div>
                  <span className="icon-type-badge">{icon.type}</span>
                  <div className="icon-actions">
                    <button
                      onClick={() => copyToClipboard(icon)}
                      className="icon-button"
                      title={`Copy ${icon.className} to clipboard`}
                    >
                      <span>{icon.className}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEditIcon(icon)}
                      className="icon-button edit-button"
                      title={`Edit ${icon.className}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteIcon(icon)}
                      className="icon-button delete-button"
                      title={`Delete ${icon.className}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3,6 5,6 21,6" />
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editingIcon && (
        <IconEditor
          icon={editingIcon}
          onClose={() => setEditingIcon(null)}
          onUpdate={handleUpdateIcon}
          onError={(error) => console.error("Icon update error:", error)}
        />
      )}
    </div>
  );
};
