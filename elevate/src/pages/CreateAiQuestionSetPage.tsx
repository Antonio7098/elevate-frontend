import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiFolder, 
  FiAlertCircle, 
  FiLoader,
  FiArrowLeft,
  FiCpu
} from 'react-icons/fi';
import { generateAiPoweredSet } from '../services/aiService';
import { getFolders } from '../services/folderService';
import type { Folder } from '../types/folder';

// Focus options for AI question generation
const FOCUS_OPTIONS = [
  { value: 'understand', label: 'Understand (Foundational Concepts)' },
  { value: 'use', label: 'Use (Application & Context)' },
  { value: 'explore', label: 'Explore (Analysis & Deeper Inquiry)' }
];

const CreateAiQuestionSetPage = () => {
  const navigate = useNavigate();
  const { folderId: preselectedFolderId } = useParams<{ folderId?: string }>();
  
  // Form state
  const [name, setName] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [focus, setFocus] = useState<'understand' | 'use' | 'explore'>('understand');
  const [folderId, setFolderId] = useState(preselectedFolderId || '');
  
  // UI state
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingFolders, setIsFetchingFolders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load folders for the dropdown
  useEffect(() => {
    const loadFolders = async () => {
      try {
        setIsFetchingFolders(true);
        const data = await getFolders();
        setFolders(data);
        
        // If no folder is preselected and we have folders, select the first one
        if (!preselectedFolderId && data.length > 0 && !folderId) {
          setFolderId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load folders:', err);
        setError('Failed to load folders. Please try again.');
      } finally {
        setIsFetchingFolders(false);
      }
    };
    
    loadFolders();
  }, [preselectedFolderId, folderId]);

  // Form validation
  const validateForm = (): boolean => {
    if (!folderId) {
      setError('Please select a folder');
      return false;
    }
    
    if (!name.trim()) {
      setError('Please enter a name for your question set');
      return false;
    }
    
    if (sourceText.trim().length < 100) {
      setError('Please provide more source material (at least 100 characters)');
      return false;
    }
    
    if (questionCount < 3 || questionCount > 20) {
      setError('Number of questions must be between 3 and 20');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    
    // Validate form
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      const result = await generateAiPoweredSet({
        folderId,
        name: name.trim(),
        sourceText: sourceText.trim(),
        questionCount,
        focus
      });
      
      // Navigate to the newly created question set
      navigate(`/question-sets/${result.id}`);
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <FiArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </button>
        <div className="flex items-center">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 mr-3">
            <FiCpu className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Create AI-Powered Question Set
            </h1>
            <p className="mt-1 text-slate-400">
              Provide source material and Elevate AI will generate questions for you
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-300 flex items-start">
          <FiAlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="space-y-6">
          {/* Folder Selection */}
          <div>
            <label htmlFor="folder-select" className="block text-sm font-medium text-slate-300 mb-2">
              Select Folder <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              {isFetchingFolders ? (
                <div className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 flex items-center">
                  <FiLoader className="animate-spin h-5 w-5 mr-2" />
                  Loading folders...
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <FiFolder className="h-5 w-5" />
                  </span>
                  <select
                    id="folder-select"
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                    required
                  >
                    <option value="" disabled>Select a folder</option>
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Question Set Name */}
          <div>
            <label htmlFor="question-set-name" className="block text-sm font-medium text-slate-300 mb-2">
              Question Set Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="question-set-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="e.g., Chapter 5 Quiz"
              required
            />
          </div>

          {/* Source Material */}
          <div>
            <label htmlFor="source-material" className="block text-sm font-medium text-slate-300 mb-2">
              Paste Your Source Material Here <span className="text-red-400">*</span>
            </label>
            <textarea
              id="source-material"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y"
              placeholder="Paste your study notes, textbook excerpts, or other learning material here..."
              rows={10}
              required
            />
            <p className="mt-1 text-xs text-slate-500">
              Minimum 100 characters required for meaningful question generation
            </p>
          </div>

          {/* Number of Questions */}
          <div>
            <label htmlFor="question-count" className="block text-sm font-medium text-slate-300 mb-2">
              Number of Questions (Approx.)
            </label>
            <input
              type="number"
              id="question-count"
              min={3}
              max={20}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <p className="mt-1 text-xs text-slate-500">
              Between 3 and 20 questions recommended
            </p>
          </div>

          {/* Learning Focus */}
          <div>
            <label htmlFor="learning-focus" className="block text-sm font-medium text-slate-300 mb-2">
              Learning Focus
            </label>
            <select
              id="learning-focus"
              value={focus}
              onChange={(e) => setFocus(e.target.value as 'understand' | 'use' | 'explore')}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
            >
              {FOCUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || isFetchingFolders}
              className={`w-full px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                isLoading || isFetchingFolders ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5 inline-block" />
                  Generating Questions...
                </>
              ) : (
                'Generate Quiz with Elevate AI'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateAiQuestionSetPage;
