import React, { useState, useEffect } from 'react';
import type { LearningBlueprint } from '../../types/blueprint.types';

interface BlueprintSelectorProps {
  blueprints: LearningBlueprint[];
  selectedBlueprintId?: string;
  onBlueprintSelect: (blueprintId: string) => void;
  onBlueprintCreate?: () => void;
  onBlueprintImport?: () => void;
  isLoading?: boolean;
  className?: string;
}

const BlueprintSelector: React.FC<BlueprintSelectorProps> = ({
  blueprints,
  selectedBlueprintId,
  onBlueprintSelect,
  onBlueprintCreate,
  onBlueprintImport,
  isLoading = false,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlueprints, setFilteredBlueprints] = useState<LearningBlueprint[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBlueprints(blueprints);
    } else {
      const filtered = blueprints.filter(blueprint =>
        blueprint.source_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blueprint.source_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlueprints(filtered);
    }
  }, [searchTerm, blueprints]);

  const handleBlueprintSelect = (blueprintId: string) => {
    onBlueprintSelect(blueprintId);
    setShowDropdown(false);
    setSearchTerm('');
  };

  const selectedBlueprint = blueprints.find(b => b.source_id === selectedBlueprintId);

  const getSourceTypeIcon = (sourceType: string) => {
    switch (sourceType.toLowerCase()) {
      case 'pdf':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            <path d="M8 11l3 3-3 3V11z" />
          </svg>
        );
      case 'article':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
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
    <div className={`blueprint-selector ${className}`}>
      {/* Selected Blueprint Display */}
      {selectedBlueprint && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getSourceTypeIcon(selectedBlueprint.source_type)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedBlueprint.source_title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getSourceTypeColor(
                      selectedBlueprint.source_type
                    )}`}
                  >
                    {selectedBlueprint.source_type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {selectedBlueprint.sections.length} sections
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-colors duration-200"
            >
              Change Blueprint
            </button>
          </div>
        </div>
      )}

      {/* Blueprint Selection Dropdown */}
      <div className="relative">
        <div className="flex space-x-2 mb-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search blueprints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {isLoading && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          {onBlueprintCreate && (
            <button
              onClick={onBlueprintCreate}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New
            </button>
          )}
          {onBlueprintImport && (
            <button
              onClick={onBlueprintImport}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-colors duration-200"
            >
              Import
            </button>
          )}
        </div>

        {/* Dropdown List */}
        {showDropdown && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
            {filteredBlueprints.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                {searchTerm ? 'No blueprints found matching your search.' : 'No blueprints available.'}
              </div>
            ) : (
              <div className="py-1">
                {filteredBlueprints.map((blueprint) => (
                  <button
                    key={blueprint.source_id}
                    onClick={() => handleBlueprintSelect(blueprint.source_id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                      selectedBlueprintId === blueprint.source_id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {getSourceTypeIcon(blueprint.source_type)}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {blueprint.source_title}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getSourceTypeColor(
                              blueprint.source_type
                            )}`}
                          >
                            {blueprint.source_type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {blueprint.sections.length} sections
                          </span>
                        </div>
                      </div>
                      {selectedBlueprintId === blueprint.source_id && (
                        <svg
                          className="w-5 h-5 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Blueprint Stats */}
      {selectedBlueprint && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {selectedBlueprint.sections.length}
            </div>
            <div className="text-sm text-gray-600">Total Sections</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600">
              {selectedBlueprint.knowledge_primitives.key_propositions_and_facts.length +
                selectedBlueprint.knowledge_primitives.key_entities_and_definitions.length +
                selectedBlueprint.knowledge_primitives.described_processes_and_steps.length}
            </div>
            <div className="text-sm text-gray-600">Knowledge Primitives</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {selectedBlueprint.knowledge_primitives.mastery_criteria?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Mastery Criteria</div>
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default BlueprintSelector;





