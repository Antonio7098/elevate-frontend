export interface LearningPathway {
  id: string;
  title: string;
  description: string;
  blueprintId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in days
  prerequisites: string[];
  learningObjectives: string[];
  targetAudience: string[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Pathway structure
  sections: PathwaySection[];
  milestones: PathwayMilestone[];
  assessments: PathwayAssessment[];
  
  // Progress tracking
  userProgress?: UserPathwayProgress;
}

export interface PathwaySection {
  id: string;
  pathwayId: string;
  title: string;
  description: string;
  orderIndex: number;
  estimatedTimeMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Content
  contentItems: PathwayContentItem[];
  masteryCriteria: string[]; // IDs of mastery criteria
  
  // Prerequisites
  prerequisites: string[]; // IDs of other sections
  isUnlocked: boolean;
}

export interface PathwayContentItem {
  id: string;
  sectionId: string;
  title: string;
  contentType: 'reading' | 'video' | 'interactive' | 'practice' | 'assessment';
  contentUrl?: string;
  estimatedTimeMinutes: number;
  orderIndex: number;
  isRequired: boolean;
  isCompleted?: boolean;
}

export interface PathwayMilestone {
  id: string;
  pathwayId: string;
  title: string;
  description: string;
  orderIndex: number;
  requirements: MilestoneRequirement[];
  rewards?: MilestoneReward[];
  isAchieved?: boolean;
  achievedAt?: string;
}

export interface MilestoneRequirement {
  id: string;
  milestoneId: string;
  requirementType: 'section_completion' | 'mastery_criterion' | 'assessment_score' | 'time_spent';
  requirementValue: number;
  currentValue: number;
  isMet: boolean;
  description: string;
}

export interface MilestoneReward {
  id: string;
  milestoneId: string;
  rewardType: 'badge' | 'certificate' | 'unlock_content' | 'points';
  rewardValue: string | number;
  description: string;
}

export interface PathwayAssessment {
  id: string;
  pathwayId: string;
  title: string;
  description: string;
  assessmentType: 'quiz' | 'project' | 'presentation' | 'peer_review';
  passingScore: number;
  maxAttempts: number;
  timeLimit?: number; // in minutes
  questions: AssessmentQuestion[];
  
  // Results
  userResults?: UserAssessmentResult[];
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  question: string;
  questionType: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  orderIndex: number;
}

export interface UserAssessmentResult {
  id: string;
  userId: number;
  assessmentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  timeSpent: number; // in minutes
  attempts: number;
  completedAt: string;
  
  // Detailed results
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  timeSpent: number; // in seconds
}

export interface UserPathwayProgress {
  id: string;
  userId: number;
  pathwayId: string;
  currentSectionId: string;
  progressPercentage: number;
  sectionsCompleted: number;
  totalSections: number;
  milestonesAchieved: number;
  totalMilestones: number;
  assessmentsPassed: number;
  totalAssessments: number;
  timeSpent: number; // in minutes
  startedAt: string;
  lastActivityAt: string;
  completedAt?: string;
  
  // Detailed progress
  sectionProgress: SectionProgress[];
  milestoneProgress: MilestoneProgress[];
  assessmentProgress: AssessmentProgress[];
}

export interface SectionProgress {
  sectionId: string;
  isCompleted: boolean;
  progressPercentage: number;
  timeSpent: number;
  contentItemsCompleted: number;
  totalContentItems: number;
  completedAt?: string;
}

export interface MilestoneProgress {
  milestoneId: string;
  isAchieved: boolean;
  requirementsMet: number;
  totalRequirements: number;
  progressPercentage: number;
  achievedAt?: string;
}

export interface AssessmentProgress {
  assessmentId: string;
  isPassed: boolean;
  bestScore: number;
  maxScore: number;
  attempts: number;
  lastAttemptAt?: string;
  passedAt?: string;
}

export interface PathwayRecommendation {
  pathwayId: string;
  title: string;
  description: string;
  matchScore: number; // 0-100
  reason: string;
  estimatedBenefit: number; // 0-100
  prerequisitesMet: number;
  totalPrerequisites: number;
  estimatedTimeToStart: number; // in days
  tags: string[];
}

export interface PathwaySearch {
  query: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  estimatedDuration?: {
    min: number;
    max: number;
  };
  prerequisites?: string[];
  sortBy?: 'relevance' | 'popularity' | 'difficulty' | 'duration';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface PathwayAnalytics {
  pathwayId: string;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageCompletionTime: number; // in days
  averageProgress: number; // 0-100
  completionRate: number; // 0-100
  userSatisfaction: number; // 1-5 rating
  commonStruggles: string[];
  recommendations: string[];
}





