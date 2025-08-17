# Sprint 60: Frontend Multi-Primitive Mastery Criteria UI

**Signed off** DO NOT PROCEED UNLESS SIGNED OFF BY ANTONIO
**Date Range:** [Start Date] - [End Date]
**Primary Focus:** Frontend - Update PathwaysPage and related components for multi-primitive mastery criteria
**Overview:** Transform the frontend interface to support the new multi-primitive mastery criteria system, enabling users to create, manage, and visualize complex learning relationships between multiple knowledge primitives.

---

## I. Sprint Goals & Objectives

### Primary Goals:
1. Update PathwaysPage.tsx and related components for multi-primitive criteria
2. Enhance mastery criterion creation/editing forms for multiple primitives
3. Improve mind map visualization for complex relationships
4. Add relationship management interface
5. Ensure backward compatibility with existing single-primitive criteria

### Success Criteria:
- Users can create mastery criteria linked to multiple primitives
- Relationship types and weights can be configured
- Mind map shows multi-primitive relationships clearly
- Forms support both single and multi-primitive criteria
- All existing functionality remains intact
- UI is intuitive and responsive

---

## II. Planned Tasks & To-Do List

### **Task 1: Component Updates**
- [ ] **Sub-task 1.1:** Update `PathwaysPage.tsx` for multi-primitive criteria
  - Modify data structures to support multiple primitives
  - Update criterion display to show linked primitives
  - Add primitive relationship visualization
  - Update progress tracking for multi-primitive criteria

- [ ] **Sub-task 1.2:** Modify `PathwaysSidebar.tsx` for enhanced criteria display
  - Show primitive count per criterion
  - Display relationship strength indicators
  - Add complexity level indicators
  - Enhance navigation for complex criteria

- [ ] **Sub-task 1.3:** Update `MindMapView.tsx` for multi-primitive visualization
  - Show multiple primitive connections per criterion
  - Add relationship strength visualization
  - Implement relationship type indicators
  - Add interactive relationship editing

- [ ] **Sub-task 1.4:** Enhance `MasteryDashboard.tsx` for complex criteria
  - Display multi-primitive progress tracking
  - Show relationship-based analytics
  - Add complexity progression indicators
  - Implement relationship strength metrics

### **Task 2: Form and Modal Updates**
- [ ] **Sub-task 2.1:** Update mastery criterion creation/editing forms
  - Add primitive selection interface
  - Implement relationship type selection
  - Add weight configuration for each primitive
  - Support both single and multi-primitive modes

- [ ] **Sub-task 2.2:** Add primitive selection interface
  - Create searchable primitive picker
  - Show primitive details and relationships
  - Add primitive preview functionality
  - Implement primitive filtering by section/blueprint

- [ ] **Sub-task 2.3:** Implement relationship type selection
  - Add relationship type dropdown (PRIMARY, SECONDARY, CONTEXTUAL)
  - Show relationship type descriptions
  - Implement relationship type validation
  - Add relationship type templates

- [ ] **Sub-task 2.4:** Add complexity scoring interface
  - Implement complexity level selection
  - Add automatic complexity calculation
  - Show complexity validation rules
  - Add complexity adjustment controls

### **Task 3: Visualization Enhancements**
- [ ] **Sub-task 3.1:** Update mind map to show multi-primitive relationships
  - Display multiple primitive nodes per criterion
  - Show relationship strength with line thickness
  - Add relationship type indicators
  - Implement relationship hover effects

- [ ] **Sub-task 3.2:** Enhance progress visualization for complex criteria
  - Show progress across multiple primitives
  - Add relationship-weighted progress calculation
  - Implement progress correlation visualization
  - Add progress prediction indicators

- [ ] **Sub-task 3.3:** Add relationship strength indicators
  - Visual strength indicators (color, thickness, opacity)
  - Strength adjustment controls
  - Strength validation feedback
  - Strength trend visualization

- [ ] **Sub-task 3.4:** Implement UUE stage progression visualization
  - Show stage progression with primitive relationships
  - Add stage transition indicators
  - Implement stage validation feedback
  - Add stage optimization suggestions

### **Task 4: User Experience Improvements**
- [ ] **Sub-task 4.1:** Add drag-and-drop primitive linking
  - Implement drag-and-drop for primitive selection
  - Add visual feedback during drag operations
  - Implement relationship creation via drag-and-drop
  - Add undo/redo for relationship changes

- [ ] **Sub-task 4.2:** Implement visual relationship editing
  - Add inline relationship editing
  - Implement relationship strength adjustment
  - Add relationship type changing
  - Implement relationship deletion

- [ ] **Sub-task 4.3:** Add relationship validation feedback
  - Show validation errors in real-time
  - Implement relationship conflict detection
  - Add circular dependency warnings
  - Provide relationship optimization suggestions

- [ ] **Sub-task 4.4:** Enhance mobile responsiveness
  - Optimize forms for mobile devices
  - Implement touch-friendly relationship editing
  - Add mobile-optimized mind map view
  - Ensure responsive design across devices

---

## III. Technical Details

### Component Architecture Updates

#### **Enhanced MasteryCriterion Interface**
```typescript
interface EnhancedMasteryCriterion {
  id: string;
  title: string;
  description?: string;
  weight: number;
  uueStage: UueStage;
  complexityLevel: ComplexityLevel;
  
  // Multi-primitive relationships
  linkedPrimitives: {
    primitiveId: string;
    relationshipType: PrimitiveRelationshipType;
    weight: number;
    strength: number;
    primitive: KnowledgePrimitive;
  }[];
  
  // Computed fields
  estimatedPrimitiveCount: number;
  relationshipComplexity: number;
  masteryProgress?: MultiPrimitiveProgress;
  
  // Legacy support
  knowledgePrimitiveId?: string; // For backward compatibility
}

enum PrimitiveRelationshipType {
  PRIMARY = 'PRIMARY',      // Core concept being tested
  SECONDARY = 'SECONDARY',  // Supporting concept
  CONTEXTUAL = 'CONTEXTUAL' // Background context
}

enum ComplexityLevel {
  BEGINNER = 'BEGINNER',     // 1-2 primitives
  INTERMEDIATE = 'INTERMEDIATE', // 2-4 primitives
  ADVANCED = 'ADVANCED',     // 4-6 primitives
  EXPERT = 'EXPERT'          // 6+ primitives
}
```

---

## IV. User Experience Enhancements

### **Drag and Drop Interface**
- Implement drag-and-drop for primitive selection
- Visual feedback during drag operations
- Relationship creation via drag-and-drop
- Undo/redo for relationship changes

### **Visual Relationship Editing**
- Inline relationship editing
- Relationship strength adjustment
- Relationship type changing
- Relationship deletion

### **Real-time Validation**
- Show validation errors in real-time
- Relationship conflict detection
- Circular dependency warnings
- Relationship optimization suggestions

### **Mobile Optimization**
- Touch-friendly relationship editing
- Responsive form layouts
- Mobile-optimized mind map view
- Gesture-based interactions

---

## V. Testing Strategy

### **Component Testing**
- Test multi-primitive criterion creation
- Test relationship management operations
- Test form validation logic
- Test backward compatibility

### **Integration Testing**
- Test API integration for multi-primitive operations
- Test data flow between components
- Test state management updates
- Test error handling scenarios

### **User Experience Testing**
- Test form usability and accessibility
- Test mind map interaction
- Test mobile responsiveness
- Test performance with large datasets

---

## VI. Risk Assessment & Mitigation

### **High Risk Items**
1. **Complexity**: Multi-primitive interface may be overwhelming
   - *Mitigation*: Progressive disclosure, clear visual hierarchy, user testing

2. **Performance**: Large relationship graphs may be slow
   - *Mitigation*: Virtualization, lazy loading, performance optimization

3. **Backward Compatibility**: Risk of breaking existing functionality
   - *Mitigation*: Feature flags, gradual rollout, comprehensive testing

### **Medium Risk Items**
1. **User Experience**: New interface may be confusing
   - *Mitigation*: User testing, clear documentation, help tooltips

2. **State Management**: Complex state may be difficult to manage
   - *Mitigation*: Clear state structure, proper error handling, testing

---

## VII. Success Metrics

### **Functional Metrics**
- [ ] Multi-primitive criteria can be created and edited
- [ ] Relationship management works correctly
- [ ] Mind map visualization is clear and interactive
- [ ] All existing functionality remains intact

### **User Experience Metrics**
- [ ] Forms are intuitive and easy to use
- [ ] Mind map is responsive and performant
- [ ] Mobile experience is optimized
- [ ] User testing feedback is positive

### **Quality Metrics**
- [ ] Code coverage > 90% for new functionality
- [ ] No critical bugs in production
- [ ] Performance meets targets
- [ ] Accessibility standards met

---

## VIII. Dependencies & Blockers

### **Dependencies**
- Backend multi-primitive API endpoints (Sprint 58)
- Updated data models and types
- Design system components for new UI elements

### **Blockers**
- None identified at this time

---

## IX. Next Steps

### **Immediate Next Steps (Next Sprint)**
1. Advanced relationship management features
2. Performance optimization for large datasets
3. Advanced analytics visualization
4. User feedback integration

### **Future Considerations**
1. AI-powered relationship suggestions
2. Advanced mind map interactions
3. Collaborative relationship editing
4. Integration with external tools

---

**Sprint Status:** [To be filled out by Antonio after work is done]
**Completion Date:** [To be filled out by Antonio after work is done]
**Notes:** [To be filled out by Antonio after work is done]
