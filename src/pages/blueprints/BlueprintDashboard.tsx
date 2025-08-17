import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BlueprintDashboard.module.css';
import { mockBlueprints, mockUserProgress, mockAnalytics } from '../../data/mockData';

const BlueprintDashboard: React.FC = () => {
  return (
    <div className={styles.blueprintDashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blueprint Dashboard</h1>
        <p className={styles.subtitle}>Welcome back! Here's your learning progress</p>
      </div>
      
      {/* User Progress Summary */}
      <div className={styles.progressSummary}>
        <div className={styles.progressCard}>
          <h3 className={styles.progressTitle}>Overall Progress</h3>
          <div className={styles.progressValue}>{mockUserProgress.overallProgress}%</div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${mockUserProgress.overallProgress}%` }}
            />
          </div>
        </div>
        
        <div className={styles.progressCard}>
          <h3 className={styles.progressTitle}>Study Streak</h3>
          <div className={styles.progressValue}>{mockUserProgress.currentStreak} days</div>
          <div className={styles.progressSubtitle}>Longest: {mockUserProgress.longestStreak} days</div>
        </div>
        
        <div className={styles.progressCard}>
          <h3 className={styles.progressTitle}>Total Study Time</h3>
          <div className={styles.progressValue}>{mockUserProgress.totalStudyTime} min</div>
          <div className={styles.progressSubtitle}>This week</div>
        </div>
      </div>

      {/* Blueprints Grid */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Blueprints</h2>
        <div className={styles.grid}>
          {mockBlueprints.map((blueprint) => (
            <div key={blueprint.id} className={styles.card}>
              <Link to={`/blueprints/${blueprint.id}`} className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{blueprint.title}</h3>
                  <span className={`${styles.difficulty} ${styles[blueprint.difficulty.toLowerCase()]}`}>
                    {blueprint.difficulty}
                  </span>
                </div>
                <p className={styles.cardDescription}>{blueprint.summary}</p>
                <div className={styles.cardStats}>
                  <span>{blueprint.knowledgePrimitives.sections} sections</span>
                  <span>{blueprint.knowledgePrimitives.masteryCriteria} criteria</span>
                  <span>{blueprint.estimatedCompletionTime} min</span>
                </div>
              </Link>
              <div className={styles.cardActions}>
                <Link 
                  to={`/blueprints/${blueprint.id}/mindmap`}
                  className={styles.mindmapButton}
                  title="View Mind Map"
                >
                  🗺️
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Study Sessions</h2>
        <div className={styles.activityList}>
          {mockAnalytics.studySessions.slice(0, 3).map((session, index) => (
            <div key={index} className={styles.activityItem}>
              <div className={styles.activityDate}>{session.date}</div>
              <div className={styles.activityDetails}>
                <span>{session.duration} min</span>
                <span>{session.criteriaCovered} criteria</span>
                <span>{session.accuracy}% accuracy</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <Link to="/blueprints/sections" className={styles.actionCard}>
            <h4>Manage Sections</h4>
            <p>Organize your learning content</p>
          </Link>
          <Link to="/blueprints/mastery" className={styles.actionCard}>
            <h4>Track Progress</h4>
            <p>Monitor your mastery levels</p>
          </Link>
          <Link to="/blueprints/questions" className={styles.actionCard}>
            <h4>Question Bank</h4>
            <p>Review and practice</p>
          </Link>
          <Link to="/blueprints/mindmap" className={styles.actionCard}>
            <h4>Mind Map View</h4>
            <p>Visualize your learning structure</p>
          </Link>
          <Link to="/blueprints/ideaspace" className={styles.actionCard}>
            <h4>Ideaspace Explorer</h4>
            <p>Interactive learning navigation</p>
          </Link>
          <Link to="/blueprints/pathways" className={styles.actionCard}>
            <h4>Learning Pathways</h4>
            <p>Mastery criteria and learning paths</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlueprintDashboard;
