import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiChevronDown, FiChevronRight, FiSearch } from 'react-icons/fi';
import LoadingText from '../components/LoadingText';

import styles from './LibraryPage.module.css';

import type { Folder } from '../types/folder';
import type { QuestionSet } from '../types/questionSet';
import type { Note } from '../types/note.types';
import type { LearningBlueprint as LBFromQS } from '../types/questionSet';

import { getFolders, getFolder } from '../services/folderService';
import { getQuestionSets } from '../services/questionSetService';
import { getNotesForFolder } from '../services/noteService';
import { getLearningBlueprints } from '../services/learningBlueprintService';

import { NoteViewer } from '../components/notes/NoteViewer';

type ContentTab = 'blueprints' | 'sets' | 'notes';


interface TreeNodeState {
  expanded: boolean;
  loading: boolean;
}

export default function LibraryPage() {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();

  // Tree and selection state
  const [topFolders, setTopFolders] = useState<Folder[]>([]);
  const [folderById, setFolderById] = useState<Record<string, Folder>>({});
  const [nodeState, setNodeState] = useState<Record<string, TreeNodeState>>({});
  const [activeFolderId, setActiveFolderId] = useState<string | null>(folderId || null);

  // Toolbar state
  const [contentTab, setContentTab] = useState<ContentTab>('blueprints');


  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    blueprints: LBFromQS[];
    sets: QuestionSet[];
    notes: Note[];
  }>({ blueprints: [], sets: [], notes: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Loaded content
  const [blueprints, setBlueprints] = useState<LBFromQS[]>([]);
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Add ref for folderById to break dependency cycle
  const folderByIdRef = useRef<Record<string, Folder>>({});

  // Keep ref in sync with state
  useEffect(() => {
    folderByIdRef.current = folderById;
  }, [folderById]);


  // Initial load of root folders
  useEffect(() => {
    let mounted = true;
    console.log('Loading root folders...');
    getFolders(null)
      .then((roots) => {
        if (!mounted) return;
        console.log('Root folders loaded:', roots);
        setTopFolders(roots);
        const map: Record<string, Folder> = {};
        const stack: Folder[] = [...roots];
        while (stack.length) {
          const f = stack.pop()!;
          map[f.id] = f;
          (f.children || []).forEach((c) => stack.push(c));
        }
        setFolderById(map);
        if (!activeFolderId && roots.length > 0) {
          console.log('Setting initial active folder to:', roots[0].id);
          setActiveFolderId(roots[0].id);
        }
      })
      .catch((e) => {
        console.error('Failed to load folders', e);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Sync URL param -> selection
  useEffect(() => {
    if (folderId) {
      setActiveFolderId(folderId);
    }
  }, [folderId]);

  const setFolderInMap = useCallback((folder: Folder) => {
    setFolderById((prev) => ({ ...prev, [folder.id]: folder }));
  }, []);

  const ensureChildrenLoaded = useCallback(async (id: string) => {
    const f = folderById[id];
    if (!f) return;
    if (Array.isArray(f.children) && f.children.length > 0) return; // already have some children
    // Try loading children on demand
    setNodeState((s) => ({ ...s, [id]: { expanded: true, loading: true } }));
    try {
      const children = await getFolders(id);
      const updated: Folder = { ...f, children };
      setFolderInMap(updated);
      // If this folder exists in topFolders tree, replace reference immutably
      setTopFolders((roots) => replaceFolderInTree(roots, updated));
    } finally {
      setNodeState((s) => ({ ...s, [id]: { expanded: true, loading: false } }));
    }
  }, [folderById, setFolderInMap]);

  const toggleNode = useCallback(async (id: string) => {
    const st = nodeState[id];
    if (!st || !st.expanded) {
      // expanding
      await ensureChildrenLoaded(id);
      setNodeState((s) => ({ ...s, [id]: { expanded: true, loading: false } }));
    } else {
      // collapsing
      setNodeState((s) => ({ ...s, [id]: { expanded: false, loading: false } }));
    }
  }, [nodeState, ensureChildrenLoaded]);

  const onSelectFolder = useCallback((id: string) => {
    console.log('Selecting folder:', id);
    setActiveFolderId(id);
    navigate(`/library/${id}`);
    // default to Blueprints on selection
    setContentTab('blueprints');
  }, [navigate]);



  const onBlueprintClick = useCallback((blueprintId: string) => {
    navigate(`/blueprints/${blueprintId}/mindmap`);
  }, [navigate]);

  // Gather descendant ids recursively (load if necessary)
  const gatherDescendantIds = useCallback(async (rootId: string): Promise<string[]> => {
    const result: string[] = [];
    const visited = new Set<string>(); // Prevent infinite loops
    
    async function dfs(id: string) {
      if (visited.has(id)) {
        console.warn('Circular reference detected in folder structure:', id);
        return;
      }
      visited.add(id);
      result.push(id);
      
      try {
        const f = folderByIdRef.current[id] || (await getFolder(id));
        if (!folderByIdRef.current[id]) setFolderInMap(f);
        
        if (!Array.isArray(f.children) || f.children.length === 0) {
          // try fetching children lazily
          try {
            const children = await getFolders(id);
            const updated: Folder = { ...f, children };
            setFolderInMap(updated);
            // update visible tree if needed
            setTopFolders((roots) => replaceFolderInTree(roots, updated));
            for (const c of children) await dfs(c.id);
          } catch (e) {
            console.warn('Failed to load children for folder:', id, e);
            // no children or failed; stop
          }
        } else {
          for (const c of f.children) await dfs(c.id);
        }
      } catch (e) {
        console.error('Error processing folder:', id, e);
      }
    }
    
    console.log('Starting to gather descendant IDs for root:', rootId);
    await dfs(rootId);
    console.log('Finished gathering descendant IDs:', result);
    return result;
  }, [setFolderInMap, setTopFolders]);

  // Load content when active folder changes
  useEffect(() => {
    let cancelled = false;
    const maxRetries = 2;
    
    const load = async () => {
      if (!activeFolderId) return;
      console.log('Starting content load for folder:', activeFolderId, 'retry:', retryCount);
      setIsLoadingContent(true);
      
      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (!cancelled) {
          console.warn('Content loading timeout, forcing completion');
          setIsLoadingContent(false);
          setLoadError('Content loading timed out');
        }
      }, 15000); // 15 second timeout
      
      try {
        setLoadError(null);
        
        // Load content for all tabs to ensure we have data regardless of current tab
        const [blueprintsResult, setsResult, notesResult] = await Promise.allSettled([
          (async () => {
            console.log('Loading blueprints...');
            try {
              const result = await getLearningBlueprints();
              console.log('Blueprints API response:', result);
              return result;
            } catch (e) {
              console.error('Error loading blueprints:', e);
              throw e;
            }
          })(),
          (async () => {
            console.log('Loading sets for folder:', activeFolderId);
            const ids = await gatherDescendantIds(activeFolderId);
            console.log('Gathered descendant IDs for sets:', ids);
            const results = await Promise.all(ids.map((id) => getQuestionSets(id)));
            return ([] as QuestionSet[]).concat(...results);
          })(),
          (async () => {
            console.log('Loading notes for folder:', activeFolderId);
            const ids = await gatherDescendantIds(activeFolderId);
            console.log('Gathered descendant IDs for notes:', ids);
            const results = await Promise.all(ids.map((id) => getNotesForFolder(id)));
            return ([] as Note[]).concat(...results);
          })()
        ]);

        if (!cancelled) {
          clearTimeout(timeoutId);
          
          // Handle blueprints
          if (blueprintsResult.status === 'fulfilled') {
            const all = blueprintsResult.value;
            const filtered = Array.isArray(all) && activeFolderId
              ? all.filter((b) => {
                  const blueprintFolderId = String(b.folderId);
                  const activeId = String(activeFolderId);
                  return blueprintFolderId === activeId;
                })
              : [];
            setBlueprints(filtered);
            console.log(`Loaded ${filtered.length} blueprints for folder ${activeFolderId}`);
          } else {
            console.error('Failed to load blueprints:', blueprintsResult.reason);
            setBlueprints([]);
          }

          // Handle sets
          if (setsResult.status === 'fulfilled') {
            setSets(setsResult.value);
            console.log(`Loaded ${setsResult.value.length} sets for folder ${activeFolderId}`);
          } else {
            console.error('Failed to load sets:', setsResult.reason);
            setSets([]);
          }

          // Handle notes
          if (notesResult.status === 'fulfilled') {
            setNotes(notesResult.value);
            console.log(`Loaded ${notesResult.value.length} notes for folder ${activeFolderId}`);
          } else {
            console.error('Failed to load notes:', notesResult.reason);
            setNotes([]);
          }
          
          // Reset retry count on success
          setRetryCount(0);
        }
      } catch (e: any) {
        if (!cancelled) {
          clearTimeout(timeoutId);
          console.error('Failed to load content:', e);
          
          // Retry logic
          if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1);
            console.log(`Retrying content load (${retryCount + 1}/${maxRetries})...`);
            setTimeout(() => {
              if (!cancelled) {
                load();
              }
            }, 1000 * (retryCount + 1)); // Exponential backoff
            return; // Don't set error yet, we're retrying
          }
          
          setLoadError(e?.message || 'Failed to load content after retries');
        }
      } finally {
        if (!cancelled) {
          clearTimeout(timeoutId);
          setIsLoadingContent(false);
          console.log('Content loading completed for folder:', activeFolderId);
        }
      }
    };
    load();
    return () => { 
      cancelled = true;
      console.log('Content loading cancelled for folder:', activeFolderId);
    };
  }, [activeFolderId]);

  const breadcrumb = useMemo(() => {
    if (!activeFolderId) return [] as Folder[];
    // walk up via parentId if available in map
    const parts: Folder[] = [];
    let cur: Folder | undefined = folderById[activeFolderId];
    const guard = new Set<string>();
    while (cur && !guard.has(cur.id)) {
      parts.push(cur);
      guard.add(cur.id);
      if (!cur.parentId) break;
      cur = folderById[cur.parentId];
      if (!cur) break;
    }
    return parts.reverse();
  }, [activeFolderId, folderById]);

  const activeFolder = activeFolderId ? folderById[activeFolderId] : null;

  // Search function that searches recursively in current folder first, then globally
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ blueprints: [], sets: [], notes: [] });
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const searchTerm = query.toLowerCase();
      const results = { blueprints: [] as LBFromQS[], sets: [] as QuestionSet[], notes: [] as Note[] };

      // First, search recursively in the current folder
      if (activeFolderId) {
        const descendantIds = await gatherDescendantIds(activeFolderId);
        
        // Search blueprints in current folder
        const currentBlueprints = await getLearningBlueprints();
        const currentFolderBlueprints = currentBlueprints.filter(bp => 
          descendantIds.includes(String(bp.folderId))
        );
        results.blueprints.push(...currentFolderBlueprints.filter(bp => {
          const title = (bp as any).title || (bp as any).sourceText?.slice(0, 40) || 'Blueprint';
          const desc = (bp as any).description || (bp as any).sourceText?.slice(0, 160) || '';
          return title.toLowerCase().includes(searchTerm) || desc.toLowerCase().includes(searchTerm);
        }));

        // Search sets in current folder
        for (const id of descendantIds) {
          const folderSets = await getQuestionSets(id);
          results.sets.push(...folderSets.filter(set => 
            set.name.toLowerCase().includes(searchTerm) || 
            (set.description && set.description.toLowerCase().includes(searchTerm))
          ));
        }

        // Search notes in current folder
        for (const id of descendantIds) {
          const folderNotes = await getNotesForFolder(id);
          results.notes.push(...folderNotes.filter(note => 
            note.title.toLowerCase().includes(searchTerm)
          ));
        }
      }

      // Then search globally across all folders
      const allBlueprints = await getLearningBlueprints();
      const globalBlueprints = allBlueprints.filter(bp => {
        const title = (bp as any).title || (bp as any).sourceText?.slice(0, 40) || 'Blueprint';
        const desc = (bp as any).description || (bp as any).sourceText?.slice(0, 160) || '';
        const matches = title.toLowerCase().includes(searchTerm) || desc.toLowerCase().includes(searchTerm);
        
        // Only add if not already in current folder results
        if (activeFolderId) {
          return matches && !results.blueprints.some(r => r.id === bp.id);
        }
        return matches;
      });
      results.blueprints.push(...globalBlueprints);

      // Get all folders for global search
      const allFolderIds = Object.keys(folderById);
      
      // Search sets globally
      for (const id of allFolderIds) {
        const folderSets = await getQuestionSets(id);
        const globalSets = folderSets.filter(set => {
          const matches = set.name.toLowerCase().includes(searchTerm) || 
            (set.description && set.description.toLowerCase().includes(searchTerm));
          
          // Only add if not already in current folder results
          if (activeFolderId) {
            return matches && !results.sets.some(r => r.id === set.id);
          }
          return matches;
        });
        results.sets.push(...globalSets);
      }

      // Search notes globally
      for (const id of allFolderIds) {
        const folderNotes = await getNotesForFolder(id);
        const globalNotes = folderNotes.filter(note => {
          const matches = note.title.toLowerCase().includes(searchTerm);
          
          // Only add if not already in current folder results
          if (activeFolderId) {
            return matches && !results.notes.some(r => r.id === note.id);
          }
          return matches;
        });
        results.notes.push(...globalNotes);
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ blueprints: [], sets: [], notes: [] });
    } finally {
      setIsSearching(false);
    }
  }, [activeFolderId, folderById, gatherDescendantIds]);

  // Debounced search effect - only run when searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ blueprints: [], sets: [], notes: [] });
      setShowSearchResults(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]); // Remove performSearch from dependencies



  // Close search results when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(`.${styles.searchBar}`) && !target.closest(`.${styles.searchResultsPanel}`)) {
        setShowSearchResults(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSearchResults(false);
        setSearchQuery('');
      }
    };

    if (showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showSearchResults]);

  return (
    <div className={styles.root}>
      <div className={styles.leftPanel}>
        <div className={styles.leftHeader}>Library</div>
        <div className={styles.tree}>
          {topFolders.map((f) => (
            <TreeNode
              key={f.id}
              folder={f}
              nodeState={nodeState}
              onToggle={toggleNode}
              onSelect={onSelectFolder}
              onEnsureChildren={ensureChildrenLoaded}
              activeId={activeFolderId || ''}
            />
          ))}
        </div>
      </div>

      <div className={styles.mainPanel}>
        <div className={styles.content}>
          <div className={styles.topBar}>
            <div className={styles.titleSection}>
              <h1 className={styles.pageTitle}>{activeFolder?.name || 'Library'}</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <button
                className={`${styles.tabBtn} ${contentTab === 'blueprints' ? styles.active : ''}`}
                onClick={() => setContentTab('blueprints')}
              >
                Blueprints
              </button>
              <button
                className={`${styles.tabBtn} ${contentTab === 'sets' ? styles.active : ''}`}
                onClick={() => setContentTab('sets')}
              >
                Sets
              </button>
              <button
                className={`${styles.tabBtn} ${contentTab === 'notes' ? styles.active : ''}`}
                onClick={() => setContentTab('notes')}
              >
                Notes
              </button>
              <div className={styles.searchBar}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search blueprints, sets, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim()) {
                      setShowSearchResults(true);
                    }
                  }}
                  className={styles.searchInput}
                />
              </div>
            </div>
          </div>

          {/* Search Results Panel - Overlay */}
          {showSearchResults && searchQuery.trim() && (
            <div className={styles.searchResultsPanel}>
              <div className={styles.searchHeader}>
                <h3>Search Results for "{searchQuery}"</h3>
                <button 
                  className={styles.closeSearch}
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchQuery('');
                  }}
                >
                  ×
                </button>
              </div>

              {isSearching ? (
                <div className={styles.searchLoading}>Searching...</div>
              ) : (
                <>
                  {searchResults.blueprints.length > 0 && (
                    <div className={styles.searchSection}>
                      <h4>Blueprints ({searchResults.blueprints.length})</h4>
                      <div className={styles.searchResultsGrid}>
                        {searchResults.blueprints.slice(0, 3).map((bp) => (
                          <div 
                            key={bp.id} 
                            className={styles.searchResultItem}
                            onClick={() => onBlueprintClick(bp.id)}
                          >
                            <div className={styles.searchResultTitle}>
                              {(bp as any).title || (bp as any).sourceText?.slice(0, 40) || 'Blueprint'}
                            </div>
                            <div className={styles.searchResultDesc}>
                              {(bp as any).description || (bp as any).sourceText?.slice(0, 80) || ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.sets.length > 0 && (
                    <div className={styles.searchSection}>
                      <h4>Question Sets ({searchResults.sets.length})</h4>
                      <div className={styles.searchResultsGrid}>
                        {searchResults.sets.slice(0, 3).map((set) => (
                          <div 
                            key={set.id} 
                            className={styles.searchResultItem}
                            onClick={() => navigate(`/question-sets/${set.id}`)}
                          >
                            <div className={styles.searchResultTitle}>{set.name}</div>
                            <div className={styles.searchResultDesc}>
                              {set.description || ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.notes.length > 0 && (
                    <div className={styles.searchSection}>
                      <h4>Notes ({searchResults.notes.length})</h4>
                      <div className={styles.searchResultsGrid}>
                        {searchResults.notes.slice(0, 3).map((note) => (
                          <div 
                            key={note.id} 
                            className={styles.searchResultItem}
                            onClick={() => navigate(`/notes/${note.id}`)}
                          >
                            <div className={styles.searchResultTitle}>{note.title}</div>
                            <div className={styles.searchResultDesc}>
                              {note.plainText?.slice(0, 80) || note.title || ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchQuery.trim() && 
                   searchResults.blueprints.length === 0 && 
                   searchResults.sets.length === 0 && 
                   searchResults.notes.length === 0 && (
                    <div className={styles.searchSection}>
                      <div className={styles.noSearchResults}>No results found.</div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <div className={styles.breadcrumbs}>
            {breadcrumb.length === 0 && <span className={styles.crumbActive}>All</span>}
            {breadcrumb.map((f, idx) => (
              <span key={f.id}>
                <span
                  className={idx === breadcrumb.length - 1 ? styles.crumbActive : styles.crumb}
                  onClick={() => idx < breadcrumb.length - 1 && onSelectFolder(f.id)}
                >
                  {f.name}
                </span>
                {idx < breadcrumb.length - 1 && <span style={{ margin: '0 6px' }}>›</span>}
              </span>
            ))}
          </div>

          <div className={styles.contentArea}>
            {isLoadingContent && <div className={styles.loading}><LoadingText /></div>}
            {!isLoadingContent && loadError && (
              <div className={styles.empty}>{loadError}</div>
            )}

            {!isLoadingContent && !activeFolder && !loadError && (
              <div className={styles.empty}>Select a folder to view content.</div>
            )}

            {!isLoadingContent && activeFolder && !loadError && (
              <>
                {contentTab === 'blueprints' && (
                  <>
                    {blueprints.length === 0 ? (
                      <div className={styles.empty}>
                        <div>No blueprints found in "{activeFolder.name}"</div>
                        <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                          Try selecting a different folder or check if blueprints exist in this location.
                        </div>
                        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-surface-tint)', borderRadius: '8px' }}>
                          <div style={{ fontWeight: 600, marginBottom: '8px' }}>Quick Actions:</div>
                          <button 
                            className={styles.tabBtn}
                            onClick={() => navigate('/create-blueprint')}
                            style={{ marginRight: '8px' }}
                          >
                            Create New Blueprint
                          </button>
                          <button 
                            className={styles.tabBtn}
                            onClick={() => setContentTab('sets')}
                          >
                            View Question Sets
                          </button>
                        </div>
                      </div>
                    ) : (
                      <BlueprintCards
                        blueprints={blueprints}
                        allSets={sets}
                        allNotes={notes}
                        onOpenSet={(id) => navigate(`/question-sets/${id}`)}
                        onOpenNote={(id) => navigate(`/notes/${id}`)}
                        onBlueprintClick={onBlueprintClick}
                      />
                    )}
                  </>
                )}

                {contentTab === 'notes' && (
                  <>
                    {notes.length === 0 ? (
                      <div className={styles.empty}>
                        <div>No notes found in "{activeFolder.name}"</div>
                        <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                          Try selecting a different folder or check if notes exist in this location.
                        </div>
                        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-surface-tint)', borderRadius: '8px' }}>
                          <div style={{ fontWeight: 600, marginBottom: '8px' }}>Quick Actions:</div>
                          <button 
                            className={styles.tabBtn}
                            onClick={() => navigate('/notes/new')}
                            style={{ marginRight: '8px' }}
                          >
                            Create New Note
                          </button>
                          <button 
                            className={styles.tabBtn}
                            onClick={() => setContentTab('blueprints')}
                          >
                            View Blueprints
                          </button>
                        </div>
                      </div>
                    ) : (
                      <NoteList notes={notes} />
                    )}
                  </>
                )}

                {contentTab === 'sets' && (
                  <>
                    {sets.length === 0 ? (
                      <div className={styles.empty}>
                        <div>No question sets found in "{activeFolder.name}"</div>
                        <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                          Try selecting a different folder or check if question sets exist in this location.
                        </div>
                        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-surface-tint)', borderRadius: '8px' }}>
                          <div style={{ fontWeight: 600, marginBottom: '8px' }}>Quick Actions:</div>
                          <button 
                            className={styles.tabBtn}
                            onClick={() => navigate('/create-question-set')}
                            style={{ marginRight: '8px' }}
                          >
                            Create New Question Set
                          </button>
                          <button 
                            className={styles.tabBtn}
                            onClick={() => setContentTab('blueprints')}
                          >
                            View Blueprints
                          </button>
                        </div>
                      </div>
                    ) : (
                      <SetList sets={sets} onOpen={(id) => navigate(`/question-sets/${id}`)} />
                    )}
                  </>
                )}
              </>
            )}
            
            {/* Debug info - remove this later */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ 
                position: 'fixed', 
                bottom: '20px', 
                right: '20px', 
                background: 'rgba(0,0,0,0.8)', 
                color: 'white', 
                padding: '10px', 
                borderRadius: '8px', 
                fontSize: '12px',
                zIndex: 1000
              }}>
                <div>Active Folder: {activeFolderId || 'none'}</div>
                <div>Content Tab: {contentTab}</div>
                <div>Loading: {isLoadingContent ? 'yes' : 'no'}</div>
                <div>Blueprints: {blueprints.length}</div>
                <div>Sets: {sets.length}</div>
                <div>Notes: {notes.length}</div>
                {loadError && <div style={{ color: 'red' }}>Error: {loadError}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function replaceFolderInTree(roots: Folder[], updated: Folder): Folder[] {
  const visit = (arr: Folder[]): Folder[] =>
    arr.map((f) =>
      f.id === updated.id
        ? { ...updated }
        : { ...f, children: f.children ? visit(f.children) : [] }
    );
  return visit(roots);
}

function TreeNode(props: {
  folder: Folder;
  nodeState: Record<string, TreeNodeState>;
  onToggle: (id: string) => void | Promise<void>;
  onEnsureChildren: (id: string) => void | Promise<void>;
  onSelect: (id: string) => void;
  activeId: string;
}) {
  const { folder, nodeState, onToggle, onEnsureChildren, onSelect, activeId } = props;
  const state = nodeState[folder.id];
  const expanded = state?.expanded || false;
  const loading = state?.loading || false;
  const isActive = activeId === folder.id;

  return (
    <div>
      <div 
        className={`${styles.treeNode} ${isActive ? styles.active : ''} ${expanded ? styles.expanded : ''}`}
        onClick={() => {
          // Single click: toggle expansion state
          if (Array.isArray(folder.children) && folder.children.length > 0) {
            onToggle(folder.id);
          }
        }}
        onDoubleClick={() => {
          // Double click: select the folder
          onSelect(folder.id);
        }}
      >
        <div className={styles.nodeContent}>
          <span className={styles.nodeName}>{folder.name}</span>
        </div>
      </div>
              {loading && <div className={styles.loading}><LoadingText /></div>}
      {expanded && Array.isArray(folder.children) && folder.children.length > 0 && (
        <div className={styles.children}>
          {folder.children.map((c) => (
            <TreeNode
              key={c.id}
              folder={c}
              nodeState={nodeState}
              onToggle={onToggle}
              onEnsureChildren={onEnsureChildren}
              onSelect={onSelect}
              activeId={activeId}
            />
          ))}
        </div>
      )}
    </div>
  );
}



function BlueprintCards(props: {
  blueprints: LBFromQS[];
  allSets: QuestionSet[];
  allNotes: Note[];
  onOpenSet: (id: string) => void;
  onOpenNote: (id: string) => void;
  onBlueprintClick: (id: string) => void;
}) {
  const { blueprints, allSets, allNotes, onOpenSet, onOpenNote, onBlueprintClick } = props;
  if (blueprints.length === 0) {
    return <div className={styles.empty}>No blueprints in this folder.</div>;
  }
  return (
    <div className={styles.grid}>
      {blueprints.map((bp) => {
        const linkedSets = allSets.filter((s) => s.generatedFromBlueprintId === bp.id);
        const linkedNotes = allNotes.filter((n) => n.generatedFromBlueprintId === bp.id);
        const title = bp.title || bp.sourceText?.slice(0, 40) || 'Blueprint';
        const desc = bp.description || bp.sourceText?.slice(0, 160) || '';
        return (
          <div 
            key={bp.id} 
            className={styles.card}
            onClick={() => onBlueprintClick(bp.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.blueprintHeader}>
              <div>
                <div style={{ fontWeight: 600 }}>{title}</div>
                {desc && <div style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>{desc}</div>}
                <div className={styles.counts} style={{ marginTop: 6 }}>
                  {linkedSets.length} linked sets | {linkedNotes.length} linked notes
                </div>
              </div>
              
            </div>

            {(linkedSets.length > 0 || linkedNotes.length > 0) && (
              <div className={styles.expandSection}>
                {linkedSets.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Sets</div>
                    <div className={styles.list}>
                      {linkedSets.slice(0, 3).map((s) => (
                        <div key={s.id} className={styles.listItem}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{s.name}</span>
                            <button 
                              className={styles.tabBtn} 
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenSet(s.id);
                              }}
                            >
                              Open
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {linkedNotes.length > 0 && (
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Notes</div>
                    <div className={styles.list}>
                      {linkedNotes.slice(0, 3).map((n) => (
                        <div key={n.id} className={styles.listItem}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{n.title}</span>
                            <button 
                              className={styles.tabBtn} 
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenNote(n.id);
                              }}
                            >
                              Open
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) return <div className={styles.empty}>No notes in this scope.</div>;
  return (
    <div className={styles.list}>
      {notes.map((note) => (
        <div key={note.id} className={styles.listItem}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>{note.title}</div>
          {/* Render read-only preview using NoteViewer */}
          <NoteViewer
            note={note}
            content={Array.isArray((note as any).contentBlocks)
              ? ((note as any).contentBlocks as any)
              : Array.isArray((note as any).content)
                ? ((note as any).content as any)
                : []}
          />
        </div>
      ))}
    </div>
  );
}

function SetList({ sets, onOpen }: { sets: QuestionSet[]; onOpen: (id: string) => void }) {
  if (sets.length === 0) return <div className={styles.empty}>No question sets in this scope.</div>;
  return (
    <div className={styles.list}>
      {sets.map((set) => (
        <div key={set.id} className={styles.listItem}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{set.name}</div>
              {set.description && <div style={{ color: 'var(--lib-muted)' }}>{set.description}</div>}
            </div>
            <button className={styles.tabBtn} onClick={() => onOpen(set.id)}>Open</button>
          </div>
        </div>
      ))}
    </div>
  );
}


