import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { LearningBlueprint } from '../types/blueprint.types';
import type { BlueprintSection } from '../types/blueprintSection';
import type { MasteryCriterion } from '../types/masteryCriterion';
import type { QuestionInstance } from '../types/questionInstance';
import type { MasteryTracking } from '../types/masteryTracking';
import type { UueStageProgression } from '../types/uueStage';
import type { LearningPathway } from '../types/learningPathways';

// State interfaces
interface BlueprintState {
  // Current blueprint and section context
  currentBlueprint: LearningBlueprint | null;
  currentSection: BlueprintSection | null;
  currentCriterion: MasteryCriterion | null;
  
  // Blueprint data
  blueprints: LearningBlueprint[];
  sections: BlueprintSection[];
  criteria: MasteryCriterion[];
  questions: QuestionInstance[];
  
  // Mastery and progress data
  masteryTracking: MasteryTracking[];
  uueProgressions: UueStageProgression[];
  
  // Learning pathways
  learningPathways: LearningPathway[];
  currentPathway: LearningPathway | null;
  
  // UI state
  expandedSections: Set<string>;
  selectedSections: Set<string>;
  selectedCriteria: Set<string>;
  
  // Loading states
  isLoading: {
    blueprints: boolean;
    sections: boolean;
    criteria: boolean;
    questions: boolean;
    mastery: boolean;
    pathways: boolean;
  };
  
  // Error states
  errors: {
    blueprints: string | null;
    sections: string | null;
    criteria: string | null;
    questions: string | null;
    mastery: string | null;
    pathways: string | null;
  };
}

// Actions interface
interface BlueprintActions {
  // Blueprint management
  setCurrentBlueprint: (blueprint: LearningBlueprint | null) => void;
  setCurrentSection: (section: BlueprintSection | null) => void;
  setCurrentCriterion: (criterion: MasteryCriterion | null) => void;
  
  // Data setters
  setBlueprints: (blueprints: LearningBlueprint[]) => void;
  setSections: (sections: BlueprintSection[]) => void;
  setCriteria: (criteria: MasteryCriterion[]) => void;
  setQuestions: (questions: QuestionInstance[]) => void;
  setMasteryTracking: (tracking: MasteryTracking[]) => void;
  setUueProgressions: (progressions: UueStageProgression[]) => void;
  setLearningPathways: (pathways: LearningPathway[]) => void;
  setCurrentPathway: (pathway: LearningPathway | null) => void;
  
  // Data updates
  addBlueprint: (blueprint: LearningBlueprint) => void;
  updateBlueprint: (id: string, updates: Partial<LearningBlueprint>) => void;
  removeBlueprint: (id: string) => void;
  
  addSection: (section: BlueprintSection) => void;
  updateSection: (id: string, updates: Partial<BlueprintSection>) => void;
  removeSection: (id: string) => void;
  
  addCriterion: (criterion: MasteryCriterion) => void;
  updateCriterion: (id: string, updates: Partial<MasteryCriterion>) => void;
  removeCriterion: (id: string) => void;
  
  addQuestion: (question: QuestionInstance) => void;
  updateQuestion: (id: string, updates: Partial<QuestionInstance>) => void;
  removeQuestion: (id: string) => void;
  
  updateMasteryTracking: (id: string, updates: Partial<MasteryTracking>) => void;
  updateUueProgression: (id: string, updates: Partial<UueStageProgression>) => void;
  
  // UI state management
  toggleSectionExpansion: (sectionId: string) => void;
  setSectionExpanded: (sectionId: string, expanded: boolean) => void;
  setExpandedSections: (sectionIds: string[]) => void;
  collapseAllSections: () => void;
  expandAllSections: () => void;
  
  toggleSectionSelection: (sectionId: string) => void;
  setSectionSelection: (sectionIds: string[]) => void;
  clearSectionSelection: () => void;
  
  toggleCriterionSelection: (criterionId: string) => void;
  setCriterionSelection: (criterionIds: string[]) => void;
  clearCriterionSelection: () => void;
  
  // Loading state management
  setLoading: (key: keyof BlueprintState['isLoading'], loading: boolean) => void;
  setError: (key: keyof BlueprintState['errors'], error: string | null) => void;
  clearErrors: () => void;
  
  // Utility actions
  getSectionById: (id: string) => BlueprintSection | undefined;
  getCriterionById: (id: string) => MasteryCriterion | undefined;
  getQuestionById: (id: string) => QuestionInstance | undefined;
  getMasteryTrackingById: (id: string) => MasteryTracking | undefined;
  
  getSectionsByParent: (parentId: string | null) => BlueprintSection[];
  getCriteriaBySection: (sectionId: string) => MasteryCriterion[];
  getQuestionsByCriterion: (criterionId: string) => QuestionInstance[];
  
  getSectionsByBlueprint: (blueprintId: string) => BlueprintSection[];
  getCriteriaByBlueprint: (blueprintId: string) => MasteryCriterion[];
  getQuestionsByBlueprint: (blueprintId: string) => QuestionInstance[];
  
  // Reset actions
  resetCurrentContext: () => void;
  resetAllData: () => void;
}

// Combined store type
type BlueprintStore = BlueprintState & BlueprintActions;

// Initial state
const initialState: BlueprintState = {
  // Current context
  currentBlueprint: null,
  currentSection: null,
  currentCriterion: null,
  
  // Data arrays
  blueprints: [],
  sections: [],
  criteria: [],
  questions: [],
  masteryTracking: [],
  uueProgressions: [],
  learningPathways: [],
  currentPathway: null,
  
  // UI state
  expandedSections: new Set(),
  selectedSections: new Set(),
  selectedCriteria: new Set(),
  
  // Loading states
  isLoading: {
    blueprints: false,
    sections: false,
    criteria: false,
    questions: false,
    mastery: false,
    pathways: false,
  },
  
  // Error states
  errors: {
    blueprints: null,
    sections: null,
    criteria: null,
    questions: null,
    mastery: null,
    pathways: null,
  },
};

// Create the store
export const useBlueprintStore = create<BlueprintStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Blueprint management
        setCurrentBlueprint: (blueprint) =>
          set({ currentBlueprint: blueprint }, false, 'setCurrentBlueprint'),
        
        setCurrentSection: (section) =>
          set({ currentSection: section }, false, 'setCurrentSection'),
        
        setCurrentCriterion: (criterion) =>
          set({ currentCriterion: criterion }, false, 'setCurrentCriterion'),
        
        // Data setters
        setBlueprints: (blueprints) =>
          set({ blueprints }, false, 'setBlueprints'),
        
        setSections: (sections) =>
          set({ sections }, false, 'setSections'),
        
        setCriteria: (criteria) =>
          set({ criteria }, false, 'setCriteria'),
        
        setQuestions: (questions) =>
          set({ questions }, false, 'setQuestions'),
        
        setMasteryTracking: (tracking) =>
          set({ masteryTracking: tracking }, false, 'setMasteryTracking'),
        
        setUueProgressions: (progressions) =>
          set({ uueProgressions: progressions }, false, 'setUueProgressions'),
        
        setLearningPathways: (pathways) =>
          set({ learningPathways: pathways }, false, 'setLearningPathways'),
        
        setCurrentPathway: (pathway) =>
          set({ currentPathway: pathway }, false, 'setCurrentPathway'),
        
        // Data updates
        addBlueprint: (blueprint) =>
          set(
            (state) => ({ blueprints: [...state.blueprints, blueprint] }),
            false,
            'addBlueprint'
          ),
        
        updateBlueprint: (id, updates) =>
          set(
            (state) => ({
              blueprints: state.blueprints.map((bp) =>
                bp.id === id ? { ...bp, ...updates } : bp
              ),
            }),
            false,
            'updateBlueprint'
          ),
        
        removeBlueprint: (id) =>
          set(
            (state) => ({
              blueprints: state.blueprints.filter((bp) => bp.id !== id),
            }),
            false,
            'removeBlueprint'
          ),
        
        addSection: (section) =>
          set(
            (state) => ({ sections: [...state.sections, section] }),
            false,
            'addSection'
          ),
        
        updateSection: (id, updates) =>
          set(
            (state) => ({
              sections: state.sections.map((s) =>
                s.id === id ? { ...s, ...updates } : s
              ),
            }),
            false,
            'updateSection'
          ),
        
        removeSection: (id) =>
          set(
            (state) => ({
              sections: state.sections.filter((s) => s.id !== id),
            }),
            false,
            'removeSection'
          ),
        
        addCriterion: (criterion) =>
          set(
            (state) => ({ criteria: [...state.criteria, criterion] }),
            false,
            'addCriterion'
          ),
        
        updateCriterion: (id, updates) =>
          set(
            (state) => ({
              criteria: state.criteria.map((c) =>
                c.id === id ? { ...c, ...updates } : c
              ),
            }),
            false,
            'updateCriterion'
          ),
        
        removeCriterion: (id) =>
          set(
            (state) => ({
              criteria: state.criteria.filter((c) => c.id !== id),
            }),
            false,
            'removeCriterion'
          ),
        
        addQuestion: (question) =>
          set(
            (state) => ({ questions: [...state.questions, question] }),
            false,
            'addQuestion'
          ),
        
        updateQuestion: (id, updates) =>
          set(
            (state) => ({
              questions: state.questions.map((q) =>
                q.id === id ? { ...q, ...updates } : q
              ),
            }),
            false,
            'updateQuestion'
          ),
        
        removeQuestion: (id) =>
          set(
            (state) => ({
              questions: state.questions.filter((q) => q.id !== id),
            }),
            false,
            'removeQuestion'
          ),
        
        updateMasteryTracking: (id, updates) =>
          set(
            (state) => ({
              masteryTracking: state.masteryTracking.map((mt) =>
                mt.id === id ? { ...mt, ...updates } : mt
              ),
            }),
            false,
            'updateMasteryTracking'
          ),
        
        updateUueProgression: (id, updates) =>
          set(
            (state) => ({
              uueProgressions: state.uueProgressions.map((up) =>
                up.id === id ? { ...up, ...updates } : up
              ),
            }),
            false,
            'updateUueProgression'
          ),
        
        // UI state management
        toggleSectionExpansion: (sectionId) =>
          set(
            (state) => {
              const newExpanded = new Set(state.expandedSections);
              if (newExpanded.has(sectionId)) {
                newExpanded.delete(sectionId);
              } else {
                newExpanded.add(sectionId);
              }
              return { expandedSections: newExpanded };
            },
            false,
            'toggleSectionExpansion'
          ),
        
        setSectionExpanded: (sectionId, expanded) =>
          set(
            (state) => {
              const newExpanded = new Set(state.expandedSections);
              if (expanded) {
                newExpanded.add(sectionId);
              } else {
                newExpanded.delete(sectionId);
              }
              return { expandedSections: newExpanded };
            },
            false,
            'setSectionExpanded'
          ),
        
        setExpandedSections: (sectionIds) =>
          set({ expandedSections: new Set(sectionIds) }, false, 'setExpandedSections'),
        
        collapseAllSections: () =>
          set({ expandedSections: new Set() }, false, 'collapseAllSections'),
        
        expandAllSections: () =>
          set(
            (state) => ({
              expandedSections: new Set(state.sections.map((s) => s.id)),
            }),
            false,
            'expandAllSections'
          ),
        
        toggleSectionSelection: (sectionId) =>
          set(
            (state) => {
              const newSelected = new Set(state.selectedSections);
              if (newSelected.has(sectionId)) {
                newSelected.delete(sectionId);
              } else {
                newSelected.add(sectionId);
              }
              return { selectedSections: newSelected };
            },
            false,
            'toggleSectionSelection'
          ),
        
        setSectionSelection: (sectionIds) =>
          set({ selectedSections: new Set(sectionIds) }, false, 'setSectionSelection'),
        
        clearSectionSelection: () =>
          set({ selectedSections: new Set() }, false, 'clearSectionSelection'),
        
        toggleCriterionSelection: (criterionId) =>
          set(
            (state) => {
              const newSelected = new Set(state.selectedCriteria);
              if (newSelected.has(criterionId)) {
                newSelected.delete(criterionId);
              } else {
                newSelected.add(criterionId);
              }
              return { selectedCriteria: newSelected };
            },
            false,
            'toggleCriterionSelection'
          ),
        
        setCriterionSelection: (criterionIds) =>
          set({ selectedCriteria: new Set(criterionIds) }, false, 'setCriterionSelection'),
        
        clearCriterionSelection: () =>
          set({ selectedCriteria: new Set() }, false, 'clearCriterionSelection'),
        
        // Loading state management
        setLoading: (key, loading) =>
          set(
            (state) => ({
              isLoading: { ...state.isLoading, [key]: loading },
            }),
            false,
            'setLoading'
          ),
        
        setError: (key, error) =>
          set(
            (state) => ({
              errors: { ...state.errors, [key]: error },
            }),
            false,
            'setError'
          ),
        
        clearErrors: () =>
          set({ errors: initialState.errors }, false, 'clearErrors'),
        
        // Utility actions
        getSectionById: (id) => {
          const state = get();
          return state.sections.find((s) => s.id === id);
        },
        
        getCriterionById: (id) => {
          const state = get();
          return state.criteria.find((c) => c.id === id);
        },
        
        getQuestionById: (id) => {
          const state = get();
          return state.questions.find((q) => q.id === id);
        },
        
        getMasteryTrackingById: (id) => {
          const state = get();
          return state.masteryTracking.find((mt) => mt.id === id);
        },
        
        getSectionsByParent: (parentId) => {
          const state = get();
          return state.sections.filter((s) => s.parentSectionId === parentId);
        },
        
        getCriteriaBySection: (sectionId) => {
          const state = get();
          return state.criteria.filter((c) => c.sectionId === sectionId);
        },
        
        getQuestionsByCriterion: (criterionId) => {
          const state = get();
          return state.questions.filter((q) => q.criterionId === criterionId);
        },
        
        getSectionsByBlueprint: (blueprintId) => {
          const state = get();
          return state.sections.filter((s) => s.blueprintId === blueprintId);
        },
        
        getCriteriaByBlueprint: (blueprintId) => {
          const state = get();
          return state.criteria.filter((c) => c.blueprintId === blueprintId);
        },
        
        getQuestionsByBlueprint: (blueprintId) => {
          const state = get();
          return state.questions.filter((q) => q.blueprintId === blueprintId);
        },
        
        // Reset actions
        resetCurrentContext: () =>
          set(
            {
              currentBlueprint: null,
              currentSection: null,
              currentCriterion: null,
              expandedSections: new Set(),
              selectedSections: new Set(),
              selectedCriteria: new Set(),
            },
            false,
            'resetCurrentContext'
          ),
        
        resetAllData: () =>
          set(initialState, false, 'resetAllData'),
      }),
      {
        name: 'blueprint-store',
        partialize: (state) => ({
          // Only persist UI state and current context, not the full data
          expandedSections: Array.from(state.expandedSections),
          selectedSections: Array.from(state.selectedSections),
          selectedCriteria: Array.from(state.selectedCriteria),
          currentBlueprint: state.currentBlueprint,
          currentSection: state.currentSection,
          currentCriterion: state.currentCriterion,
        }),
        onRehydrateStorage: () => (state) => {
          // Convert arrays back to Sets after rehydration
          if (state) {
            state.expandedSections = new Set(state.expandedSections || []);
            state.selectedSections = new Set(state.selectedSections || []);
            state.selectedCriteria = new Set(state.selectedCriteria || []);
          }
        },
      }
    ),
    {
      name: 'blueprint-store',
    }
  )
);

// Selector hooks for common state combinations
export const useBlueprintSelectors = () => {
  const store = useBlueprintStore();
  
  return {
    // Current context selectors
    currentBlueprint: store.currentBlueprint,
    currentSection: store.currentSection,
    currentCriterion: store.currentCriterion,
    
    // Data selectors
    blueprints: store.blueprints,
    sections: store.sections,
    criteria: store.criteria,
    questions: store.questions,
    masteryTracking: store.masteryTracking,
    uueProgressions: store.uueProgressions,
    learningPathways: store.learningPathways,
    currentPathway: store.currentPathway,
    
    // UI state selectors
    expandedSections: store.expandedSections,
    selectedSections: store.selectedSections,
    selectedCriteria: store.selectedCriteria,
    
    // Loading state selectors
    isLoading: store.isLoading,
    errors: store.errors,
    
    // Computed selectors
    currentBlueprintSections: store.currentBlueprint
      ? store.getSectionsByBlueprint(store.currentBlueprint.id)
      : [],
    currentSectionCriteria: store.currentSection
      ? store.getCriteriaBySection(store.currentSection.id)
      : [],
    currentCriterionQuestions: store.currentCriterion
      ? store.getQuestionsByCriterion(store.currentCriterion.id)
      : [],
  };
};

// Action hooks for common operations
export const useBlueprintActions = () => {
  const store = useBlueprintStore();
  
  return {
    // Context management
    setCurrentBlueprint: store.setCurrentBlueprint,
    setCurrentSection: store.setCurrentSection,
    setCurrentCriterion: store.setCurrentCriterion,
    
    // Data management
    setBlueprints: store.setBlueprints,
    setSections: store.setSections,
    setCriteria: store.setCriteria,
    setQuestions: store.setQuestions,
    setMasteryTracking: store.setMasteryTracking,
    setUueProgressions: store.setUueProgressions,
    setLearningPathways: store.setLearningPathways,
    setCurrentPathway: store.setCurrentPathway,
    
    // Data updates
    addBlueprint: store.addBlueprint,
    updateBlueprint: store.updateBlueprint,
    removeBlueprint: store.removeBlueprint,
    addSection: store.addSection,
    updateSection: store.updateSection,
    removeSection: store.removeSection,
    addCriterion: store.addCriterion,
    updateCriterion: store.updateCriterion,
    removeCriterion: store.removeCriterion,
    addQuestion: store.addQuestion,
    updateQuestion: store.updateQuestion,
    removeQuestion: store.removeQuestion,
    updateMasteryTracking: store.updateMasteryTracking,
    updateUueProgression: store.updateUueProgression,
    
    // UI management
    toggleSectionExpansion: store.toggleSectionExpansion,
    setSectionExpanded: store.setSectionExpanded,
    setExpandedSections: store.setExpandedSections,
    collapseAllSections: store.collapseAllSections,
    expandAllSections: store.expandAllSections,
    toggleSectionSelection: store.toggleSectionSelection,
    setSectionSelection: store.setSectionSelection,
    clearSectionSelection: store.clearSectionSelection,
    toggleCriterionSelection: store.toggleCriterionSelection,
    setCriterionSelection: store.setCriterionSelection,
    clearCriterionSelection: store.clearCriterionSelection,
    
    // State management
    setLoading: store.setLoading,
    setError: store.setError,
    clearErrors: store.clearErrors,
    
    // Utility actions
    getSectionById: store.getSectionById,
    getCriterionById: store.getCriterionById,
    getQuestionById: store.getQuestionById,
    getMasteryTrackingById: store.getMasteryTrackingById,
    getSectionsByParent: store.getSectionsByParent,
    getCriteriaBySection: store.getCriteriaBySection,
    getQuestionsByCriterion: store.getQuestionsByCriterion,
    getSectionsByBlueprint: store.getSectionsByBlueprint,
    getCriteriaByBlueprint: store.getCriteriaByBlueprint,
    getQuestionsByBlueprint: store.getQuestionsByBlueprint,
    
    // Reset actions
    resetCurrentContext: store.resetCurrentContext,
    resetAllData: store.resetAllData,
  };
};





