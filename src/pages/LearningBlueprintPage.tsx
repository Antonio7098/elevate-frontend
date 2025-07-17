import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiAlertCircle, 
  FiLoader, 
  FiFolder, 
  FiCpu,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiPlay
} from 'react-icons/fi';
import { createLearningBlueprint, generateQuestionsFromBlueprint } from '../services/learningBlueprintService';
import { getFolders } from '../services/folderService';
import type { Folder } from '../types/folder';
import type { LearningBlueprint, QuestionSet } from '../types/questionSet';
import styles from './LearningBlueprintPage.module.css';

// Question generation options
const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

const LearningBlueprintPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Step management
  const [currentStep, setCurrentStep] = useState<'blueprint' | 'review' | 'generate' | 'complete'>('blueprint');
  
  // Form state - Step 1: Create Blueprint
  const [sourceText, setSourceText] = useState('');
  const [folderId, setFolderId] = useState('');
  
  // Form state - Step 3: Generate Questions
  const [questionSetName, setQuestionSetName] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [targetFolderId, setTargetFolderId] = useState('');
  
  // Data state
  const [blueprint, setBlueprint] = useState<LearningBlueprint | null>(null);
  const [generatedQuestionSet, setGeneratedQuestionSet] = useState<QuestionSet | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBlueprintJson, setShowBlueprintJson] = useState(false);

  // Load folders
  useEffect(() => {
    const loadFolders = async () => {
      try {
        setIsLoadingFolders(true);
        const data = await getFolders();
        setFolders(data);
        
        // Set default folder if available
        if (data.length > 0) {
          setFolderId(data[0].id);
          setTargetFolderId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load folders:', err);
        setError('Failed to load folders. Please try again.');
      } finally {
        setIsLoadingFolders(false);
      }
    };
    
    loadFolders();
  }, []);

  // Form validation
  const validateBlueprintForm = (): boolean => {
    if (!sourceText.trim()) {
      setError('Please provide source text');
      return false;
    }
    
    if (sourceText.trim().length < 50) {
      setError('Source text must be at least 50 characters long');
      return false;
    }
    
    return true;
  };

  const validateQuestionForm = (): boolean => {
    if (!questionSetName.trim()) {
      setError('Please provide a name for the question set');
      return false;
    }
    
    if (questionCount < 3 || questionCount > 20) {
      setError('Number of questions must be between 3 and 20');
      return false;
    }
    
    return true;
  };

  // Step 1: Create Learning Blueprint
  const handleCreateBlueprint = async () => {
    setError(null);
    
    if (!validateBlueprintForm()) return;
    
    try {
      setIsLoading(true);
      
      const result = await createLearningBlueprint({
        sourceText: sourceText.trim(),
        folderId: folderId || undefined
      });
      
      setBlueprint(result);
      setCurrentStep('review');
    } catch (err: any) {
      console.error('Error creating blueprint:', err);
      setError(
        err.response?.data?.message || 
        'Failed to create learning blueprint. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Generate Questions
  const handleGenerateQuestions = async () => {
    setError(null);
    
    if (!validateQuestionForm() || !blueprint) return;
    
    try {
      setIsLoading(true);
      
      const result = await generateQuestionsFromBlueprint(blueprint.id, {
        name: questionSetName.trim(),
        questionOptions: {
          difficulty,
          count: questionCount
        },
        folderId: targetFolderId || undefined
      });
      
      setGeneratedQuestionSet(result.questionSet);
      setCurrentStep('complete');
    } catch (err: any) {
      console.error('Error generating questions:', err);
      setError(
        err.response?.data?.message || 
        'Failed to generate questions. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handlers
  const handleBack = () => {
    if (currentStep === 'review') {
      setCurrentStep('blueprint');
    } else if (currentStep === 'generate') {
      setCurrentStep('review');
    } else if (currentStep === 'complete') {
      setCurrentStep('generate');
    } else {
      navigate(-1);
    }
  };

  const handleContinue = () => {
    setCurrentStep('generate');
  };

  const handleSaveAndFinish = () => {
    if (blueprint?.folderId) {
      navigate(`/folders/${blueprint.folderId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleStartReview = () => {
    if (generatedQuestionSet) {
      navigate(`/question-sets/${generatedQuestionSet.id}`);
    }
  };

  const handleCreateAnother = () => {
    // Reset form and go back to step 1
    setSourceText('');
    setQuestionSetName('');
    setBlueprint(null);
    setGeneratedQuestionSet(null);
    setCurrentStep('blueprint');
  };

  // Render step content
  const renderBlueprintStep = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Step 1: Create Learning Blueprint</h2>
      <p className={styles.stepDescription}>
        Provide your source material and AI will create a learning blueprint to structure the content.
      </p>
      
      <div className={styles.formSection}>
        <label htmlFor="folder-select" className={styles.formLabel}>
          Select Folder (Optional)
        </label>
        <div className={styles.inputWrapper}>
          {isLoadingFolders ? (
            <div className={styles.loadingInput}>
              <FiLoader className="animate-spin" />
              Loading folders...
            </div>
          ) : (
            <>
              <FiFolder className={styles.inputIcon} />
              <select
                id="folder-select"
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className={styles.select}
              >
                <option value="">No folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      <div className={styles.formSection}>
        <label htmlFor="source-text" className={styles.formLabel}>
          Source Material <span className={styles.required}>*</span>
        </label>
        <textarea
          id="source-text"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          className={styles.textarea}
          placeholder="Paste your study notes, textbook excerpts, or other learning material here..."
          rows={8}
        />
        <p className={styles.helpText}>
          Minimum 50 characters required. The AI will analyze this content and create a structured learning blueprint.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleCreateBlueprint}
          disabled={isLoading || isLoadingFolders}
          className={styles.primaryButton}
        >
          {isLoading ? (
            <>
              <FiLoader className="animate-spin" />
              Creating Blueprint...
            </>
          ) : (
            <>
              <FiCpu />
              Create Learning Blueprint
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Step 2: Review Blueprint</h2>
      <p className={styles.stepDescription}>
        Review the AI-generated learning blueprint before creating questions.
      </p>
      
      <div className={styles.blueprintSection}>
        <div className={styles.blueprintHeader}>
          <h3>Generated Learning Blueprint</h3>
          <button
            onClick={() => setShowBlueprintJson(!showBlueprintJson)}
            className={styles.toggleButton}
          >
            {showBlueprintJson ? <FiEyeOff /> : <FiEye />}
            {showBlueprintJson ? 'Hide' : 'Show'} Blueprint
          </button>
        </div>
        
        {showBlueprintJson && (
          <div className={styles.blueprintJson}>
            <pre>{JSON.stringify(blueprint?.blueprintJson, null, 2)}</pre>
          </div>
        )}
        
        <div className={styles.sourcePreview}>
          <h4>Source Material Preview</h4>
          <p>{blueprint?.sourceText.substring(0, 200)}...</p>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={handleSaveAndFinish} className={styles.secondaryButton}>
          Save & Finish
        </button>
        <button onClick={handleContinue} className={styles.primaryButton}>
          Generate Questions
        </button>
      </div>
    </div>
  );

  const renderGenerateStep = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Step 3: Generate Questions</h2>
      <p className={styles.stepDescription}>
        Configure question generation options based on your learning blueprint.
      </p>
      
      <div className={styles.formSection}>
        <label htmlFor="question-set-name" className={styles.formLabel}>
          Question Set Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="question-set-name"
          value={questionSetName}
          onChange={(e) => setQuestionSetName(e.target.value)}
          className={styles.input}
          placeholder="e.g., Cell Biology Basics"
        />
      </div>

      <div className={styles.formSection}>
        <label htmlFor="target-folder" className={styles.formLabel}>
          Target Folder (Optional)
        </label>
        <div className={styles.inputWrapper}>
          <FiFolder className={styles.inputIcon} />
          <select
            id="target-folder"
            value={targetFolderId}
            onChange={(e) => setTargetFolderId(e.target.value)}
            className={styles.select}
          >
            <option value="">No folder</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formSection}>
          <label htmlFor="difficulty" className={styles.formLabel}>
            Difficulty Level
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
            className={styles.select}
          >
            {DIFFICULTY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formSection}>
          <label htmlFor="question-count" className={styles.formLabel}>
            Number of Questions
          </label>
          <input
            type="number"
            id="question-count"
            min={3}
            max={20}
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleGenerateQuestions}
          disabled={isLoading}
          className={styles.primaryButton}
        >
          {isLoading ? (
            <>
              <FiLoader className="animate-spin" />
              Generating Questions...
            </>
          ) : (
            <>
              <FiCpu />
              Generate Questions
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Step 4: Complete!</h2>
      <p className={styles.stepDescription}>
        Your question set has been successfully generated from the learning blueprint.
      </p>
      
      <div className={styles.successSection}>
        <div className={styles.successIcon}>
          <FiCheck />
        </div>
        <h3>Question Set Created Successfully</h3>
        <p><strong>Name:</strong> {generatedQuestionSet?.name}</p>
        <p><strong>Questions Generated:</strong> {generatedQuestionSet?.questionCount || 'Unknown'}</p>
        {generatedQuestionSet?.folderId && (
          <p><strong>Folder:</strong> {folders.find(f => f.id === generatedQuestionSet.folderId)?.name}</p>
        )}
      </div>

      <div className={styles.actions}>
        <button onClick={handleStartReview} className={styles.primaryButton}>
          <FiPlay />
          Start Review Session
        </button>
        <button onClick={handleCreateAnother} className={styles.secondaryButton}>
          Create Another
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          <FiArrowLeft />
          Back
        </button>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <FiCpu />
          </div>
          <div>
            <h1 className={styles.title}>Learning Blueprint & Question Generation</h1>
            <p className={styles.subtitle}>
              Create structured learning blueprints and generate targeted questions
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className={styles.progressSteps}>
        <div className={`${styles.step} ${currentStep === 'blueprint' ? styles.active : ''} ${['review', 'generate', 'complete'].includes(currentStep) ? styles.completed : ''}`}>
          <div className={styles.stepNumber}>1</div>
          <span>Create Blueprint</span>
        </div>
        <div className={`${styles.step} ${currentStep === 'review' ? styles.active : ''} ${['generate', 'complete'].includes(currentStep) ? styles.completed : ''}`}>
          <div className={styles.stepNumber}>2</div>
          <span>Review</span>
        </div>
        <div className={`${styles.step} ${currentStep === 'generate' ? styles.active : ''} ${currentStep === 'complete' ? styles.completed : ''}`}>
          <div className={styles.stepNumber}>3</div>
          <span>Generate Questions</span>
        </div>
        <div className={`${styles.step} ${currentStep === 'complete' ? styles.active : ''}`}>
          <div className={styles.stepNumber}>4</div>
          <span>Complete</span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className={styles.error}>
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {/* Step content */}
      {currentStep === 'blueprint' && renderBlueprintStep()}
      {currentStep === 'review' && renderReviewStep()}
      {currentStep === 'generate' && renderGenerateStep()}
      {currentStep === 'complete' && renderCompleteStep()}
    </div>
  );
};

export default LearningBlueprintPage; 