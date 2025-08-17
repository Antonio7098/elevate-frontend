import React from 'react';
import { Link } from 'react-router-dom';
import { mockSections } from '../../data/mockData';
import styles from './SectionsPage.module.css';

const SectionsPage: React.FC = () => {
  return (
    <div className={styles.sectionsPage}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>Section Manager</h1>
            <p>Organize and manage your learning sections</p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/blueprints/mindmap" className={styles.mindmapButton}>
              🗺️ View Mind Map
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Total Sections</h3>
          <p className={styles.statNumber}>{mockSections.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Top Level</h3>
          <p className={styles.statNumber}>
            {mockSections.filter(s => !s.parentSectionId).length}
          </p>
        </div>
        <div className={styles.statCard}>
          <h3>Nested</h3>
          <p className={styles.statNumber}>
            {mockSections.filter(s => s.parentSectionId).length}
          </p>
        </div>
      </div>

      <div className={styles.sectionsList}>
        <h2>All Sections</h2>
        <div className={styles.sectionGrid}>
          {mockSections.map((section) => (
            <div key={section.id} className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h3>{section.title}</h3>
                <span className={`${styles.difficulty} ${styles[section.difficulty.toLowerCase()]}`}>
                  {section.difficulty}
                </span>
              </div>
              <p className={styles.description}>{section.description}</p>
              <div className={styles.sectionMeta}>
                <span>Blueprint: {section.blueprintId}</span>
                <span>Order: {section.orderIndex}</span>
                <span>Time: {section.estimatedTime}m</span>
              </div>
              <div className={styles.sectionTags}>
                {section.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionsPage;




