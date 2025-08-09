# Sprint 23: Blueprint Mind Map Visualization

## Goal
To allow users to visualize and edit their Learning Blueprints as interactive mind maps.

## User Stories

- **As a user, I want to view my Learning Blueprint as a mind map.**
  - **Acceptance Criteria:**
    - I can navigate to `/blueprints/:id/mindmap` and see a rendered mind map for the selected blueprint.
    - Sections and knowledge primitives (propositions, entities, processes) are represented as nodes; relationships are represented as edges.
    - The layout is readable with auto-fit-to-view and zoom/pan controls; a mini-map is available.
    - Performance: for at least 300 nodes / 600 edges on a mid-tier laptop, pan/zoom remains smooth (target ≥ 55fps) and interactions remain responsive.
    - Accessibility: nodes have labels announced to screen readers; focus order is logical; keyboard navigation for node selection and zoom in/out works.
    - Cross-browser: latest Chrome/Firefox/Edge supported; minimum viewport 1280px wide renders correctly.

- **As a user, I want to edit my Learning Blueprint directly from the mind map.**
  - **Acceptance Criteria:**
    - I can inline-edit node title/description (Enter to save, Esc to cancel) with validation (non-empty title, max length 120 chars).
    - I can add/delete nodes and edges; deleting a node with children/edges shows a confirmation and supports batch deletion of its subtree.
    - I can connect nodes by dragging to create edges; duplicate edges are prevented; optional DAG enforcement for certain relation types.
    - Undo/redo stack supports at least 20 steps.
    - Saving: autosave is debounced (1–2s) with a visible saving indicator; explicit Save button available; failed saves show an error toast with retry.
    - Changes persist: after reload, I see my saved edits reflected in the mind map.

## Technical Tasks

### Backend (API)

1.  **Create API Endpoint to Fetch Blueprint Data**:
    - `GET /api/blueprints/:id/mindmap`
    - This endpoint will retrieve the `LearningBlueprint` and format the `blueprintJson` into a structure suitable for a mind map library (e.g., nodes and edges).

2.  **Create API Endpoint to Update Blueprint Data**:
    - `PUT /api/blueprints/:id/mindmap`
    - This endpoint will receive updated mind map data (nodes and edges) and update the `blueprintJson` in the `LearningBlueprint` record.

### Types and API Contracts

Define a stable schema for nodes, edges, and payloads (versioned for forward-compatibility):

```json
// GET /api/blueprints/:id/mindmap (200)
{
  "blueprintId": "bp_123",
  "version": 1,
  "nodes": [
    {
      "id": "n1",
      "type": "section|proposition|entity|process|group",
      "data": { "title": "String", "description": "String?", "primitiveType": "String?" },
      "position": { "x": 0, "y": 0 },
      "parentId": "n_parent?"
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "n1",
      "target": "n2",
      "type": "default|bezier|smoothstep|straight",
      "data": { "relationType": "prereq|part-of|causes|custom" }
    }
  ],
  "metadata": { "createdAt": "ISO", "updatedAt": "ISO" }
}
```

```json
// PUT /api/blueprints/:id/mindmap (request)
{
  "version": 1,
  "nodes": [ /* same schema as above */ ],
  "edges": [ /* same schema as above */ ]
}
```

Key invariants:
- Node and edge `id` are unique per blueprint.
- `source` and `target` must reference existing node ids.
- Duplicate edges are not allowed; cycles may be disallowed for specific relation types (configurable on server).
- Server validates schema and authorization (owner/collaborator can edit; viewers read-only).

### Frontend

1.  **Create TypeScript Types**:
    - Create `src/types/blueprint.types.ts` to define the interfaces for `LearningBlueprint`, `KnowledgePrimitive`, `MasteryCriterion`, and other related models.

2.  **Create Blueprint Service**:
    - Create `src/services/blueprintService.ts` with functions to fetch and update the blueprint mind map data from the API.

3.  **Create Mind Map Page**:
    - Create `src/pages/BlueprintMindmapPage.tsx`.
    - This page will use a library like `React Flow` to render the mind map.

4.  **Add Routing**:
    - Add a new route in `src/AppRoutes.tsx` for `/blueprints/:id/mindmap` that points to the `BlueprintMindmapPage`.

5.  **Implement Mind Map Visualization**:
    - Fetch blueprint data using the `blueprintService`.
    - Transform the data into nodes and edges for `React Flow`.
    - Render the mind map.

6.  **Implement Editing Functionality**:
    - Enable editing of node labels.
    - Add buttons or context menus to add/delete nodes and edges.
    - On change, call the `blueprintService` to save the updated mind map structure to the backend.

7. **Frontend Architecture**:
   - Use React Flow (`useNodesState`, `useEdgesState`) for rendering; maintain a domain store (e.g., Zustand) for history (undo/redo), dirty-state, and autosave timer.
   - Create pure transformers: `blueprintJson -> { nodes, edges }` and `mindmap -> blueprintJson` with unit tests.
   - Add layout utilities: fit view, mini-map, zoom to selection; expose auto-layout action.

8. **Editing Semantics**:
   - Inline edit: Enter saves, Esc cancels; form validation on title.
   - Autosave debounced (1–2s) + explicit Save; show saving/saved/error indicators; optimistic updates with retry/backoff.
   - Delete confirmations for nodes with children/edges; subtree deletion supported.
   - Undo/redo depth ≥ 20 steps; keyboard shortcuts for undo/redo.

9. **Constraints & Validation**:
   - Prevent duplicate edges; configurable DAG enforcement for `prereq` relations.
   - Validate non-empty titles; sanitize strings; enforce max lengths.
   - Server rejects invalid references and unauthorized edits.

10. **Testing & Definition of Done (DoD)**:
   - Unit: transformers, validators, store logic.
   - Component: node label edit, add/delete node/edge, connect nodes, autosave indicator.
   - Contract: API schema tests (msw) for GET/PUT; error handling paths.
   - E2E: render, edit, save, reload shows persisted changes.
   - DoD: performance target met; a11y checks; cross-browser manual test; analytics events emitted.

11. **Non-functional Targets**:
   - Performance: 300 nodes / 600 edges at ≥ 55fps for pan/zoom and drag.
   - Accessibility: ARIA labels, visible focus, keyboard nav for key actions.
   - Browser support: latest Chrome/Firefox/Edge; minimum viewport width 1280px.

12. **Security & Authorization**:
   - Only owner/collaborators can edit; viewers read-only.
   - Server-side schema validation and authorization checks on PUT.

13. **Analytics & Rollout**:
   - Feature flag the route `/blueprints/:id/mindmap`; fallback to standard blueprint view.
   - Emit events: view, edit start, add/delete node/edge, connect, save success/failure.
   - Staged rollout; monitor errors and performance.

## Out of Scope

-   Real-time collaboration on the mind map.
-   Advanced styling and customization of the mind map view.
