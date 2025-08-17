import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import MasteryLineChart from '../../components/stats/MasteryLineChart';
import CircularProgress from '../../components/stats/CircularProgress';
import { UUESegmentedProgressBar } from '../../components/stats/SegmentedProgressBar';
import styles from './MasteryPage.module.css';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import CarouselItemCard from '../../components/stats/CarouselItemCard';
import LoadingText from '../../components/LoadingText';
import TextWaveEffect from '../../components/TextWaveEffect';
import type { BlueprintSection, KnowledgePrimitive } from '../../types/blueprintSection';
import { 
  mockBlueprintSections, 
  mockKnowledgePrimitives, 
  mockWeeklyProgress, 
  getUueScores, 
  getMasteryHistory,
  getPrimitiveMasteryHistory
} from '../../data/mockMasteryData';

type MasteryItem = (BlueprintSection | KnowledgePrimitive) & { isPinned: boolean };

// Recursive component to display blueprint sections with their subsections
const SectionTree: React.FC<{
  sections: BlueprintSection[];
  primitives: KnowledgePrimitive[];
  onPin: (item: MasteryItem) => void;
  navigate: (path: string) => void;
  selectedSectionId?: string | null;
  selectedPrimitiveId?: string | null;
}> = ({ sections, primitives, onPin, navigate, selectedSectionId, selectedPrimitiveId }) => {
  console.log('🌳 [SectionTree] Rendering with:', { sections, primitives });
  console.log('🌳 [SectionTree] sections length:', sections.length);
  console.log('🌳 [SectionTree] primitives length:', primitives.length);
  
  // State to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  const toggleSection = (sectionId: string) => {
    console.log('🔄 [SectionTree] Toggling section:', sectionId);
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
        console.log('🔄 [SectionTree] Collapsed section:', sectionId);
      } else {
        newSet.add(sectionId);
        console.log('🔄 [SectionTree] Expanded section:', sectionId);
      }
      console.log('🔄 [SectionTree] New expanded sections:', Array.from(newSet));
      return newSet;
    });
  };
  
  const renderSection = (section: BlueprintSection, depth: number = 0) => {
    console.log('📁 [SectionTree] Rendering section:', section.title, 'with children:', section.children.length);
    const sectionPrimitives = primitives.filter(p => p.sectionId === section.id);
    const hasChildren = section.children.length > 0 || sectionPrimitives.length > 0;
    const isExpanded = expandedSections.has(section.id);
    console.log('📁 [SectionTree] section has children:', hasChildren, 'children count:', section.children.length, 'primitives count:', sectionPrimitives.length);
    
    return (
              <div key={section.id} className={styles.sectionTreeItem} style={{ marginLeft: `${depth * 20}px` }}>
          <div className={styles.sectionHeader}>
            <div 
              className={`${styles.sectionCard} ${selectedSectionId === section.id ? styles.selected : ''}`}
              onClick={() => navigate(`/blueprints/mastery?sectionId=${section.id}`)}
              tabIndex={0}
              role="button"
              aria-label={`View mastery for ${section.title}`}
              onKeyDown={() => navigate(`/blueprints/mastery?sectionId=${section.id}`)}
            >
                            <CarouselItemCard
                  name={section.title}
                  masteryScore={section.masteryProgress?.overallProgress || 0}
                  understandScore={0} // These would need to be added to BlueprintSection type if available
                  useScore={0}
                  exploreScore={0}
                  onClick={() => navigate(`/blueprints/mastery?sectionId=${section.id}`)}
                />
          </div>
          <div className={styles.sectionActions}>
            {hasChildren && (
              <button
                className={styles.dropdownButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection(section.id);
                }}
                aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            <button
              className={styles.pinButton}
              onClick={() => onPin({ ...section, isPinned: false })}
            >
              Pin
            </button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className={styles.sectionChildren}>
            {/* Render subsections */}
            {(() => {
              console.log('📂 [SectionTree] Rendering children for section:', section.title, 'children count:', section.children.length);
              return section.children.map(childSection => {
                console.log('📂 [SectionTree] Rendering child section:', childSection.title);
                return renderSection(childSection, depth + 1);
              });
            })()}
            
            {/* Render knowledge primitives in this section */}
            {sectionPrimitives.map(primitive => (
              <div key={primitive.id} className={styles.primitiveItem} style={{ marginLeft: `${(depth + 1) * 20}px` }}>
                              <div className={`${styles.primitiveCard} ${selectedPrimitiveId === primitive.id ? styles.selected : ''}`}>
                <CarouselItemCard
                  name={primitive.title}
                  masteryScore={0} // These would need to be added to KnowledgePrimitive type if available
                  understandScore={0}
                  useScore={0}
                  exploreScore={0}
                  onClick={() => navigate(`/blueprints/mastery?primitiveId=${primitive.id}`)}
                />
              </div>
                <button
                  className={styles.pinButton}
                  onClick={() => onPin({ ...primitive, isPinned: false })}
                >
                  Pin
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Only render top-level sections (those without parents or with null parentSectionId)
  const topLevelSections = sections.filter(section => !section.parentSectionId);
  console.log('🌳 [SectionTree] topLevelSections:', topLevelSections.map(s => ({ title: s.title, children: s.children.length })));
  
  return (
    <div className={styles.sectionTree}>
      {topLevelSections.map(section => renderSection(section))}
    </div>
  );
};

const MasteryPage: React.FC = () => {
  // Debug: Log mock data availability
  console.log('🔍 [MasteryPage] Mock data check:', {
    sectionsAvailable: mockBlueprintSections.length,
    primitivesAvailable: mockKnowledgePrimitives.length,
    firstSection: mockBlueprintSections[0]?.title,
    firstPrimitive: mockKnowledgePrimitives[0]?.title
  });
  
  const [searchParams] = useSearchParams();
  const sectionId = searchParams.get('sectionId');
  const primitiveId = searchParams.get('primitiveId');
  const navigate = useNavigate();
  const location = useLocation();

  // Overall stats
  const [overallStats, setOverallStats] = useState<any>(null);
  const [loadingOverall, setLoadingOverall] = useState(true);
  const [errorOverall, setErrorOverall] = useState<string | null>(null);

  // Section-specific stats
  const [sectionDetails, setSectionDetails] = useState<any>(null);
  const [loadingSection, setLoadingSection] = useState(false);
  const [errorSection, setErrorSection] = useState<string | null>(null);

  // Primitive-specific stats
  const [primitiveDetails, setPrimitiveDetails] = useState<any>(null);
  const [loadingPrimitive, setLoadingPrimitive] = useState(false);
  const [errorPrimitive, setErrorPrimitive] = useState<string | null>(null);

  // New state for all sections and primitives
  const [sections, setSections] = useState<BlueprintSection[]>([]);
  const [primitives, setPrimitives] = useState<KnowledgePrimitive[]>([]);
  const [pinnedItems, setPinnedItems] = useState<MasteryItem[]>([]);
  const [unpinnedItems, setUnpinnedItems] = useState<MasteryItem[]>([]);

  // State for weekly progress
  const [weeklyProgress] = useState(mockWeeklyProgress);

  // Use imported mock data - always load mock data as fallback
  useEffect(() => {
    // Always set mock data regardless of API status
    console.log('🔄 [MasteryPage] Loading mock data:', { 
      sections: mockBlueprintSections.length, 
      primitives: mockKnowledgePrimitives.length 
    });
    
    // Set the mock data
    setSections(mockBlueprintSections);
    setPrimitives(mockKnowledgePrimitives);
    
    // Also set the section details for the current section if viewing one
    if (sectionId) {
      const section = mockBlueprintSections.find(s => s.id === sectionId);
      if (section) {
        setSectionDetails(section);
      }
    }
    
    // Set primitive details if viewing one
    if (primitiveId) {
      const primitive = mockKnowledgePrimitives.find(p => p.id === primitiveId);
      if (primitive) {
        setPrimitiveDetails(primitive);
      }
    }
    
    setLoadingOverall(false);
  }, [sectionId, primitiveId]);

  // Pin/Unpin handlers
  const handlePin = async (item: MasteryItem) => {
    // Optimistically update UI
    setUnpinnedItems(prev => prev.filter(i => i.id !== item.id));
    setPinnedItems(prev => [...prev, { ...item, isPinned: true }]);

    try {
      // In real implementation, this would call an API
      console.log('Pinning item:', item);
    } catch (error) {
      // Revert UI on error
      setPinnedItems(prev => prev.filter(i => i.id !== item.id));
      setUnpinnedItems(prev => [...prev, { ...item, isPinned: false }]);
      alert('Failed to pin item. Please try again.');
    }
  };

  const handleUnpin = async (item: MasteryItem) => {
    // Optimistically update UI
    setPinnedItems(prev => prev.filter(i => i.id !== item.id));
    setUnpinnedItems(prev => [...prev, { ...item, isPinned: false }]);

    try {
      // In real implementation, this would call an API
      console.log('Unpinning item:', item);
    } catch (error) {
      // Revert UI on error
      setUnpinnedItems(prev => prev.filter(i => i.id !== item.id));
      setPinnedItems(prev => [...prev, { ...item, isPinned: true }]);
      alert('Failed to unpin item. Please try again.');
    }
  };

  // Render logic
  if (loadingOverall) {
    return <div className={styles.centered}><LoadingText /></div>;
  }
  
  // Show error message but still display mock data
  const errorMessage = errorOverall ? (
    <div className={styles.errorBanner}>
      <p>⚠️ {errorOverall}</p>
      <p>Showing mock data for demonstration purposes.</p>
    </div>
  ) : null;

  // PRIMITIVE VIEW
  if (primitiveId) {
    if (loadingPrimitive) return <div className={styles.centered}><TextWaveEffect text="Loading Primitive Details..." color="#007bff" effect="gradient" /></div>;
    if (errorPrimitive) return <div className={styles.centered}>{errorPrimitive}</div>;
    
    // Find the primitive from our loaded data
    const primitive = primitives.find(p => p.id === primitiveId);
    if (!primitive) {
      // Fallback to mock data if not found in current primitives
      const mockPrimitive = mockKnowledgePrimitives.find(p => p.id === primitiveId);
      if (!mockPrimitive) return <div className={styles.centered}>Primitive details not found.</div>;
      
      return (
        <div className={styles.pageRoot}>
          <Breadcrumbs />
          <div className={styles.primitivePage}> 
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h1 className={styles.pageTitle}>{mockPrimitive.title} - Primitive Mastery</h1>
              <button
                onClick={() => navigate('/blueprints/mastery')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                ← Back to Overview
              </button>
            </div>
            
            <div className={styles.topSection}>
              <div className={styles.chartCard}>
                <MasteryLineChart
                  data={getPrimitiveMasteryHistory(mockPrimitive.id)}
                  title={`${mockPrimitive.title} Mastery Over Time`}
                  height={220}
                />
              </div>
              <div className={styles.uuBarBox}>
                <UUESegmentedProgressBar
                  understandScore={getUueScores(mockPrimitive.sectionId).understandScore}
                  useScore={getUueScores(mockPrimitive.sectionId).useScore}
                  exploreScore={getUueScores(mockPrimitive.sectionId).exploreScore}
                  height={12}
                  showLabels={true}
                  showValues={true}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.pageRoot}>
        <Breadcrumbs />
        <div className={styles.primitivePage}> 
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 className={styles.pageTitle}>{primitive.title} - Primitive Mastery</h1>
            <button
              onClick={() => navigate('/blueprints/mastery')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              ← Back to Overview
            </button>
          </div>
                      <div className={styles.topSection}>
              <div className={styles.chartCard}>
                <MasteryLineChart
                  data={getPrimitiveMasteryHistory(primitive.id)}
                  title={`${primitive.title} Mastery Over Time`}
                  height={220}
                />
              </div>
              <div className={styles.uuBarBox}>
                <UUESegmentedProgressBar
                  understandScore={getUueScores(primitive.sectionId).understandScore}
                  useScore={getUueScores(primitive.sectionId).useScore}
                  exploreScore={getUueScores(primitive.sectionId).exploreScore}
                  height={12}
                  showLabels={true}
                  showValues={true}
                />
              </div>
            </div>
        </div>
      </div>
    );
  }

  // SECTION VIEW
  if (sectionId) {
    if (loadingSection) return <div className={styles.centered}><TextWaveEffect text="Loading Section Details..." color="#007bff" effect="gradient" /></div>;
    if (errorSection) return <div className={styles.centered}>{errorSection}</div>;
    
    // Find the section from our loaded data
    const section = sections.find(s => s.id === sectionId);
    if (!section) {
      // Fallback to mock data if not found in current sections
      const mockSection = mockBlueprintSections.find(s => s.id === sectionId);
      if (!mockSection) return <div className={styles.centered}>Section not found.</div>;
      return (
        <div className={styles.pageRoot}>
          <Breadcrumbs />
          <div className={styles.sectionPage}> 
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h1 className={styles.pageTitle}>{mockSection.title} - Section Mastery</h1>
              <button
                onClick={() => navigate('/blueprints/mastery')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                ← Back to Overview
              </button>
            </div>
            
            <div className={styles.topSection}>
              <div className={styles.chartCard}>
                <MasteryLineChart
                  data={getMasteryHistory(mockSection.id)}
                  title={`${mockSection.title} Mastery Over Time`}
                  height={260}
                />
              </div>
              <div className={styles.uuBarBox}>
                <UUESegmentedProgressBar
                  understandScore={getUueScores(mockSection.id).understandScore}
                  useScore={getUueScores(mockSection.id).useScore}
                  exploreScore={getUueScores(mockSection.id).exploreScore}
                  height={12}
                  showLabels={true}
                  showValues={true}
                />
              </div>
            </div>
            
            {/* Knowledge Primitives Section */}
            <h2 className={styles.sectionTitle}>Knowledge Primitives in this Section</h2>
            <div className={styles.primitivesGrid}>
              {mockKnowledgePrimitives.filter(p => p.sectionId === mockSection.id).length > 0 ? (
                mockKnowledgePrimitives.filter(p => p.sectionId === mockSection.id).map((primitive) => (
                  <div
                    key={primitive.id}
                    className="card" 
                    onClick={() => navigate(`/blueprints/mastery?primitiveId=${primitive.id}`)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View mastery for ${primitive.title}`}
                    onKeyDown={() => navigate(`/blueprints/mastery?primitiveId=${primitive.id}`)}
                  >
                    <CircularProgress
                      percentage={getPrimitiveMasteryHistory(primitive.id).slice(-1)[0]?.score || 0}
                      size={70} 
                      label={primitive.title}
                    />
                    <div className={styles.primitiveInfo}> 
                      <span className={styles.primitiveName}>{primitive.title}</span>
                      <span className={styles.primitiveType}>{primitive.primitiveType}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No knowledge primitives found in this section.</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.pageRoot}>
        <Breadcrumbs />
        <div className={styles.sectionPage}> 
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 className={styles.pageTitle}>{section.title} - Section Mastery</h1>
            <button
              onClick={() => navigate('/blueprints/mastery')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              ← Back to Overview
            </button>
          </div>
          <div className={styles.topSection}>
            <div className={styles.chartCard}>
              <MasteryLineChart
                data={getMasteryHistory(section.id)}
                title={`${section.title} Mastery Over Time`}
                height={260}
              />
            </div>
            <div className={styles.uuBarBox}>
              <UUESegmentedProgressBar
                understandScore={getUueScores(section.id).understandScore}
                useScore={getUueScores(section.id).useScore}
                exploreScore={getUueScores(section.id).exploreScore}
                height={12}
                showLabels={true}
                showValues={true}
              />
            </div>
          </div>
          
          {/* Knowledge Primitives Section */}
          <h2 className={styles.sectionTitle}>Knowledge Primitives in this Section</h2>
          <div className={styles.primitivesGrid}>
            {primitives.filter(p => p.sectionId === sectionId).length > 0 ? (
              primitives.filter(p => p.sectionId === sectionId).map((primitive) => (
                <div
                  key={primitive.id}
                  className="card" 
                  onClick={() => navigate(`/blueprints/mastery?primitiveId=${primitive.id}`)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View mastery for ${primitive.title}`}
                  onKeyDown={() => navigate(`/blueprints/mastery?primitiveId=${primitive.id}`)}
                >
                  <CircularProgress
                    percentage={getPrimitiveMasteryHistory(primitive.id).slice(-1)[0]?.score || 0}
                    size={70} 
                    label={primitive.title}
                  />
                  <div className={styles.primitiveInfo}> 
                    <span className={styles.primitiveName}>{primitive.title}</span>
                    <span className={styles.primitiveType}>{primitive.primitiveType}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No knowledge primitives found in this section.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // OVERALL VIEW (Default if no sectionId or primitiveId)
  console.log('🎯 [MasteryPage] Rendering OVERALL VIEW');
  console.log('🎯 [MasteryPage] Current state:', { sectionId, primitiveId, sections: sections.length, primitives: primitives.length });
  console.log('🎯 [MasteryPage] Sections data:', sections);
  console.log('🎯 [MasteryPage] Primitives data:', primitives);
  
  return (
    <div className={styles.pageRoot}>
      <Breadcrumbs />
      <div className={styles.masteryPage}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className={styles.pageTitle}>Blueprint Mastery</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link 
              to="/blueprints/mindmap"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              🗺️ View Mind Map
            </Link>
            <button
              onClick={async () => {
                console.log('🔄 [MasteryPage] Manual refresh triggered');
                setLoadingOverall(true);
                setErrorOverall(null);
                
                try {
                  // Force refetch all data - in real implementation this would call APIs
                  console.log('✅ [MasteryPage] Manual refresh completed successfully');
                } catch (error) {
                  console.error('❌ [MasteryPage] Manual refresh error:', error);
                  setErrorOverall('Failed to refresh data. Please try again.');
                } finally {
                  setLoadingOverall(false);
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
        
        {/* Error Message Banner */}
        {errorMessage}
        
        {/* Debug Info */}
        <div style={{ 
          background: '#f3f4f6', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '1rem',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <strong>Debug Info:</strong> Sections: {sections.length}, Primitives: {primitives.length}
          {sections.length === 0 && (
            <span style={{ color: '#dc2626', marginLeft: '1rem' }}>
              ⚠️ No data loaded - check console for details
            </span>
          )}
          {sections.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <strong>Loaded Sections:</strong>
              {sections.slice(0, 3).map(s => (
                <span key={s.id} style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem', background: '#e5e7eb', borderRadius: '0.25rem' }}>
                  {s.title} ({s.masteryProgress?.overallProgress || 0}%)
                </span>
              ))}
              {sections.length > 3 && <span style={{ marginLeft: '0.5rem' }}>... and {sections.length - 3} more</span>}
            </div>
          )}
        </div>
        
        {/* Weekly Progress Box */}
        <div className={styles.weeklyProgressBox}>
          <h2 className={styles.weeklyProgressTitle}>This Week's Mastery Progress</h2>
          <div className={styles.weeklyProgressStats}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Sections Reviewed</div>
              <div className={styles.statValue}>{weeklyProgress.itemsReviewed}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Mastery Gained</div>
              <div className={styles.statValue}>+{weeklyProgress.masteryGained}%</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Streak</div>
              <div className={styles.statValue}>{weeklyProgress.streakDays} days</div>
            </div>
          </div>
        </div>

        {/* Pinned Items Section */}
        <section className={styles.pinnedSection}>
          <h2 className={styles.sectionTitle}>Pinned Items</h2>
          {pinnedItems.length === 0 ? (
            <p className={styles.emptyMessage}>No pinned items yet. Pin your favorite sections and primitives from below!</p>
          ) : (
            <div className={styles.pinnedGrid}>
              {pinnedItems.map(item => (
                <div key={item.id} className={styles.pinnedItem}>
                  <button
                    className={styles.unpinButton}
                    onClick={() => handleUnpin(item)}
                    aria-label="Unpin item"
                  >
                    📌
                  </button>
                  <MasteryLineChart
                    data={('masteryProgress' in item && item.masteryProgress) ? [{
                      timestamp: item.masteryProgress.lastUpdated,
                      score: item.masteryProgress.overallProgress
                    }] : []}
                    title={item.title || 'Untitled'}
                    height={200}
                  />
                  <UUESegmentedProgressBar
                    understandScore={('sectionId' in item) ? getUueScores(item.sectionId).understandScore : 0}
                    useScore={('sectionId' in item) ? getUueScores(item.sectionId).useScore : 0}
                    exploreScore={('sectionId' in item) ? getUueScores(item.sectionId).exploreScore : 0}
                    height={8}
                    showLabels={true}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section Tree Section */}
        <section className={styles.sectionTreeSection}>
          <h2 className={styles.sectionTitle}>All Blueprint Sections & Primitives</h2>
          {sections.length === 0 ? (
            <div className={styles.centered}>
              <p>No sections available. Loading mock data...</p>
              <button 
                onClick={() => {
                  setSections(mockBlueprintSections);
                  setPrimitives(mockKnowledgePrimitives);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Load Mock Data
              </button>
            </div>
          ) : (
            <SectionTree
              sections={sections}
              primitives={primitives}
              onPin={handlePin}
              navigate={navigate}
              selectedSectionId={sectionId}
              selectedPrimitiveId={primitiveId}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default MasteryPage;

