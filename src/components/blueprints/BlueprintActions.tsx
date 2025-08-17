import React, { useState } from 'react';
import type { LearningBlueprint } from '../../types/blueprint.types';

interface BlueprintActionsProps {
  blueprint: LearningBlueprint;
  onEdit: (blueprint: LearningBlueprint) => void;
  onDuplicate: (blueprint: LearningBlueprint) => void;
  onExport: (blueprintId: string) => void;
  onShare: (blueprintId: string) => void;
  onDelete: (blueprintId: string) => void;
  onArchive?: (blueprintId: string) => void;
  onRestore?: (blueprintId: string) => void;
  onPublish?: (blueprintId: string) => void;
  onUnpublish?: (blueprintId: string) => void;
  isEditable?: boolean;
  isArchived?: boolean;
  isPublished?: boolean;
  className?: string;
}

const BlueprintActions: React.FC<BlueprintActionsProps> = ({
  blueprint,
  onEdit,
  onDuplicate,
  onExport,
  onShare,
  onDelete,
  onArchive,
  onRestore,
  onPublish,
  onUnpublish,
  isEditable = true,
  isArchived = false,
  isPublished = false,
  className = ''
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(blueprint.source_id);
    setShowDeleteConfirm(false);
  };

  const getSourceTypeColor = (sourceType: string) => {
    switch (sourceType.toLowerCase()) {
      case 'pdf':
        return 'text-red-600 bg-red-100';
      case 'video':
        return 'text-blue-600 bg-blue-100';
      case 'article':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`blueprint-actions ${className}`}>
      {/* Primary Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Edit Button */}
        {isEditable && !isArchived && (
          <button
            onClick={() => onEdit(blueprint)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            title="Edit blueprint"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
        )}

        {/* Duplicate Button */}
        <button
          onClick={() => onDuplicate(blueprint)}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200 flex items-center"
          title="Duplicate blueprint"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Duplicate
        </button>

        {/* Export Button */}
        <button
          onClick={() => onExport(blueprint.source_id)}
          className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 hover:border-green-300 transition-colors duration-200 flex items-center"
          title="Export blueprint"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export
        </button>

        {/* Share Button */}
        <button
          onClick={() => onShare(blueprint.source_id)}
          className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 hover:border-purple-300 transition-colors duration-200 flex items-center"
          title="Share blueprint"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
          Share
        </button>

        {/* Publish/Unpublish Button */}
        {onPublish && onUnpublish && (
          <button
            onClick={() => isPublished ? onUnpublish(blueprint.source_id) : onPublish(blueprint.source_id)}
            className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-200 flex items-center ${
              isPublished
                ? 'text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-300'
                : 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300'
            }`}
            title={isPublished ? 'Unpublish blueprint' : 'Publish blueprint'}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isPublished ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              )}
            </svg>
            {isPublished ? 'Unpublish' : 'Publish'}
          </button>
        )}

        {/* Archive/Restore Button */}
        {onArchive && onRestore && (
          <button
            onClick={() => isArchived ? onRestore(blueprint.source_id) : onArchive(blueprint.source_id)}
            className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-200 flex items-center ${
              isArchived
                ? 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300'
                : 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300'
            }`}
            title={isArchived ? 'Restore blueprint' : 'Archive blueprint'}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isArchived ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              )}
            </svg>
            {isArchived ? 'Restore' : 'Archive'}
          </button>
        )}

        {/* More Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-colors duration-200 flex items-center"
            title="More actions"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
            More
          </button>

          {/* More Actions Dropdown */}
          {showMoreMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    // Copy blueprint ID to clipboard
                    navigator.clipboard.writeText(blueprint.source_id);
                    setShowMoreMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy ID
                </button>
                <button
                  onClick={() => {
                    // Copy blueprint URL to clipboard
                    navigator.clipboard.writeText(window.location.href);
                    setShowMoreMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Copy URL
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blueprint Info */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Source Type */}
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getSourceTypeColor(
                blueprint.source_type
              )}`}
            >
              {blueprint.source_type}
            </span>

            {/* Status Indicators */}
            {isArchived && (
              <span className="px-3 py-1 text-sm font-medium text-yellow-600 bg-yellow-100 rounded-full">
                Archived
              </span>
            )}
            {isPublished && (
              <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full">
                Published
              </span>
            )}
          </div>

          {/* Blueprint ID */}
          <span className="text-xs text-gray-400 font-mono">
            ID: {blueprint.source_id}
          </span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowDeleteConfirm(false)}
            />

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Blueprint
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{blueprint.source_title}"? This action cannot be undone and will permanently remove the blueprint and all associated data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close menus when clicking outside */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMoreMenu(false)}
        />
      )}
    </div>
  );
};

export default BlueprintActions;





