import React from 'react';
import type { LearningBlueprint } from '../../types/blueprint.types';

interface BlueprintStatsProps {
  blueprint: LearningBlueprint;
  className?: string;
}

const BlueprintStats: React.FC<BlueprintStatsProps> = ({
  blueprint,
  className = ''
}) => {
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

  const getAverageSectionsPerLevel = () => {
    if (blueprint.sections.length === 0) return 0;
    
    const levels = blueprint.sections.reduce((acc, section) => {
      const level = section.parent_section_id ? 1 : 0;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const totalLevels = Object.keys(levels).length;
    return totalLevels > 0 ? blueprint.sections.length / totalLevels : 0;
  };

  const getComplexityDistribution = () => {
    // This would be calculated based on mastery criteria complexity scores
    // For now, we'll use a mock distribution
    return {
      beginner: Math.floor(blueprint.sections.length * 0.4),
      intermediate: Math.floor(blueprint.sections.length * 0.4),
      advanced: Math.floor(blueprint.sections.length * 0.2)
    };
  };

  const getEstimatedTotalTime = () => {
    // Mock calculation - in real implementation this would come from section data
    return blueprint.sections.length * 45; // 45 minutes per section average
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const complexityDistribution = getComplexityDistribution();

  return (
    <div className={`blueprint-stats ${className}`}>
      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Sections */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {blueprint.sections.length}
          </div>
          <div className="text-sm text-gray-600">Total Sections</div>
          <div className="text-xs text-gray-500 mt-1">
            {blueprint.sections.filter(s => !s.parent_section_id).length} root, {blueprint.sections.filter(s => s.parent_section_id).length} nested
          </div>
        </div>

        {/* Knowledge Primitives */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {getTotalKnowledgePrimitives()}
          </div>
          <div className="text-sm text-gray-600">Knowledge Primitives</div>
          <div className="text-xs text-gray-500 mt-1">
            Across all categories
          </div>
        </div>

        {/* Mastery Criteria */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {blueprint.knowledge_primitives.mastery_criteria?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Mastery Criteria</div>
          <div className="text-xs text-gray-500 mt-1">
            Learning objectives
          </div>
        </div>

        {/* Estimated Time */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatTime(getEstimatedTotalTime())}
          </div>
          <div className="text-sm text-gray-600">Estimated Time</div>
          <div className="text-xs text-gray-500 mt-1">
            To complete blueprint
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Primitives Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Primitives Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Propositions & Facts</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {blueprint.knowledge_primitives.key_propositions_and_facts.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Entities & Definitions</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {blueprint.knowledge_primitives.key_entities_and_definitions.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Processes & Steps</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {blueprint.knowledge_primitives.described_processes_and_steps.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Relationships</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {blueprint.knowledge_primitives.identified_relationships.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Open Questions</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {blueprint.knowledge_primitives.implicit_and_open_questions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Complexity Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complexity Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Beginner</span>
                <span className="text-sm font-semibold text-gray-900">{complexityDistribution.beginner}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(complexityDistribution.beginner / blueprint.sections.length) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Intermediate</span>
                <span className="text-sm font-semibold text-gray-900">{complexityDistribution.intermediate}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(complexityDistribution.intermediate / blueprint.sections.length) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Advanced</span>
                <span className="text-sm font-semibold text-gray-900">{complexityDistribution.advanced}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(complexityDistribution.advanced / blueprint.sections.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {getAverageSectionsPerLevel().toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Avg Sections per Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {blueprint.sections.filter(s => !s.parent_section_id).length}
            </div>
            <div className="text-sm text-gray-600">Root Level Sections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {blueprint.sections.filter(s => s.parent_section_id).length}
            </div>
            <div className="text-sm text-gray-600">Nested Sections</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintStats;





