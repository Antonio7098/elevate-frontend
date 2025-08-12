# Sprint 58: Frontend Blueprint-Centric Foundation

**Signed off** DO NOT PROCEED UNLESS SIGNED OFF BY ANTONIO
**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Frontend - Foundation for Blueprint-Centric Architecture Transformation
**Overview:** Establish the foundational infrastructure for the frontend blueprint-centric transformation. Create new type definitions, service layer, and basic UI components to replace the existing folder-based system with the new section-based organization.

---

## I. Sprint Goals & Objectives

### Primary Goals:
1. **Create new type definitions** to replace folder/questionSet/question with blueprintSection/masteryCriterion/questionInstance
2. **Implement new service layer** for blueprint-centric operations (sections, criteria, mastery tracking)
3. **Build foundation UI components** for section hierarchy and basic blueprint management
4. **Establish data flow architecture** between new services and components

### Success Criteria:
- All new type definitions created and validated
- New service layer functional with Core API integration
- Basic section hierarchy components rendering correctly
- Foundation architecture ready for enhanced component development
- Type safety maintained throughout the new system

---

## I. Planned Tasks & To-Do List (Derived from Frontend Transformation Requirements)

*Instructions for Antonio: Review the comprehensive frontend transformation requirements for the blueprint-centric system. Break down each distinct step or deliverable into a checkable to-do item below. Be specific.*

- [ ] **Task 1:** Create new type definitions for blueprint-centric system
    - *Sub-task 1.1:* Create `src/types/blueprintSection.ts` to replace `folder.ts`
    - *Sub-task 1.2:* Create `src/types/masteryCriterion.ts` to replace `questionSet.ts`
    - *Sub-task 1.3:* Create `src/types/questionInstance.ts` to replace `question.ts`
    - *Sub-task 1.4:* Create `src/types/masteryTracking.ts` for new mastery system
    - *Sub-task 1.5:* Create `src/types/uueStage.ts` for UUE stage progression
    - *Sub-task 1.6:* Create `src/types/learningPathways.ts` for learning path discovery
- [ ] **Task 2:** Implement new service layer for blueprint-centric operations
    - *Sub-task 2.1:* Create `src/services/blueprintSectionService.ts` to replace `folderService.ts`
    - *Sub-task 2.2:* Create `src/services/masteryCriterionService.ts` to replace `questionSetService.ts`
    - *Sub-task 2.3:* Create `src/services/questionInstanceService.ts` to replace `questionService.ts`
    - *Sub-task 2.4:* Create `src/services/masteryTrackingService.ts` for new mastery tracking
    - *Sub-task 2.5:* Create `src/services/learningPathwaysService.ts` for path discovery
    - *Sub-task 2.6:* Update `src/services/apiClient.ts` for new API endpoints
- [ ] **Task 3:** Create foundation UI components for section hierarchy
    - *Sub-task 3.1:* Create `src/components/sections/SectionTreeItem.tsx` for individual section rendering
    - *Sub-task 3.2:* Create `src/components/sections/SectionHierarchyTree.tsx` for section tree display
    - *Sub-task 3.3:* Create `src/components/sections/SectionHeader.tsx` for section information display
    - *Sub-task 3.4:* Create `src/components/sections/SectionActions.tsx` for section management actions
    - *Sub-task 3.5:* Create `src/components/sections/SectionProgress.tsx` for section progress visualization
    - *Sub-task 3.6:* Create `src/components/sections/SectionModal.tsx` for section creation/editing
- [ ] **Task 4:** Build basic blueprint management components
    - *Sub-task 4.1:* Create `src/components/blueprints/BlueprintSelector.tsx` for blueprint selection
    - *Sub-task 4.2:* Create `src/components/blueprints/BlueprintHeader.tsx` for blueprint information
    - *Sub-task 4.3:* Create `src/components/blueprints/BlueprintStats.tsx` for blueprint statistics
    - *Sub-task 4.4:* Create `src/components/blueprints/BlueprintActions.tsx` for blueprint management
    - *Sub-task 4.5:* Create `src/components/blueprints/BlueprintModal.tsx` for blueprint creation/editing
    - *Sub-task 4.6:* Create `src/components/blueprints/BlueprintProgress.tsx` for overall progress
- [ ] **Task 5:** Implement basic mastery tracking components
    - *Sub-task 5.1:* Create `src/components/mastery/MasteryProgressBar.tsx` for progress visualization
    - *Sub-task 5.2:* Create `src/components/mastery/MasteryCriterionCard.tsx` for criterion display
    - *Sub-task 5.3:* Create `src/components/mastery/MasteryCriterionGrid.tsx` for criteria grid layout
    - *Sub-task 5.4:* Create `src/components/mastery/MasteryThresholdSettings.tsx` for threshold customization
    - *Sub-task 5.5:* Create `src/components/mastery/MasteryStats.tsx` for mastery statistics
    - *Sub-task 5.6:* Create `src/components/mastery/MasteryModal.tsx` for mastery management
- [ ] **Task 6:** Create UUE stage progression foundation
    - *Sub-task 6.1:* Create `src/components/uue/UueStageProgressBar.tsx` for stage progression
    - *Sub-task 6.2:* Create `src/components/uue/UueStageIndicator.tsx` for current stage display
    - *Sub-task 6.3:* Create `src/components/uue/UueStageNavigation.tsx` for stage navigation
    - *Sub-task 6.4:* Create `src/components/uue/UueStageRequirements.tsx` for stage requirements
    - *Sub-task 6.5:* Create `src/components/uue/UueStagePreview.tsx` for next stage preview
    - *Sub-task 6.6:* Create `src/components/uue/UueStageModal.tsx` for stage management
- [ ] **Task 7:** Set up data flow architecture and state management
    - *Sub-task 7.1:* Create `src/context/BlueprintContext.tsx` for blueprint state management
    - *Sub-task 7.2:* Create `src/context/SectionContext.tsx` for section state management
    - *Sub-task 7.3:* Create `src/context/MasteryContext.tsx` for mastery state management
    - *Sub-task 7.4:* Create `src/hooks/useBlueprint.ts` for blueprint operations
    - *Sub-task 7.5:* Create `src/hooks/useSection.ts` for section operations
    - *Sub-task 7.6:* Create `src/hooks/useMastery.ts` for mastery operations
- [ ] **Task 8:** Implement basic routing and navigation structure
    - *Sub-task 8.1:* Create `src/routes/blueprintRoutes.tsx` for blueprint navigation
    - *Sub-task 8.2:* Create `src/routes/sectionRoutes.tsx` for section navigation
    - *Sub-task 8.3:* Create `src/routes/masteryRoutes.tsx` for mastery navigation
    - *Sub-task 8.4:* Update `src/AppRoutes.tsx` to include new routes
    - *Sub-task 8.5:* Create route guards for blueprint access control
    - *Sub-task 8.6:* Implement breadcrumb navigation for section hierarchy
- [ ] **Task 9:** Create foundation page structure
    - *Sub-task 9.1:* Create `src/pages/BlueprintSectionsPage.tsx` to replace `FoldersPage.tsx`
    - *Sub-task 9.2:* Create `src/pages/BlueprintDetailPage.tsx` for blueprint overview
    - *Sub-task 9.3:* Create `src/pages/SectionDetailPage.tsx` for section details
    - *Sub-task 9.4:* Create `src/pages/MasteryTrackingPage.tsx` for mastery overview
    - *Sub-task 9.5:* Create `src/pages/UueStagePage.tsx` for UUE stage management
    - *Sub-task 9.6:* Create `src/pages/LearningPathwaysPage.tsx` for pathway discovery
- [ ] **Task 10:** Implement comprehensive testing foundation
    - *Sub-task 10.1:* Create unit tests for all new type definitions
    - *Sub-task 10.2:* Create unit tests for all new service methods
    - *Sub-task 10.3:* Create unit tests for all new UI components
    - *Sub-task 10.4:* Create integration tests for service-API interactions
    - *Sub-task 10.5:* Create component tests for UI interactions
    - *Sub-task 10.6:* Set up testing utilities and mock data for blueprint system

---

## II. Agent's Implementation Summary & Notes

*Instructions for AI Agent (Cascade): For each planned task you complete from Section I, please provide a summary below. If multiple tasks are done in one go, you can summarize them together but reference the task numbers.*

**Regarding Task 1: [Create new type definitions for blueprint-centric system]**
* **Summary of Implementation:**
    * [Agent describes what was built/changed, key functions created/modified, logic implemented]
* **Key Files Modified/Created:**
    * `src/types/blueprintSection.ts`
    * `src/types/masteryCriterion.ts`
    * `src/types/questionInstance.ts`
    * `src/types/masteryTracking.ts`
    * `src/types/uueStage.ts`
    * `src/types/learningPathways.ts`
* **Notes/Challenges Encountered (if any):**
    * [Agent notes any difficulties, assumptions made, or alternative approaches taken]

**Regarding Task 2: [Implement new service layer for blueprint-centric operations]**
* **Summary of Implementation:**
    * [...]
* **Key Files Modified/Created:**
    * [...]
* **Notes/Challenges Encountered (if any):**
    * [...]

**(Agent continues for all completed tasks...)**

---

## III. Overall Sprint Summary & Review (To be filled out by Antonio after work is done)

**1. Key Accomplishments this Sprint:**
    * [List what was successfully completed and tested]
    * [Highlight major breakthroughs or features implemented]

**2. Deviations from Original Plan/Prompt (if any):**
    * [Describe any tasks that were not completed, or were changed from the initial plan. Explain why.]
    * [Note any features added or removed during the sprint.]

**3. New Issues, Bugs, or Challenges Encountered:**
    * [List any new bugs found, unexpected technical hurdles, or unresolved issues.]

**4. Key Learnings & Decisions Made:**
    * [What did you learn during this sprint? Any important architectural or design decisions made?]

**5. Blockers (if any):**
    * [Is anything preventing progress on the next steps?]

**6. Next Steps Considered / Plan for Next Sprint:**
    * [Briefly outline what seems logical to tackle next based on this sprint's outcome.]

**Sprint Status:** [e.g., Fully Completed, Partially Completed - X tasks remaining, Completed with modifications, Blocked]

---

## IV. Technical Architecture Details

### A. New Type System Architecture

#### 1. BlueprintSection Types
```typescript
export interface BlueprintSection {
  id: string;
  title: string;
  description?: string;
  blueprintId: string;
  parentSectionId?: string;
  depth: number;
  orderIndex: number;
  difficulty: DifficultyLevel;
  estimatedTimeMinutes?: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  children: BlueprintSection[];
  notes: NoteSection[];
  knowledgePrimitives: KnowledgePrimitive[];
  masteryCriteria: MasteryCriterion[];
  
  // Computed fields
  masteryProgress?: MasteryProgress;
  contentCount?: number;
  isExpanded?: boolean;
}
```

#### 2. MasteryCriterion Types
```typescript
export interface MasteryCriterion {
  id: string;
  title: string;
  description?: string;
  weight: number;
  uueStage: UueStage;
  complexityScore?: number;
  knowledgePrimitiveId: string;
  blueprintSectionId: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  questionInstances: QuestionInstance[];
  userCriterionMasteries: UserCriterionMastery[];
  
  // Computed fields
  masteryProgress?: CriterionMasteryProgress;
  nextReviewAt?: string;
  isDue?: boolean;
}
```

### B. Service Layer Architecture

#### 1. BlueprintSectionService
```typescript
export class BlueprintSectionService {
  async createSection(data: CreateSectionData): Promise<BlueprintSection>;
  async getSection(id: string): Promise<BlueprintSection>;
  async getSectionTree(blueprintId: string): Promise<SectionHierarchy>;
  async moveSection(sectionId: string, newParentId: string | null): Promise<BlueprintSection>;
  async reorderSections(blueprintId: string, orderData: SectionOrderData[]): Promise<void>;
  async getSectionContent(sectionId: string): Promise<SectionContent>;
  async getSectionStats(sectionId: string): Promise<SectionStats>;
}
```

#### 2. MasteryCriterionService
```typescript
export class MasteryCriterionService {
  async createCriterion(data: CreateCriterionData): Promise<MasteryCriterion>;
  async getCriterion(id: string): Promise<MasteryCriterion>;
  async processCriterionReview(userId: number, criterionId: string, isCorrect: boolean, performance: PerformanceData): Promise<MasteryUpdateResult>;
  async calculateCriterionMastery(criterionId: string, userId: number): Promise<CriterionMasteryResult>;
  async getCriteriaByUueStage(sectionId: string, uueStage: UueStage): Promise<MasteryCriterion[]>;
  async canProgressToNextUueStage(userId: number, criterionId: string): Promise<boolean>;
}
```

### C. Component Architecture

#### 1. Section Hierarchy Components
```typescript
// SectionTreeItem - Individual section rendering
interface SectionTreeItemProps {
  section: BlueprintSection;
  depth: number;
  isExpanded: boolean;
  onToggleExpand: (sectionId: string) => void;
  onSectionClick: (sectionId: string) => void;
  masteryProgress?: MasteryProgress;
}

// SectionHierarchyTree - Complete section tree
interface SectionHierarchyTreeProps {
  sections: BlueprintSection[];
  hierarchy: SectionHierarchy;
  expandedSections: Set<string>;
  onToggleSection: (sectionId: string) => void;
  onSectionClick: (sectionId: string) => void;
  onSectionMove: (sectionId: string, newParentId: string | null) => void;
  onSectionReorder: (blueprintId: string, orderData: SectionOrderData[]) => void;
}
```

#### 2. Mastery Tracking Components
```typescript
// MasteryProgressBar - Progress visualization
interface MasteryProgressBarProps {
  progress: MasteryProgress;
  showDetails?: boolean;
  onProgressClick?: (progress: MasteryProgress) => void;
}

// MasteryCriterionCard - Individual criterion display
interface MasteryCriterionCardProps {
  criterion: MasteryCriterion;
  masteryProgress?: CriterionMasteryProgress;
  onCriterionClick: (criterion: MasteryCriterion) => void;
  onStartReview: (criterion: MasteryCriterion) => void;
}
```

---

## V. Dependencies & Risks

### A. Dependencies
- **Core API Sprints 50-57**: Must be complete for API integration
- **TypeScript Configuration**: Proper configuration for new type system
- **Testing Framework**: Jest/React Testing Library setup for new components

### B. Risks & Mitigation
1. **Type System Complexity Risk**: New types might be too complex
   - **Mitigation**: Start with simple types, iterate and enhance gradually
2. **Service Integration Risk**: Services might not integrate well with Core API
   - **Mitigation**: Comprehensive testing, clear error handling, fallback strategies
3. **Component Architecture Risk**: Component structure might not scale well
   - **Mitigation**: Modular design, clear separation of concerns, performance testing

---

## VI. Testing Strategy

### A. Unit Tests
- [ ] All new type definitions with validation
- [ ] All service methods with mocked API responses
- [ ] All UI components with mocked props and interactions
- [ ] Custom hooks with mocked dependencies

### B. Integration Tests
- [ ] Service-API integration with real endpoints
- [ ] Component-service integration with mocked services
- [ ] State management integration with context providers

### C. Component Tests
- [ ] User interactions and event handling
- [ ] Props validation and error handling
- [ ] Accessibility compliance (ARIA labels, keyboard navigation)

---

## VII. Deliverables

### A. Code Deliverables
- [ ] Complete new type system for blueprint-centric architecture
- [ ] Functional service layer for all blueprint operations
- [ ] Foundation UI components for section hierarchy and mastery tracking
- [ ] Basic routing and navigation structure
- [ ] State management architecture with React Context

### B. Documentation Deliverables
- [ ] Type system documentation and usage examples
- [ ] Service layer API documentation
- [ ] Component architecture and usage guidelines
- [ ] State management patterns and best practices

### C. Testing Deliverables
- [ ] Comprehensive test suite for all new components
- [ ] Service integration test results
- [ ] Component interaction test coverage
- [ ] Performance benchmarks for new components

---

## VIII. Success Metrics

### A. Functional Metrics
- [ ] 100% of new types created and validated
- [ ] All new services functional with Core API
- [ ] All foundation components rendering correctly
- [ ] Basic navigation and routing working

### B. Quality Metrics
- [ ] Type safety maintained throughout new system
- [ ] Component test coverage >90%
- [ ] Service test coverage >95%
- [ ] No critical bugs in foundation components

### C. Performance Metrics
- [ ] Component render times <50ms
- [ ] Service response times <100ms
- [ ] Bundle size increase <20%
- [ ] Memory usage optimized for new components

---

## IX. Sprint Retrospective

**Sprint Status:** [To be filled out after completion]

**What Went Well:**
- [List successful implementations and achievements]

**What Could Be Improved:**
- [List areas for improvement and lessons learned]

**Action Items for Next Sprint:**
- [List next steps and future improvements]

**Team Velocity:** [X] story points completed (out of [Y] planned)

