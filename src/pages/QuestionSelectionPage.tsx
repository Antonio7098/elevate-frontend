import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Question } from '../types/question';
import styles from './QuestionSelectionPage.module.css';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import LoadingText from '../components/LoadingText';

// Blueprint-centric mock types and data
interface QuestionInstance {
  id: string;
  questionText: string;
  currentMasteryScore?: number;
}

interface MasteryCriterion {
  id: string;
  title: string;
  questionInstances: QuestionInstance[];
}

interface BlueprintSection {
  id: string;
  name: string;
  description: string;
  masteryCriteria: MasteryCriterion[];
}

const mockSections: BlueprintSection[] = [
  {
    id: 'section-1',
    name: 'Introduction to Photosynthesis',
    description: 'Understanding the basic process of photosynthesis.',
    masteryCriteria: [
      {
        id: 'crit-1-1',
        title: 'Define Photosynthesis',
        questionInstances: [
          { id: 'q-1-1-1', questionText: 'What is the chemical equation for photosynthesis?' },
          { id: 'q-1-1-2', questionText: 'Where does photosynthesis occur in a plant cell?', currentMasteryScore: 0.75 },
        ],
      },
      {
        id: 'crit-1-2',
        title: 'Identify Reactants and Products',
        questionInstances: [
          { id: 'q-1-2-1', questionText: 'What are the reactants of photosynthesis?' },
          { id: 'q-1-2-2', questionText: 'What are the products of photosynthesis?' },
        ],
      },
    ],
  },
  {
    id: 'section-2',
    name: 'Cellular Respiration',
    description: 'The process of converting glucose to ATP.',
    masteryCriteria: [
      {
        id: 'crit-2-1',
        title: 'Glycolysis',
        questionInstances: [
          { id: 'q-2-1-1', questionText: 'Where does glycolysis take place?' },
        ],
      },
    ],
  },
];

const QuestionSelectionPage: React.FC = () => {
  // Treat route param as sectionId now
  const { setId: sectionId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const [section, setSection] = useState<BlueprintSection | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));
        const found = mockSections.find(s => s.id === sectionId) || null;
        setSection(found);
        if (found) {
          const allInstanceIds = found.masteryCriteria.flatMap(c => c.questionInstances.map(q => q.id));
          setSelectedQuestions(new Set(allInstanceIds));
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading section data:', err);
        setError('Failed to load section data.');
        setLoading(false);
      }
    };
    fetchData();
  }, [sectionId]);

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId); else next.add(questionId);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (!section) return;
    const allIds = section.masteryCriteria.flatMap(c => c.questionInstances.map(q => q.id));
    setSelectedQuestions(new Set(allIds));
  };

  const handleSelectNone = () => {
    setSelectedQuestions(new Set());
  };

  const buildQuestionPayload = (): Question[] => {
    if (!section) return [];
    const nowIso = new Date().toISOString();
    const allInstances: QuestionInstance[] = section.masteryCriteria.flatMap(c => c.questionInstances);
    return allInstances
      .filter(q => selectedQuestions.has(q.id))
      .map(q => ({
        id: q.id,
        text: q.questionText,
        questionSetId: section.id, // reuse field to carry section id
        questionSetName: section.name,
        answer: null,
        createdAt: nowIso,
        updatedAt: nowIso,
        questionType: 'SHORT_ANSWER',
        options: [],
        totalMarksAvailable: 1,
        markingCriteria: null,
        conceptTags: [],
        uueFocus: 'Understand',
        timesAnsweredCorrectly: 0,
        timesAnsweredIncorrectly: 0,
        selfMark: false,
        autoMark: false,
        aiGenerated: false,
        inCat: null,
        imageUrls: [],
        currentMasteryScore: q.currentMasteryScore ?? null,
      } as Question));
  };

  const handleStartReview = () => {
    const payload = buildQuestionPayload();
    if (payload.length === 0) {
      alert('Please select at least one question to start the review session.');
      return;
    }
    navigate('/blueprints/review/set', {
      state: {
        questions: payload,
        sessionTitle: `Review: ${section?.name || 'Section'}`,
        // reusing questionSetId to maintain compatibility with review route
        questionSetId: section?.id,
        isBlueprintReview: true,
        sectionId: section?.id,
      },
    });
  };

  const totalQuestions = section?.masteryCriteria.reduce((sum, c) => sum + c.questionInstances.length, 0) || 0;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}><LoadingText /></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!section || totalQuestions === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>No Questions Found</h2>
          <p>This section doesn't contain any question instances.</p>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Breadcrumbs />

      <div className={styles.header}>
        <h1 className={styles.title}>Select Questions for Review</h1>
        <p className={styles.subtitle}>
          Choose which questions from "{section.name}" you want to include in your review session.
        </p>
      </div>

      <div className={styles.selectionControls}>
        <div className={styles.selectionInfo}>
          <span className={styles.selectionCount}>
            {selectedQuestions.size} of {totalQuestions} questions selected
          </span>
        </div>
        <div className={styles.selectionButtons}>
          <button
            onClick={handleSelectAll}
            className={styles.selectButton}
            disabled={selectedQuestions.size === totalQuestions}
          >
            Select All
          </button>
          <button
            onClick={handleSelectNone}
            className={styles.selectButton}
            disabled={selectedQuestions.size === 0}
          >
            Select None
          </button>
        </div>
      </div>

      {/* Render criteria and their question instances */}
      <div className={styles.questionsList}>
        {section.masteryCriteria.map((criterion) => (
          <div key={criterion.id} className="card">
            <div className={styles.questionHeader}>
              <span className={styles.questionNumber}>{criterion.title}</span>
            </div>
            {criterion.questionInstances.map((question, index) => (
              <div
                key={question.id}
                className={`card ${selectedQuestions.has(question.id) ? styles.selected : ''}`}
                onClick={() => handleQuestionToggle(question.id)}
              >
                <div className={styles.questionCheckbox}>
                  <input
                    type="checkbox"
                    checked={selectedQuestions.has(question.id)}
                    onChange={() => handleQuestionToggle(question.id)}
                    className={styles.checkbox}
                  />
                </div>
                <div className={styles.questionContent}>
                  <div className={styles.questionHeader}>
                    <span className={styles.questionNumber}>Q{index + 1}</span>
                    {question.currentMasteryScore !== undefined && (
                      <span className={styles.uueTag}>{Math.round((question.currentMasteryScore || 0) * 100)}%</span>
                    )}
                  </div>
                  <p className={styles.questionText}>{question.questionText}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => navigate(-1)}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          onClick={handleStartReview}
          className={styles.startButton}
          disabled={selectedQuestions.size === 0}
        >
          Start Review Session ({selectedQuestions.size} questions)
        </button>
      </div>
    </div>
  );
};

export default QuestionSelectionPage;
