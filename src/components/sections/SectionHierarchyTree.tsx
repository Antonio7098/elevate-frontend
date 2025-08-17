import React, { useState, useCallback } from 'react';
import type { BlueprintSection, SectionHierarchy, SectionOrderData } from '../../types/blueprintSection';
import SectionTreeItem from './SectionTreeItem';

interface SectionHierarchyTreeProps {
  sections: BlueprintSection[];
  hierarchy: SectionHierarchy;
  expandedSections: Set<string>;
  onToggleSection: (sectionId: string) => void;
  onSectionClick: (sectionId: string) => void;
  onSectionMove?: (sectionId: string, newParentId: string | null) => void;
  onSectionReorder?: (blueprintId: string, orderData: SectionOrderData[]) => void;
  isEditable?: boolean;
  className?: string;
}

const SectionHierarchyTree: React.FC<SectionHierarchyTreeProps> = ({
  sections,
  hierarchy,
  expandedSections,
  onToggleSection,
  onSectionClick,
  onSectionMove,
  onSectionReorder,
  isEditable = false,
  className = ''
}) => {
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  const handleToggleSection = useCallback((sectionId: string) => {
    onToggleSection(sectionId);
  }, [onToggleSection]);

  const handleSectionClick = useCallback((sectionId: string) => {
    onSectionClick(sectionId);
  }, [onSectionClick]);

  const handleDragStart = useCallback((e: React.DragEvent, sectionId: string) => {
    if (!isEditable) return;
    
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sectionId);
  }, [isEditable]);

  const handleDragOver = useCallback((e: React.DragEvent, sectionId: string) => {
    if (!isEditable || !draggedSection || draggedSection === sectionId) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSection(sectionId);
  }, [isEditable, draggedSection]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!isEditable) return;
    
    // Only clear if we're leaving the section entirely, not just entering a child
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverSection(null);
    }
  }, [isEditable]);

  const handleDrop = useCallback((e: React.DragEvent, targetSectionId: string) => {
    if (!isEditable || !draggedSection || !onSectionMove) return;
    
    e.preventDefault();
    setDraggedSection(null);
    setDragOverSection(null);
    
    // Don't allow dropping on itself
    if (draggedSection === targetSectionId) return;
    
    // Check if target is a descendant of dragged section (would create circular reference)
    const isDescendant = (parentId: string, childId: string): boolean => {
      const parent = sections.find(s => s.id === parentId);
      if (!parent || !parent.children) return false;
      
      return parent.children.some(child => 
        child.id === childId || isDescendant(child.id, childId)
      );
    };
    
    if (isDescendant(draggedSection, targetSectionId)) return;
    
    onSectionMove(draggedSection, targetSectionId);
  }, [isEditable, draggedSection, onSectionMove, sections]);

  const handleDragEnd = useCallback(() => {
    setDraggedSection(null);
    setDragOverSection(null);
  }, []);

  const renderSection = useCallback((section: BlueprintSection, depth: number = 0) => {
    const isExpanded = expandedSections.has(section.id);
    const isSelected = hierarchy.selectedSectionId === section.id;
    const isDragOver = dragOverSection === section.id;
    const isDragging = draggedSection === section.id;

    return (
      <div
        key={section.id}
        draggable={isEditable}
        onDragStart={(e) => handleDragStart(e, section.id)}
        onDragOver={(e) => handleDragOver(e, section.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, section.id)}
        onDragEnd={handleDragEnd}
        className={`transition-all duration-200 ${
          isDragOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
        } ${isDragging ? 'opacity-50' : ''}`}
      >
        <SectionTreeItem
          section={section}
          depth={depth}
          isExpanded={isExpanded}
          onToggleExpand={handleToggleSection}
          onSectionClick={handleSectionClick}
          masteryProgress={section.masteryProgress}
          isSelected={isSelected}
        />
        
        {/* Render children if expanded */}
        {isExpanded && section.children && section.children.length > 0 && (
          <div className="section-children">
            {section.children.map((child) => renderSection(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }, [
    expandedSections,
    hierarchy.selectedSectionId,
    dragOverSection,
    draggedSection,
    isEditable,
    handleToggleSection,
    handleSectionClick,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  ]);

  // Build the tree structure from flat sections
  const buildTree = useCallback((sections: BlueprintSection[]): BlueprintSection[] => {
    const sectionMap = new Map<string, BlueprintSection>();
    const rootSections: BlueprintSection[] = [];

    // First pass: create a map of all sections
    sections.forEach(section => {
      sectionMap.set(section.id, { ...section, children: [] });
    });

    // Second pass: build the tree structure
    sections.forEach(section => {
      const sectionWithChildren = sectionMap.get(section.id)!;
      
      if (section.parentSectionId) {
        const parent = sectionMap.get(section.parentSectionId);
        if (parent) {
          parent.children.push(sectionWithChildren);
        }
      } else {
        rootSections.push(sectionWithChildren);
      }
    });

    // Sort by orderIndex
    const sortSections = (sections: BlueprintSection[]) => {
      sections.sort((a, b) => a.orderIndex - b.orderIndex);
      sections.forEach(section => {
        if (section.children && section.children.length > 0) {
          sortSections(section.children);
        }
      });
    };

    sortSections(rootSections);
    return rootSections;
  }, []);

  const treeSections = buildTree(sections);

  return (
    <div className={`section-hierarchy-tree ${className}`}>
      {/* Header */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Section Hierarchy
          </h2>
          <div className="flex items-center space-x-2">
            {isEditable && (
              <button
                onClick={() => {
                  // Expand all sections
                  const allSectionIds = new Set<string>();
                  const collectIds = (sections: BlueprintSection[]) => {
                    sections.forEach(section => {
                      allSectionIds.add(section.id);
                      if (section.children && section.children.length > 0) {
                        collectIds(section.children);
                      }
                    });
                  };
                  collectIds(treeSections);
                  treeSections.forEach(section => onToggleSection(section.id));
                }}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200"
              >
                Expand All
              </button>
            )}
            <span className="text-sm text-gray-500">
              {sections.length} sections
            </span>
          </div>
        </div>
      </div>

      {/* Tree Content */}
      <div className="space-y-1">
        {treeSections.length > 0 ? (
          treeSections.map(section => renderSection(section))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sections</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first section.
            </p>
          </div>
        )}
      </div>

      {/* Drag and Drop Instructions */}
      {isEditable && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center text-sm text-blue-700">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Drag and drop sections to reorganize the hierarchy. Sections can be nested within other sections.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionHierarchyTree;





