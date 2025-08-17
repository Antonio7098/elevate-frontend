import React from 'react';
import type { LearningBlueprint } from '../../types/blueprint.types';

interface BlueprintHeaderProps {
  blueprint: LearningBlueprint;
  onEdit?: (blueprint: LearningBlueprint) => void;
  onDuplicate?: (blueprint: LearningBlueprint) => void;
  onExport?: (blueprintId: string) => void;
  onShare?: (blueprintId: string) => void;
  onDelete?: (blueprintId: string) => void;
  isEditable?: boolean;
  className?: string;
}

const BlueprintHeader: React.FC<BlueprintHeaderProps> = ({
  blueprint,
  onEdit,
  onDuplicate,
  onExport,
  onShare,
  onDelete,
  isEditable = false,
  className = ''
}) => {
  const getSourceTypeIcon = (sourceType: string) => {
    switch (sourceType.toLowerCase()) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            <path d="M8 11l3 3-3 3V11z" />
          </svg>
        );
      case 'article':
        return (
          <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getSourceTypeColor = (sourceType: string) => {
    switch (sourceType.toLowerCase()) {
      case 'pdf':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'video':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'article':
        return 'text-green-600 bg-green-100 border-green-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTotalKnowledgePrimitives = () => {
    const { knowledge_primitives } = blueprint;
    return (
      knowledge_primitives.key_propositions_and_facts.length +
      knowledge_primitives.key_entities_and_definitions.length +
      knowledge_primitives.described_processes_and_steps.length +
      knowledge_primitives.identified_relationships.length +
      knowledge_primitives.implicit_and_open_questions.length
    );
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${blueprint.source_title}"? This action cannot be undone.`)) {
      onDelete?.(blueprint.source_id);
    }
  };

  return (
    <div className={`blueprint-header bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Main Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Title and Source Type */}
            <div className="flex items-center space-x-4 mb-4">
              {getSourceTypeIcon(blueprint.source_type)}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 truncate">
                  {blueprint.source_title}
                </h1>
                <div className="flex items-center space-x-2 mt-2">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full border ${getSourceTypeColor(
                      blueprint.source_type
                    )}`}
                  >
                    {blueprint.source_type}
                  </span>
                  <span className="text-sm text-gray-500">
                    Blueprint ID: {blueprint.source_id}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary */}
            {blueprint.source_summary && Object.keys(blueprint.source_summary).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(blueprint.source_summary, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {blueprint.sections.length}
                </div>
                <div className="text-sm text-blue-700">Sections</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {getTotalKnowledgePrimitives()}
                </div>
                <div className="text-sm text-green-700">Knowledge Primitives</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {blueprint.knowledge_primitives.mastery_criteria?.length || 0}
                </div>
                <div className="text-sm text-purple-700">Mastery Criteria</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {blueprint.knowledge_primitives.implicit_and_open_questions.length}
                </div>
                <div className="text-sm text-orange-700">Open Questions</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditable && (
            <div className="flex flex-col space-y-2 ml-6">
              {onEdit && (
                <button
                  onClick={() => onEdit(blueprint)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-colors duration-200 flex items-center"
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

              {onDuplicate && (
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
              )}

              {onExport && (
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
              )}

              {onShare && (
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
              )}

              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-colors duration-200 flex items-center"
                  title="Delete blueprint"
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
              )}
            </div>
          )}
        </div>
      </div>

      {/* Knowledge Primitives Summary */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Knowledge Primitives Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {blueprint.knowledge_primitives.key_propositions_and_facts.length}
            </div>
            <div className="text-sm text-gray-600">Propositions & Facts</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {blueprint.knowledge_primitives.key_entities_and_definitions.length}
            </div>
            <div className="text-sm text-gray-600">Entities & Definitions</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600">
              {blueprint.knowledge_primitives.described_processes_and_steps.length}
            </div>
            <div className="text-sm text-gray-600">Processes & Steps</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-600">
              {blueprint.knowledge_primitives.identified_relationships.length}
            </div>
            <div className="text-sm text-gray-600">Relationships</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">
              {blueprint.knowledge_primitives.implicit_and_open_questions.length}
            </div>
            <div className="text-sm text-gray-600">Open Questions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintHeader;





