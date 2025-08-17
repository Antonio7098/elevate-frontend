import type { Folder } from '../types/folder';
import type { QuestionSet, LearningBlueprint } from '../types/questionSet';
import type { Note } from '../types/note.types';

export const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'Mathematics',
    description: 'All about numbers and logic.',
    parentId: null,
    children: [],
    questionSetCount: 2,
    masteryScore: 0.75,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-08-01T14:30:00Z',
    userId: 'user-123',
    isPinned: true,
  },
  {
    id: '2',
    name: 'History',
    description: 'The story of our past.',
    parentId: null,
    children: [],
    questionSetCount: 1,
    masteryScore: 0.6,
    createdAt: '2025-02-20T11:00:00Z',
    updatedAt: '2025-07-25T18:00:00Z',
    userId: 'user-123',
    isPinned: false,
  },
  {
    id: '3',
    name: 'Algebra',
    description: 'A subfolder for algebra.',
    parentId: '1',
    children: [],
    questionSetCount: 1,
    masteryScore: 0.85,
    createdAt: '2025-03-10T09:00:00Z',
    updatedAt: '2025-08-02T11:00:00Z',
    userId: 'user-123',
    isPinned: false,
  },
  {
    id: '4',
    name: 'Geometry',
    description: 'Shapes, sizes, and properties of space.',
    parentId: '1',
    children: [],
    questionSetCount: 0,
    masteryScore: 0.5,
    createdAt: '2025-03-12T09:00:00Z',
    updatedAt: '2025-08-03T11:00:00Z',
    userId: 'user-123',
    isPinned: false,
  },
  {
    id: '5',
    name: 'Ancient History',
    description: 'From early humans to the fall of Rome.',
    parentId: '2',
    children: [],
    questionSetCount: 1,
    masteryScore: 0.7,
    createdAt: '2025-04-10T09:00:00Z',
    updatedAt: '2025-08-01T11:00:00Z',
    userId: 'user-123',
    isPinned: true,
  },
  {
    id: '6',
    name: 'Modern History',
    description: 'From the Renaissance to the present day.',
    parentId: '2',
    children: [],
    questionSetCount: 0,
    masteryScore: 0.4,
    createdAt: '2025-04-15T09:00:00Z',
    updatedAt: '2025-08-02T15:00:00Z',
    userId: 'user-123',
    isPinned: false,
  },
];

export const mockQuestionSets: QuestionSet[] = [
  {
    id: 'qs-1',
    name: 'Algebra Basics',
    description: 'Fundamental concepts of algebra.',
    folderId: '3',
    createdAt: '2025-03-10T09:00:00Z',
    updatedAt: '2025-08-02T11:00:00Z',
    questionCount: 50,
    isPinned: true,
    currentTotalMasteryScore: 0.85,
    nextReviewAt: '2025-08-10T09:00:00Z',
    generatedFromBlueprintId: 'bp-1',
  },
  {
    id: 'qs-2',
    name: 'Calculus I',
    description: 'Introduction to derivatives and integrals.',
    folderId: '1',
    createdAt: '2025-04-05T13:00:00Z',
    updatedAt: '2025-07-30T16:45:00Z',
    questionCount: 75,
    isPinned: false,
    currentTotalMasteryScore: 0.65,
    nextReviewAt: '2025-08-12T09:00:00Z',
    generatedFromBlueprintId: 'bp-1',
  },
  {
    id: 'qs-3',
    name: 'The Roman Empire',
    description: 'The rise and fall of Rome.',
    folderId: '5',
    createdAt: '2025-05-12T15:00:00Z',
    updatedAt: '2025-07-28T10:20:00Z',
    questionCount: 100,
    isPinned: true,
    currentTotalMasteryScore: 0.55,
    nextReviewAt: '2025-08-15T09:00:00Z',
    generatedFromBlueprintId: 'bp-2',
  },
];

export const mockNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Key Formulas',
    content: [], // Blocknote content
    plainText: 'E=mc^2, a^2 + b^2 = c^2',
    createdAt: '2025-06-01T12:00:00Z',
    updatedAt: '2025-08-03T09:15:00Z',
    userId: 'user-123',
    folderId: '3',
    generatedFromBlueprintId: 'bp-1',
  },
  {
    id: 'note-2',
    title: 'Important Dates',
    content: [], // Blocknote content
    plainText: '476 AD: Fall of the Western Roman Empire',
    createdAt: '2025-06-15T16:00:00Z',
    updatedAt: '2025-07-29T14:00:00Z',
    userId: 'user-123',
    folderId: '5',
    generatedFromBlueprintId: 'bp-2',
  },
];

export const mockBlueprints: LearningBlueprint[] = [
  {
    id: 'bp-001',
    sourceText: `Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy. This process is fundamental to life on Earth as it provides the primary source of energy for most ecosystems.

The basic equation for photosynthesis is:
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

This means that carbon dioxide and water, in the presence of light energy, are converted into glucose (a sugar) and oxygen. The process occurs in two main stages: the light-dependent reactions and the light-independent reactions (Calvin cycle).

In the light-dependent reactions, which take place in the thylakoid membranes of chloroplasts, light energy is absorbed by chlorophyll and other pigments. This energy is used to split water molecules, releasing oxygen as a byproduct and generating ATP and NADPH, which are energy-carrying molecules.

The light-independent reactions, also known as the Calvin cycle, occur in the stroma of chloroplasts. Here, the ATP and NADPH from the light-dependent reactions are used to convert carbon dioxide into glucose through a series of enzyme-catalyzed reactions.

Several factors affect the rate of photosynthesis, including light intensity, carbon dioxide concentration, temperature, and water availability. Understanding these factors is crucial for agricultural practices and environmental conservation efforts.`,
    title: 'Introduction to Photosynthesis',
    description: 'A comprehensive overview of the photosynthetic process, including light-dependent and light-independent reactions, factors affecting photosynthesis, and its ecological significance.',
    blueprintJson: {
      "source_summary": {
        "core_thesis_or_main_argument": "Photosynthesis is the fundamental process by which plants convert light energy into chemical energy, providing the primary energy source for most ecosystems.",
        "inferred_purpose": "To explain the biochemical mechanisms of photosynthesis, its two-stage process, and the factors that influence its efficiency."
      },
      "sections": [
        {
          "section_id": "sec_intro",
          "section_name": "Introduction to Photosynthesis",
          "description": "Overview of photosynthesis as a fundamental biological process",
          "parent_section_id": null,
          "depth": 0,
          "order_index": 0,
          "difficulty": "BEGINNER",
          "estimated_time_minutes": 15
        },
        {
          "section_id": "sec_equation",
          "section_name": "The Photosynthesis Equation",
          "description": "Chemical equation and stoichiometry of photosynthesis",
          "parent_section_id": null,
          "depth": 0,
          "order_index": 1,
          "difficulty": "BEGINNER",
          "estimated_time_minutes": 10
        },
        {
          "section_id": "sec_stages",
          "section_name": "Two Main Stages",
          "description": "Light-dependent and light-independent reactions",
          "parent_section_id": null,
          "depth": 0,
          "order_index": 2,
          "difficulty": "INTERMEDIATE",
          "estimated_time_minutes": 20
        },
        {
          "section_id": "sec_light_dependent",
          "section_name": "Light-Dependent Reactions",
          "description": "Processes occurring in thylakoid membranes",
          "parent_section_id": "sec_stages",
          "depth": 1,
          "order_index": 0,
          "difficulty": "INTERMEDIATE",
          "estimated_time_minutes": 25
        },
        {
          "section_id": "sec_calvin_cycle",
          "section_name": "Calvin Cycle (Light-Independent)",
          "description": "Carbon fixation and glucose synthesis",
          "parent_section_id": "sec_stages",
          "depth": 1,
          "order_index": 1,
          "difficulty": "ADVANCED",
          "estimated_time_minutes": 30
        },
        {
          "section_id": "sec_factors",
          "section_name": "Factors Affecting Photosynthesis",
          "description": "Environmental and biological factors that influence the process",
          "parent_section_id": null,
          "depth": 0,
          "order_index": 3,
          "difficulty": "INTERMEDIATE",
          "estimated_time_minutes": 20
        },
        {
          "section_id": "sec_applications",
          "section_name": "Applications and Significance",
          "description": "Agricultural and environmental implications",
          "parent_section_id": null,
          "depth": 0,
          "order_index": 4,
          "difficulty": "BEGINNER",
          "estimated_time_minutes": 15
        }
      ],
      "knowledge_primitives": {
        "key_propositions_and_facts": [
          {
            "id": "prop_001",
            "statement": "Photosynthesis converts light energy into chemical energy",
            "supporting_evidence": ["Light absorption by chlorophyll", "ATP and NADPH generation", "Glucose production"],
            "sections": ["sec_intro", "sec_stages"],
            "difficulty": "BEGINNER",
            "estimated_time_minutes": 10
          },
          {
            "id": "prop_002",
            "statement": "The photosynthesis equation is 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
            "supporting_evidence": ["Stoichiometric balance", "Carbon dioxide input", "Oxygen output"],
            "sections": ["sec_equation"],
            "difficulty": "BEGINNER",
            "estimated_time_minutes": 8
          },
          {
            "id": "prop_003",
            "statement": "Photosynthesis occurs in two main stages: light-dependent and light-independent reactions",
            "supporting_evidence": ["Thylakoid membrane processes", "Stroma-based Calvin cycle", "Energy transfer between stages"],
            "sections": ["sec_stages", "sec_light_dependent", "sec_calvin_cycle"],
            "difficulty": "INTERMEDIATE",
            "estimated_time_minutes": 15
          },
          {
            "id": "prop_004",
            "statement": "Light-dependent reactions produce ATP and NADPH while releasing oxygen",
            "supporting_evidence": ["Water splitting", "Electron transport chain", "Photophosphorylation"],
            "sections": ["sec_light_dependent"],
            "difficulty": "INTERMEDIATE",
            "estimated_time_minutes": 20
          },
          {
            "id": "prop_005",
            "statement": "The Calvin cycle uses ATP and NADPH to convert CO₂ into glucose",
            "supporting_evidence": ["Carbon fixation", "Reduction reactions", "Regeneration of RuBP"],
            "sections": ["sec_calvin_cycle"],
            "difficulty": "ADVANCED",
            "estimated_time_minutes": 25
          }
        ],
        "key_entities_and_definitions": [
          {
            "id": "entity_001",
            "entity": "Photosynthesis",
            "definition": "The process by which plants convert light energy into chemical energy",
            "category": "Concept",
            "sections": ["sec_intro"],
            "difficulty": "BEGINNER",
            "estimated_time_minutes": 5
          },
          {
            "id": "entity_002",
            "entity": "Chloroplast",
            "definition": "Organelle where photosynthesis occurs in plant cells",
            "category": "Concept",
            "sections": ["sec_light_dependent", "sec_calvin_cycle"],
            "difficulty": "BEGINNER",
            "estimated_time_minutes": 5
          },
          {
            "id": "entity_003",
            "entity": "Chlorophyll",
            "definition": "Green pigment that absorbs light energy for photosynthesis",
            "category": "Concept",
            "sections": ["sec_light_dependent"],
            "difficulty": "BEGINNER",
            "estimated_time_minutes": 5
          },
          {
            "id": "entity_004",
            "entity": "ATP",
            "definition": "Adenosine triphosphate, the primary energy carrier molecule",
            "category": "Concept",
            "sections": ["sec_light_dependent", "sec_calvin_cycle"],
            "difficulty": "INTERMEDIATE",
            "estimated_time_minutes": 8
          },
          {
            "id": "entity_005",
            "entity": "NADPH",
            "definition": "Nicotinamide adenine dinucleotide phosphate, an electron carrier",
            "category": "Concept",
            "sections": ["sec_light_dependent", "sec_calvin_cycle"],
            "difficulty": "INTERMEDIATE",
            "estimated_time_minutes": 8
          },
          {
            "id": "entity_006",
            "entity": "Thylakoid",
            "definition": "Membrane-bound compartment in chloroplasts where light-dependent reactions occur",
            "category": "Concept",
            "sections": ["sec_light_dependent"],
            "difficulty": "INTERMEDIATE",
            "estimated_time_minutes": 8
          },
          {
            "id": "entity_007",
            "entity": "Stroma",
            "definition": "Fluid-filled space in chloroplasts where the Calvin cycle occurs",
            "category": "Concept",
            "sections": ["sec_calvin_cycle"],
            "difficulty": "INTERMEDIATE",
            "estimated_time_minutes": 8
          }
        ],
        "described_processes_and_steps": [
          {
            "id": "process_001",
            "process_name": "Light-Dependent Reactions",
            "steps": [
              "Light absorption by chlorophyll",
              "Water splitting (photolysis)",
              "Electron transport chain activation",
              "ATP synthesis (photophosphorylation)",
              "NADPH production"
            ],
            "sections": ["sec_light_dependent"],
            "difficulty": "INTERMEDIATE",
            "estimated_time_minutes": 25
          },
          {
            "id": "process_002",
            "process_name": "Calvin Cycle",
            "steps": [
              "Carbon fixation (CO₂ + RuBP)",
              "Reduction reactions (using ATP and NADPH)",
              "Glucose formation",
              "RuBP regeneration"
            ],
            "sections": ["sec_calvin_cycle"],
            "difficulty": "ADVANCED",
            "estimated_time_minutes": 30
          },
          {
            "id": "process_003",
            "process_name": "Overall Photosynthesis",
            "steps": [
              "Light energy absorption",
              "Water and CO₂ intake",
              "Light-dependent reactions",
              "Calvin cycle reactions",
              "Glucose and oxygen production"
            ],
            "sections": ["sec_intro", "sec_stages"],
            "difficulty": "BEGINNER",
            "estimated_time_minutes": 20
          }
        ],
        "identified_relationships": [
          {
            "id": "rel_001",
            "relationship_type": "Energy_Flow",
            "source_primitive_id": "entity_003",
            "target_primitive_id": "entity_004",
            "description": "Chlorophyll absorbs light energy which is converted to ATP",
            "sections": ["sec_light_dependent"],
            "difficulty": "INTERMEDIATE",
            "estimated_time_minutes": 10
          },
          {
            "id": "rel_002",
            "relationship_type": "Product_Input",
            "source_primitive_id": "entity_004",
            "target_primitive_id": "process_002",
            "description": "ATP from light-dependent reactions fuels the Calvin cycle",
            "sections": ["sec_light_dependent", "sec_calvin_cycle"],
            "difficulty": "INTERMEDIATE",
            "estimated_time_minutes": 12
          },
          {
            "id": "rel_003",
            "relationship_type": "Spatial_Location",
            "source_primitive_id": "entity_006",
            "target_primitive_id": "entity_007",
            "description": "Thylakoids are embedded within the stroma of chloroplasts",
            "sections": ["sec_light_dependent", "sec_calvin_cycle"],
            "difficulty": "BEGINNER",
            "estimated_time_minutes": 5
          }
        ],
        "implicit_and_open_questions": [
          {
            "id": "question_001",
            "question": "How do different wavelengths of light affect photosynthesis efficiency?",
            "sections": ["sec_light_dependent", "sec_factors"],
            "difficulty": "ADVANCED",
            "estimated_time_minutes": 15
          },
          {
            "id": "question_002",
            "question": "What adaptations have evolved in plants to optimize photosynthesis in different environments?",
            "sections": ["sec_factors", "sec_applications"],
            "difficulty": "ADVANCED",
            "estimated_time_minutes": 20
          },
          {
            "id": "question_003",
            "question": "How might climate change affect global photosynthesis rates?",
            "sections": ["sec_factors", "sec_applications"],
            "difficulty": "INTERMEDIATE",
            "estimated_time_minutes": 15
          },
          {
            "id": "question_004",
            "question": "What are the evolutionary origins of photosynthesis?",
            "sections": ["sec_intro"],
            "difficulty": "ADVANCED",
            "estimated_time_minutes": 25
          }
        ]
      },
      "metadata": {
        "total_sections": 7,
        "total_primitives": 25,
        "difficulty_distribution": {
          "BEGINNER": 8,
          "INTERMEDIATE": 12,
          "ADVANCED": 5
        },
        "estimated_total_time_minutes": 180,
        "tags": ["biology", "photosynthesis", "plant-science", "biochemistry", "ecology"],
        "source_type": "educational_text",
        "complexity_score": 0.65
      }
    },
    folderId: '1',
    createdAt: '2025-07-10T10:00:00Z',
    updatedAt: '2025-08-01T14:30:00Z',
  },
  {
    id: 'bp-1',
    sourceText: 'The basics of photosynthesis.',
    blueprintJson: {},
    folderId: '1',
    createdAt: '2025-07-10T10:00:00Z',
    updatedAt: '2025-07-10T10:00:00Z',
  },
  {
    id: 'bp-2',
    sourceText: 'The causes of World War I.',
    blueprintJson: {},
    folderId: '2',
    createdAt: '2025-07-15T14:30:00Z',
    updatedAt: '2025-07-15T14:30:00Z',
  },
];