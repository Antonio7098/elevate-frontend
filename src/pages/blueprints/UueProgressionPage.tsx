import React from 'react';
import { mockUueProgressions } from '../../data/mockData';
import styles from './UueProgressionPage.module.css';

const UueProgressionPage: React.FC = () => {
  // Add debugging and validation
  React.useEffect(() => {
    console.log('UueProgressionPage: mockUueProgressions data:', mockUueProgressions);
    
    // Validate data structure
    if (mockUueProgressions) {
      mockUueProgressions.forEach((progression, index) => {
        if (!progression.stageData) {
          console.error(`Progression at index ${index} is missing stageData:`, progression);
        }
      });
    }
  }, []);

  // Early return if data is not available
  if (!mockUueProgressions) {
    console.error('UueProgressionPage: mockUueProgressions is undefined');
    return (
      <div className={styles.uuePage}>
        <div className={styles.header}>
          <h1>UUE Progression</h1>
          <p>Error: Unable to load progression data</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.uuePage}>
      <div className={styles.header}>
        <h1>UUE Progression</h1>
        <p>Track your Understanding, Usage, and Extension progression</p>
      </div>

      <div className={styles.stagesOverview}>
        <h2>Current Stage Progress</h2>
        <div className={styles.stagesGrid}>
          {mockUueProgressions && mockUueProgressions.length > 0 ? (
            (() => {
              try {
                return mockUueProgressions.map((progression) => {
                  // Add safety check for stageData
                  if (!progression.stageData) {
                    console.warn('Progression missing stageData:', progression);
                    return null;
                  }
                  
                  return (
                    <div key={progression.id} className={styles.stageCard}>
                      <div className={styles.stageHeader}>
                        <h3>{progression.stageData.title}</h3>
                        <span className={`${styles.status} ${styles[progression.currentStage.toLowerCase()]}`}>
                          {progression.currentStage}
                        </span>
                      </div>
                      <p className={styles.description}>{progression.stageData.description}</p>
                      <div className={styles.requirements}>
                        <h4>Requirements:</h4>
                        <ul>
                          {progression.stageData.requirements.map((req, index) => (
                            <li key={index} className={styles.requirement}>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.progress}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${progression.stageProgress}%` }}
                          ></div>
                        </div>
                        <span className={styles.progressText}>
                          {progression.stageProgress}% Complete
                        </span>
                      </div>
                    </div>
                  );
                });
              } catch (error) {
                console.error('Error rendering progression cards:', error);
                return (
                  <div className={styles.noData}>
                    <p>Error rendering progression data. Please try refreshing the page.</p>
                  </div>
                );
              }
            })()
          ) : (
            <div className={styles.noData}>
              <p>No progression data available. Start learning to see your progress!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UueProgressionPage;
