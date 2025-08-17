import React, { useState } from 'react';
import type { BlueprintSection } from '../../types/blueprintSection';

interface SectionActionsProps {
  section: BlueprintSection;
  onEdit: (section: BlueprintSection) => void;
  onDelete: (sectionId: string) => void;
  onAddChild: (parentSectionId: string) => void;
  onMove: (sectionId: string, newParentId: string | null) => void;
  onDuplicate: (section: BlueprintSection) => void;
  onExport: (sectionId: string) => void;
  onShare: (sectionId: string) => void;
  isEditable?: boolean;
  className?: string;
}

const SectionActions: React.FC<SectionActionsProps> = ({
  section,
  onEdit,
  onDelete,
  onAddChild,
  onMove,
  onDuplicate,
  onExport,
  onShare,
  isEditable = true,
  className = ''
}) => {
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${section.title}"? This action cannot be undone.`)) {
      onDelete(section.id);
    }
  };

  const handleMove = (newParentId: string | null) => {
    onMove(section.id, newParentId);
    setShowMoveMenu(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`section-actions ${className}`}>
      {/* Primary Actions */}
      <div className="flex items-center space-x-2">
        {/* Add Child Button */}
        <button
          onClick={() => onAddChild(section.id)}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200 flex items-center"
          title="Add child section"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Child
        </button>

        {/* Edit Button */}
        <button
          onClick={() => onEdit(section)}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-colors duration-200 flex items-center"
          title="Edit section"
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

        {/* Move Button */}
        <div className="relative">
          <button
            onClick={() => setShowMoveMenu(!showMoveMenu)}
            className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 hover:border-purple-300 transition-colors duration-200 flex items-center"
            title="Move section"
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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Move
          </button>

          {/* Move Menu */}
          {showMoveMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => handleMove(null)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Move to Root Level
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <div className="px-4 py-2 text-xs text-gray-500">
                  Move to specific parent:
                </div>
                {/* This would be populated with available parent sections */}
                <button
                  onClick={() => handleMove('parent-1')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Parent Section 1
                </button>
                <button
                  onClick={() => handleMove('parent-2')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Parent Section 2
                </button>
              </div>
            </div>
          )}
        </div>

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

          {/* More Actions Menu */}
          {showMoreMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => onDuplicate(section)}
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
                  Duplicate
                </button>
                <button
                  onClick={() => onExport(section.id)}
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export
                </button>
                <button
                  onClick={() => onShare(section.id)}
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  Share
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={handleDelete}
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

      {/* Section Info */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Difficulty */}
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(
                section.difficulty
              )}`}
            >
              {section.difficulty}
            </span>

            {/* Depth */}
            <span className="text-sm text-gray-600">
              Depth: {section.depth}
            </span>

            {/* Order */}
            <span className="text-sm text-gray-600">
              Order: {section.orderIndex}
            </span>

            {/* Content Count */}
            {section.contentCount && section.contentCount > 0 && (
              <span className="text-sm text-gray-600">
                {section.contentCount} items
              </span>
            )}
          </div>

          {/* Section ID */}
          <span className="text-xs text-gray-400 font-mono">
            ID: {section.id}
          </span>
        </div>
      </div>

      {/* Close menus when clicking outside */}
      {(showMoveMenu || showMoreMenu) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowMoveMenu(false);
            setShowMoreMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default SectionActions;





