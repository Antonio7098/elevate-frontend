import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiAlertCircle, FiLoader, FiPlus, FiFolder, FiChevronRight, FiFileText, FiBook, FiExternalLink, FiChevronDown, FiSearch } from 'react-icons/fi';
import { GoCpu } from 'react-icons/go';
import { CreateFolderModal } from '../components/modals/CreateFolderModal';
import { AddContentModal } from '../components/modals/AddContentModal';
import { createFolder, getFolder, getFolders } from '../services/folderService';
import { getLearningBlueprints } from '../services/learningBlueprintService';
import type { Folder } from '../types/folder';
import type { QuestionSet, LearningBlueprint } from '../types/questionSet';
import type { Note } from '../types/note.types';
import styles from './FoldersPage.module.css';

import { mockFolders, mockQuestionSets, mockNotes, mockBlueprints } from '../data/mockFoldersData';

console.log("🟢 [FoldersPage] Module loaded");

export default function FoldersPage() {
  console.log("🟢 [FoldersPage] Component initialized");
  
  const [folders, setFolders] = useState<Folder[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [blueprints, setBlueprints] = useState<LearningBlueprint[]>([]);
  const [allScopeQuestionSets, setAllScopeQuestionSets] = useState<QuestionSet[]>([]);
  const [allScopeNotes, setAllScopeNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [usingPlaceholder, setUsingPlaceholder] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [expandedBlueprints, setExpandedBlueprints] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  console.log('📍 [FoldersPage] URL parameters:', { folderId });

  useEffect(() => {
    console.log("🔄 [FoldersPage] Starting data fetch");
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const headers = {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        };

        // Fetch blueprints first (across user)
        try {
          const bp = await getLearningBlueprints();
          setBlueprints(bp);
        } catch (e) {
          console.warn('⚠️ Falling back to mock blueprints', e);
          setBlueprints(mockBlueprints);
          setUsingPlaceholder(true);
        }

        // If we're in a folder, fetch its details and content
        if (folderId) {
          // Fetch current folder and its children using service
          try {
            const folder = await getFolder(folderId);
            setCurrentFolder(folder);
            setFolders(folder.children || []);
          } catch (e) {
            console.warn('⚠️ Falling back to mock folders for current folder', e);
            const selectedFolder = mockFolders.find(f => f.id === folderId) || null;
            setCurrentFolder(selectedFolder);
            setFolders(mockFolders.filter(f => f.parentId === folderId));
            setUsingPlaceholder(true);
          }

          // Helper: gather all descendant folder IDs (including current)
          const gatherFolderIds = (root: Folder): string[] => {
            const ids: string[] = [root.id];
            for (const child of root.children || []) {
              ids.push(...gatherFolderIds(child));
            }
            return ids;
          };

          // Build scope: all folder IDs under current
          let scopeFolderIds: string[] = [];
          if (currentFolder) {
            scopeFolderIds = gatherFolderIds(currentFolder);
          } else {
            // If currentFolder not yet set due to async ordering, refetch minimal data
            try {
              const f = await getFolder(folderId);
              scopeFolderIds = gatherFolderIds(f);
            } catch {
              scopeFolderIds = [folderId];
            }
          }

          // Fetch question sets in scope (parallel per folder)
          try {
            const qsArrays = await Promise.all(
              scopeFolderIds.map(id => fetch(`http://localhost:3000/api/folders/${id}/questionsets`, { headers }).then(r => r.ok ? r.json() : []))
            );
            const allQS: QuestionSet[] = ([] as QuestionSet[]).concat(...qsArrays);
            setQuestionSets(allQS.filter(q => q.folderId === folderId)); // direct folder view
            setAllScopeQuestionSets(allQS);
          } catch (e) {
            console.warn('⚠️ Falling back to mock question sets', e);
            const direct = mockQuestionSets.filter(qs => qs.folderId === folderId);
            setQuestionSets(direct);
            setAllScopeQuestionSets(mockQuestionSets.filter(qs => scopeFolderIds.includes(qs.folderId)));
            setUsingPlaceholder(true);
          }

          // Fetch notes across scope using recursive endpoint if available, else per folder
          try {
            const recursiveNotesRes = await fetch(`http://localhost:3000/api/folders/${folderId}/all-notes`, { headers });
            if (recursiveNotesRes.ok) {
              const allNotes: Note[] = await recursiveNotesRes.json();
              setAllScopeNotes(allNotes);
              setNotes(allNotes.filter(n => n.folderId === folderId));
            } else {
              throw new Error('all-notes not available');
            }
          } catch (e) {
            console.warn('⚠️ Falling back to per-folder or mock notes', e);
            try {
              const perFolderNotes = await Promise.all(
                scopeFolderIds.map(id => fetch(`http://localhost:3000/api/notes?folderId=${id}`, { headers }).then(r => r.ok ? r.json() : []))
              );
              const allNotes: Note[] = ([] as Note[]).concat(...perFolderNotes);
              setAllScopeNotes(allNotes);
              setNotes(allNotes.filter(n => n.folderId === folderId));
            } catch (inner) {
              setNotes(mockNotes.filter(n => n.folderId === folderId));
              setAllScopeNotes(mockNotes.filter(n => scopeFolderIds.includes(n.folderId || '')));
              setUsingPlaceholder(true);
            }
          }
        } else {
          setCurrentFolder(null);
          // Root: fetch top-level folders with children (tree)
          try {
            const roots = await getFolders(null);
            setFolders(roots);
          } catch (e) {
            console.warn('⚠️ Falling back to mock top-level folders', e);
            setFolders(mockFolders.filter(f => f.parentId === null));
            setUsingPlaceholder(true);
          }
          setQuestionSets([]);
          setNotes([]);
          setAllScopeQuestionSets([]);
          setAllScopeNotes([]);
        }
      } catch (err) {
        console.error("❌ [FoldersPage] Error fetching data, loading mock data:", err);
        if (folderId) {
          const selectedFolder = mockFolders.find(f => f.id === folderId);
          setCurrentFolder(selectedFolder || null);
          setFolders(mockFolders.filter(f => f.parentId === folderId));
          setQuestionSets(mockQuestionSets.filter(qs => qs.folderId === folderId));
          setNotes(mockNotes.filter(n => n.folderId === folderId));
          // All-scope fallbacks
          const descendantIds = mockFolders.filter(f => f.parentId === folderId).map(f => f.id).concat(folderId);
          setAllScopeQuestionSets(mockQuestionSets.filter(qs => descendantIds.includes(qs.folderId)));
          setAllScopeNotes(mockNotes.filter(n => descendantIds.includes(n.folderId || '')));
          // Blueprints: show all
          setBlueprints(mockBlueprints);
          setUsingPlaceholder(true);
      } else {
          setFolders(mockFolders.filter(f => f.parentId === null));
          setQuestionSets([]);
          setNotes([]);
          setAllScopeQuestionSets([]);
          setAllScopeNotes([]);
          setBlueprints(mockBlueprints);
          setCurrentFolder(null);
          setUsingPlaceholder(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [folderId]);

  const handleNewFolder = () => {
    setIsModalOpen(true);
    setIsAddContentModalOpen(false);
  };

  const handleNewQuestionSet = () => {
    navigate(`/folders/${folderId}/question-sets/new`);
    setIsAddContentModalOpen(false);
  };

  const handleNewNote = () => {
    navigate(`/folders/${folderId}/notes/new`);
    setIsAddContentModalOpen(false);
  };

  const handleNewBlueprint = () => {
    navigate(`/folders/${folderId}/blueprints/new`);
    setIsAddContentModalOpen(false);
  };

  const handleCreateFolder = async (name: string, description: string) => {
    try {
      const newFolder = await createFolder({ name, description, parentId: folderId || null });
      setFolders(prevFolders => [...prevFolders, newFolder]);
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create folder'));
    }
  };

  // Derived mappings and filtered lists
  const blueprintIdToLinkedContent = useMemo(() => {
    console.log('🔍 [FoldersPage] Building blueprint mapping:', {
      blueprints: blueprints?.length || 0,
      allScopeQuestionSets: allScopeQuestionSets?.length || 0,
      allScopeNotes: allScopeNotes?.length || 0,
      folderId
    });

    const map: Record<string, { questionSets: QuestionSet[]; notes: Note[] }> = {};
    
    // Ensure blueprints is an array
    const safeBlueprints = Array.isArray(blueprints) ? blueprints : [];
    for (const bp of safeBlueprints) {
      map[bp.id] = { questionSets: [], notes: [] };
    }
    
    // Ensure we have safe arrays to iterate over
    const inScopeQS = folderId && Array.isArray(allScopeQuestionSets) ? allScopeQuestionSets : [];
    const inScopeNotes = folderId && Array.isArray(allScopeNotes) ? allScopeNotes : [];
    
    console.log('🔍 [FoldersPage] Safe arrays for iteration:', {
      inScopeQSLength: inScopeQS.length,
      inScopeNotesLength: inScopeNotes.length
    });
    
    for (const qs of inScopeQS) {
      const bpId = (qs as any).generatedFromBlueprintId as string | undefined;
      if (bpId && map[bpId]) map[bpId].questionSets.push(qs);
    }
    
    for (const n of inScopeNotes) {
      const bpId = (n as any).generatedFromBlueprintId as string | undefined;
      if (bpId && map[bpId]) map[bpId].notes.push(n);
    }
    
    return map;
  }, [blueprints, allScopeQuestionSets, allScopeNotes, folderId]);

  const matchesQuery = (text?: string) => {
    if (!searchQuery.trim()) return true;
    if (!text) return false;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const filteredBlueprints = useMemo(() => {
    return blueprints.filter(bp => matchesQuery(bp.sourceText));
  }, [blueprints, searchQuery]);

  const filteredFolders = useMemo(() => {
    return folders.filter(f => matchesQuery(f.name) || matchesQuery(f.description || ''));
  }, [folders, searchQuery]);

  const filteredQuestionSets = useMemo(() => {
    return questionSets.filter(qs => matchesQuery(qs.name) || matchesQuery(qs.description || ''));
  }, [questionSets, searchQuery]);

  const filteredNotes = useMemo(() => {
    return notes.filter(n => matchesQuery(n.title) || matchesQuery(n.plainText || ''));
  }, [notes, searchQuery]);

  // Recursive search function
  const searchRecursively = useCallback((query: string) => {
    if (!query.trim()) return { folders: [], questionSets: [], notes: [], blueprints: [] };

    const results = {
      folders: [] as Folder[],
      questionSets: [] as QuestionSet[],
      notes: [] as Note[],
      blueprints: [] as LearningBlueprint[]
    };

    const searchText = query.toLowerCase();

    // Helper function to search recursively through folders
    const searchInFolder = (folderId: string | null, currentFolders: Folder[]) => {
      for (const folder of currentFolders) {
        // Check if current folder matches
        if (folder.name.toLowerCase().includes(searchText) || 
            (folder.description && folder.description.toLowerCase().includes(searchText))) {
          results.folders.push(folder);
        }
        
        // Search in subfolders recursively
        if (folder.children && folder.children.length > 0) {
          searchInFolder(folder.id, folder.children);
        }
      }
    };

    // Search in all folders (recursive)
    searchInFolder(null, folders);

    // Search in all question sets in scope
    const allQuestionSets = folderId ? allScopeQuestionSets : questionSets;
    for (const qs of allQuestionSets) {
      if (qs.name.toLowerCase().includes(searchText) || 
          (qs.description && qs.description.toLowerCase().includes(searchText))) {
        results.questionSets.push(qs);
      }
    }

    // Search in all notes in scope
    const allNotes = folderId ? allScopeNotes : notes;
    for (const note of allNotes) {
      if (note.title.toLowerCase().includes(searchText) || 
          (note.plainText && note.plainText.toLowerCase().includes(searchText))) {
        results.notes.push(note);
      }
    }

    // Search in blueprints
    for (const bp of blueprints) {
      if (bp.sourceText.toLowerCase().includes(searchText)) {
        results.blueprints.push(bp);
      }
    }

    return results;
  }, [folders, allScopeQuestionSets, allScopeNotes, questionSets, notes, blueprints, folderId]);

  // Get search results
  const searchResults = useMemo(() => {
    return searchRecursively(searchQuery);
  }, [searchRecursively, searchQuery]);

  // Check if we should show search results
  const shouldShowSearchResults = showSearchResults && searchQuery.trim().length > 0;

  if (isLoading) {
    console.log("🔄 [FoldersPage] Rendering loading state");
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Loading...</h1>
          </div>
        </div>
        <div className={styles.folderList}>
          <div className={styles.folderItem}>
            <FiLoader className={styles.spinner} />
            Loading content...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('❌ [FoldersPage] Error loading content:', error);
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <FiAlertCircle />
          <span>Failed to load content: {error.message}</span>
        </div>
      </div>
    );
  }

  console.log("🎨 [FoldersPage] Rendering content");
  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <Link to="/folders" className={styles.breadcrumbLink}>
          Folders
        </Link>
        {currentFolder && (
          <>
            <FiChevronRight className={styles.breadcrumbSeparator} />
            <span className={styles.breadcrumbLink}>{currentFolder.name}</span>
          </>
        )}
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {currentFolder ? currentFolder.name : 'Folders'}
          </h1>
          {currentFolder && (
            <p className={styles.subtitle}>
              {currentFolder.description || 'No description'}
            </p>
          )}
        </div>
        <div className={styles.headerActions}>
          {folderId && (
            <>
              <button
                className={styles.iconButton}
                title="View all questions in this folder recursively"
                onClick={() => navigate(`/folders/${folderId}/all-questions`)}
              >
                <FiBook />
              </button>
              <button
                className={styles.iconButton}
                title="View all notes in this folder recursively"
                onClick={() => navigate(`/folders/${folderId}/all-notes`)}
              >
                <FiFileText />
              </button>
            </>
          )}
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder={currentFolder ? 'Search this folder and subfolders...' : 'Search all folders...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className={styles.searchInput}
            />
          </div>
          <button 
            className={styles.newFolderBtn}
            onClick={() => setIsAddContentModalOpen(true)}
          >
            <FiPlus />
          </button>
        </div>
      </div>

      {/* Placeholder Banner */}
      {usingPlaceholder && (
        <div className={styles.placeholderBanner} title="Showing placeholder data due to connection issue">
          Using placeholder data
        </div>
      )}

      {/* Search Results */}
      {shouldShowSearchResults && (
        <div className={styles.searchResults}>
          <div className={styles.searchResultsHeader}>
            <h3 className={styles.searchResultsTitle}>
              Search Results for "{searchQuery}"
            </h3>
            <button 
              className={styles.clearSearchBtn}
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </button>
          </div>
          
          {searchResults.folders.length === 0 && 
           searchResults.questionSets.length === 0 && 
           searchResults.notes.length === 0 && 
           searchResults.blueprints.length === 0 ? (
            <div className={styles.noSearchResults}>
              <FiSearch className={styles.noSearchIcon} />
              <p>No results found for "{searchQuery}"</p>
              <p className={styles.noSearchHint}>Try searching for different terms or check your spelling.</p>
            </div>
          ) : (
            <div className={styles.searchResultsContent}>
              {/* Folders */}
              {searchResults.folders.length > 0 && (
                <div className={styles.searchSection}>
                  <h4 className={styles.searchSectionTitle}>
                    <FiFolder className={styles.searchSectionIcon} />
                    Folders ({searchResults.folders.length})
                  </h4>
                  <div className={styles.searchResultsGrid}>
                    {searchResults.folders.map(folder => (
                      <div key={folder.id} className={styles.searchResultCard}>
                        <Link to={`/folders/${folder.id}`} className={styles.searchResultLink}>
                          <div className={styles.searchResultInfo}>
                            <FiFolder className={styles.searchResultIcon} />
                            <div>
                              <h5 className={styles.searchResultName}>{folder.name}</h5>
                              {folder.description && (
                                <p className={styles.searchResultDescription}>{folder.description}</p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Question Sets */}
              {searchResults.questionSets.length > 0 && (
                <div className={styles.searchSection}>
                  <h4 className={styles.searchSectionTitle}>
                    <FiBook className={styles.searchSectionIcon} />
                    Question Sets ({searchResults.questionSets.length})
                  </h4>
                  <div className={styles.searchResultsGrid}>
                    {searchResults.questionSets.map(qs => (
                      <div key={qs.id} className={styles.searchResultCard}>
                        <Link to={`/question-sets/${qs.id}`} className={styles.searchResultLink}>
                          <div className={styles.searchResultInfo}>
                            <FiBook className={styles.searchResultIcon} />
                            <div>
                              <h5 className={styles.searchResultName}>{qs.name}</h5>
                              {qs.description && (
                                <p className={styles.searchResultDescription}>{qs.description}</p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {searchResults.notes.length > 0 && (
                <div className={styles.searchSection}>
                  <h4 className={styles.searchSectionTitle}>
                    <FiFileText className={styles.searchSectionIcon} />
                    Notes ({searchResults.notes.length})
                  </h4>
                  <div className={styles.searchResultsGrid}>
                    {searchResults.notes.map(note => (
                      <div key={note.id} className={styles.searchResultCard}>
                        <Link to={`/notes/${note.id}`} className={styles.searchResultLink}>
                          <div className={styles.searchResultInfo}>
                            <FiFileText className={styles.searchResultIcon} />
                            <div>
                              <h5 className={styles.searchResultName}>{note.title}</h5>
                              {note.plainText && (
                                <p className={styles.searchResultDescription}>
                                  {note.plainText.substring(0, 100)}...
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blueprints */}
              {searchResults.blueprints.length > 0 && (
                <div className={styles.searchSection}>
                  <h4 className={styles.searchSectionTitle}>
                    <GoCpu className={styles.searchSectionIcon} />
                    Blueprints ({searchResults.blueprints.length})
                  </h4>
                  <div className={styles.searchResultsGrid}>
                    {searchResults.blueprints.map(bp => (
                      <div key={bp.id} className={styles.searchResultCard}>
                        <Link to={`/blueprints/${bp.id}/mindmap`} className={styles.searchResultLink}>
                          <div className={styles.searchResultInfo}>
                            <GoCpu className={styles.searchResultIcon} />
                            <div>
                              <h5 className={styles.searchResultName}>{bp.sourceText.substring(0, 80)}...</h5>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sub-folders Section (First) */}
      {filteredFolders.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 className={styles.sectionTitle}>Sub-folders</h2>
              <button 
                className={styles.iconButton}
                onClick={handleNewFolder}
                title="Add new folder"
              >
                <FiPlus />
              </button>
            </div>
          </div>
          <div className={styles.folderGrid}>
            {filteredFolders.map(folder => (
              <div 
                key={folder.id}
                className={styles.folderSquare}
                onClick={() => navigate(`/folders/${folder.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/folders/${folder.id}`); }}
              >
                <div className={styles.folderSquareContent}>
                  <FiFolder className={styles.folderSquareIcon} />
                  <h3 className={styles.folderSquareName}>{folder.name}</h3>
                  {folder.description && (
                    <p className={styles.folderSquareDescription}>{folder.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Blueprints Section (Long cards like current sub-folders) */}
      {filteredBlueprints.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 className={styles.sectionTitle}>Blueprints</h2>
            </div>
          </div>
          <div className={styles.folderList}>
            {(() => {
              try {
                return filteredBlueprints.map(blueprint => {
                  try {
                    const isExpanded = !!expandedBlueprints[blueprint.id];
                    const linked = blueprintIdToLinkedContent[blueprint.id] || { questionSets: [], notes: [] };
                    const filteredLinkedQS = (linked.questionSets || []).filter(qs => matchesQuery(qs.name) || matchesQuery(qs.description || ''));
                    const filteredLinkedNotes = (linked.notes || []).filter(n => matchesQuery(n.title) || matchesQuery(n.plainText || ''));
                    return (
                      <div key={blueprint.id} className={styles.blueprintCard}>
                        <div className={styles.blueprintHeader}>
                          <div className={styles.blueprintTitle}>
                            <div className={styles.blueprintIcon}></div>
                            <h3 className={styles.blueprintName}>{blueprint.sourceText.substring(0, 80)}...</h3>
                          </div>
                          <div className={styles.blueprintActions}>
                            <button
                              className={styles.mindMapBtn}
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/blueprints/${blueprint.id}/mindmap`);
                              }}
                              title="View mind map"
                            >
                              <div className={styles.mindMapIcon}></div>
                            </button>
                            <button
                              className={styles.expandBtn}
                              onClick={() => setExpandedBlueprints(prev => ({ ...prev, [blueprint.id]: !prev[blueprint.id] }))}
                              aria-label={isExpanded ? 'Collapse' : 'Expand'}
                              title={isExpanded ? 'Hide linked content' : 'Show linked content'}
                            >
                              {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                            </button>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className={styles.blueprintContent}>
                            {filteredLinkedQS.length > 0 && (
                              <div className={styles.linkedSection}>
                                <h4 className={styles.linkedSectionTitle}>Question Sets</h4>
                                <div className={styles.linkedItems}>
                                  {filteredLinkedQS.map(set => (
                                    <div key={set.id} className={styles.linkedItem}>
                                      <Link to={`/question-sets/${set.id}`} className={styles.linkedItemLink}>
                                        <div className={styles.linkedItemInfo}>
                                          <FiBook className={styles.linkedItemIcon} />
                                          <div>
                                            <h5 className={styles.linkedItemName}>{set.name}</h5>
                                            {set.description && (
                                              <p className={styles.linkedItemDescription}>{set.description}</p>
                                            )}
                                          </div>
                                        </div>
                                      </Link>
                                      <div className={styles.linkedItemActions}>
                                        <button
                                          className={styles.reviewBtn}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            navigate(`/review/select/${set.id}`);
                                          }}
                                        >
                                          Begin Review
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {filteredLinkedNotes.length > 0 && (
                              <div className={styles.linkedSection}>
                                <h4 className={styles.linkedSectionTitle}>Notes</h4>
                                <div className={styles.linkedItems}>
                                  {filteredLinkedNotes.map(note => (
                                    <Link key={note.id} to={`/notes/${note.id}`} className={styles.linkedItem}>
                                      <div className={styles.linkedItemInfo}>
                                        <FiFileText className={styles.linkedItemIcon} />
                                        <div>
                                          <h5 className={styles.linkedItemName}>{note.title}</h5>
                                          {note.plainText && (
                                            <p className={styles.linkedItemDescription}>
                                              {note.plainText.substring(0, 100)}...
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                            {filteredLinkedQS.length === 0 && filteredLinkedNotes.length === 0 && (
                              <div className={styles.noLinkedContent}>No linked content in this scope.</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  } catch (error) {
                    console.error('❌ [FoldersPage] Error rendering blueprint card:', error);
                    return (
                      <div key={blueprint.id} className={styles.blueprintCard}>
                        <div className={styles.blueprintHeader}>
                          <div className={styles.blueprintTitle}>
                            <div className={styles.blueprintIcon}></div>
                            <h3 className={styles.blueprintName}>Error loading blueprint</h3>
                          </div>
                        </div>
                      </div>
                    );
                  }
                });
              } catch (error) {
                console.error('❌ [FoldersPage] Error rendering blueprints section:', error);
                return (
                  <div className={styles.error}>
                    <FiAlertCircle />
                    <span>Error loading blueprints: {error instanceof Error ? error.message : 'Unknown error'}</span>
                  </div>
                );
              }
            })()}
          </div>
        </section>
      )}

      {/* Question Sets Section */}
      {filteredQuestionSets.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 className={styles.sectionTitle}>Question Sets</h2>
              {folderId && (
                <Link to={`/folders/${folderId}/all-questions`} title="View all questions" style={{ display: 'flex', alignItems: 'center' }}>
                  <FiExternalLink />
                </Link>
              )}
              <button 
                className={styles.iconButton} // You might need to define this style
                onClick={handleNewQuestionSet}
                title="Add new question set"
              >
                <FiPlus />
              </button>
            </div>
          </div>
          <div className={styles.notesGrid}>
            {filteredQuestionSets.map(set => (
              <div key={set.id} className={styles.questionSetCard}>
                <Link to={`/question-sets/${set.id}`} className={styles.cardInfoLink}>
                  <div className={styles.folderInfo}>
                    <FiBook className={styles.folderIcon} />
                    <div>
                      <h3 className={styles.folderName}>{set.name}</h3>
                      {set.description && (
                        <p className={styles.folderDescription}>{set.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
                <div className={styles.cardActions}>
                  <button
                    className={styles.reviewBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/review/select/${set.id}`);
                    }}
                  >
                    Begin Review
                  </button>
                  {folderId && (
                    <button
                      className={styles.iconButton}
                      title="View all questions in this folder recursively"
                      onClick={(e) => { e.preventDefault(); navigate(`/folders/${folderId}/all-questions`); }}
                    >
                      <FiExternalLink />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Legacy Blueprints section removed; blueprints now listed first with expandable linked content */}

      {/* Notes Section */}
      {filteredNotes.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 className={styles.sectionTitle}>Notes</h2>
              {folderId && (
                <Link to={`/folders/${folderId}/all-notes`} title="View all notes" style={{ display: 'flex', alignItems: 'center' }}>
                  <FiExternalLink />
                </Link>
              )}
              <button 
                className={styles.iconButton}
                onClick={handleNewNote}
                title="Add new note"
              >
                <FiPlus />
              </button>
            </div>
          </div>
          <div className={styles.notesGrid}>
            {filteredNotes.map(note => (
              <Link 
                key={note.id} 
                to={`/notes/${note.id}`}
                className={styles.itemCard}
              >
                <div className={styles.folderInfo}>
                  <FiFileText className={styles.folderIcon} />
                  <div>
                    <h3 className={styles.folderName}>{note.title}</h3>
                    {note.plainText && (
                      <p className={styles.folderDescription}>
                        {note.plainText.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {folderId && (
            <div style={{ marginTop: 8 }}>
              <button
                className={styles.iconButton}
                title="View all notes in this folder recursively"
                onClick={() => navigate(`/folders/${folderId}/all-notes`)}
              >
                <FiExternalLink />
              </button>
            </div>
          )}
        </section>
      )}

      {/* Empty State */}
      {filteredFolders.length === 0 && filteredQuestionSets.length === 0 && filteredNotes.length === 0 && filteredBlueprints.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconContainer}>
            <FiFolder className={styles.emptyFolderIcon} />
          </div>
          <h2 className={styles.emptyTitle}>No content yet</h2>
          <p className={styles.emptyDescription}>
            Get started by creating a new folder, question set, or note.
          </p>
          <button 
            className={styles.emptyStateBtn}
            onClick={handleNewFolder}
          >
            <FiPlus />
            Create New Content
          </button>
        </div>
      )}

      <CreateFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateFolder}
      />

      <AddContentModal
        isOpen={isAddContentModalOpen}
        onClose={() => setIsAddContentModalOpen(false)}
        onAddFolder={() => { setIsAddContentModalOpen(false); handleNewFolder(); }}
        onAddQuestionSet={() => { setIsAddContentModalOpen(false); handleNewQuestionSet(); }}
        onAddNote={() => { setIsAddContentModalOpen(false); handleNewNote(); }}
        onAddBlueprint={() => { setIsAddContentModalOpen(false); handleNewBlueprint(); }}
      />
    </div>
  );
}
