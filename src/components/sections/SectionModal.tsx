import React, { useState, useEffect } from 'react';
import type { BlueprintSection, CreateSectionData, UpdateSectionData } from '../../types/blueprintSection';
import type { DifficultyLevel } from '../../types/blueprint.types';

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateSectionData | UpdateSectionData) => void;
  section?: BlueprintSection; // If provided, we're editing; otherwise creating
  parentSectionId?: string;
  blueprintId: string;
  availableParentSections?: BlueprintSection[];
  className?: string;
}

const SectionModal: React.FC<SectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  section,
  parentSectionId,
  blueprintId,
  availableParentSections = [],
  className = ''
}) => {
  const isEditing = !!section;
  const [formData, setFormData] = useState<CreateSectionData>({
    title: '',
    description: '',
    blueprintId,
    parentSectionId: parentSectionId || undefined,
    difficulty: 'beginner',
    estimatedTimeMinutes: 30,
    orderIndex: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when editing
  useEffect(() => {
    if (section) {
      setFormData({
        title: section.title,
        description: section.description || '',
        blueprintId: section.blueprintId,
        parentSectionId: section.parentSectionId,
        difficulty: section.difficulty,
        estimatedTimeMinutes: section.estimatedTimeMinutes || 30,
        orderIndex: section.orderIndex
      });
    } else {
      // Reset form for new section
      setFormData({
        title: '',
        description: '',
        blueprintId,
        parentSectionId: parentSectionId || undefined,
        difficulty: 'beginner',
        estimatedTimeMinutes: 30,
        orderIndex: 0
      });
    }
    setErrors({});
  }, [section, parentSectionId, blueprintId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.estimatedTimeMinutes < 1) {
      newErrors.estimatedTimeMinutes = 'Estimated time must be at least 1 minute';
    }

    if (formData.estimatedTimeMinutes > 480) {
      newErrors.estimatedTimeMinutes = 'Estimated time must be less than 8 hours';
    }

    if (formData.orderIndex < 0) {
      newErrors.orderIndex = 'Order index must be non-negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleInputChange = (field: keyof CreateSectionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  const difficultyOptions: { value: DifficultyLevel; label: string; description: string }[] = [
    { value: 'beginner', label: 'Beginner', description: 'Basic concepts and fundamentals' },
    { value: 'intermediate', label: 'Intermediate', description: 'Building on foundational knowledge' },
    { value: 'advanced', label: 'Advanced', description: 'Complex topics and deep understanding' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {isEditing ? 'Edit Section' : 'Create New Section'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-gray-50 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="bg-white px-4 py-5 sm:p-6">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.title ? 'border-red-300' : ''
                    }`}
                    placeholder="Enter section title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.description ? 'border-red-300' : ''
                    }`}
                    placeholder="Enter section description (optional)"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Parent Section */}
                {availableParentSections.length > 0 && (
                  <div>
                    <label htmlFor="parentSection" className="block text-sm font-medium text-gray-700">
                      Parent Section
                    </label>
                    <select
                      id="parentSection"
                      value={formData.parentSectionId || ''}
                      onChange={(e) => handleInputChange('parentSectionId', e.target.value || undefined)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">No parent (root level)</option>
                      {availableParentSections.map((parent) => (
                        <option key={parent.id} value={parent.id}>
                          {parent.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Difficulty */}
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value as DifficultyLevel)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {difficultyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} - {option.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estimated Time */}
                <div>
                  <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700">
                    Estimated Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="estimatedTime"
                    min="1"
                    max="480"
                    value={formData.estimatedTimeMinutes}
                    onChange={(e) => handleInputChange('estimatedTimeMinutes', parseInt(e.target.value) || 30)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.estimatedTimeMinutes ? 'border-red-300' : ''
                    }`}
                    placeholder="30"
                  />
                  {errors.estimatedTimeMinutes && (
                    <p className="mt-1 text-sm text-red-600">{errors.estimatedTimeMinutes}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Estimated time for students to complete this section
                  </p>
                </div>

                {/* Order Index */}
                <div>
                  <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700">
                    Display Order
                  </label>
                  <input
                    type="number"
                    id="orderIndex"
                    min="0"
                    value={formData.orderIndex}
                    onChange={(e) => handleInputChange('orderIndex', parseInt(e.target.value) || 0)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.orderIndex ? 'border-red-300' : ''
                    }`}
                    placeholder="0"
                  />
                  {errors.orderIndex && (
                    <p className="mt-1 text-sm text-red-600">{errors.orderIndex}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Lower numbers appear first in the section list
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isEditing ? 'Update Section' : 'Create Section'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SectionModal;





