// Mock data for legacy pages to prevent redirect loops

export const mockFolders = [
  {
    id: 'folder-001',
    name: 'JavaScript Fundamentals',
    description: 'Core JavaScript concepts and practices',
    type: 'learning',
    itemCount: 24,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-25T14:30:00Z'
  },
  {
    id: 'folder-002',
    name: 'React Development',
    description: 'React components, hooks, and patterns',
    type: 'learning',
    itemCount: 18,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-22T16:45:00Z'
  },
  {
    id: 'folder-003',
    name: 'Data Structures',
    description: 'Algorithms and data structure implementations',
    type: 'learning',
    itemCount: 32,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-28T11:20:00Z'
  }
];

export const mockLibraryItems = [
  {
    id: 'lib-001',
    title: 'JavaScript: The Good Parts',
    type: 'book',
    author: 'Douglas Crockford',
    description: 'Essential JavaScript concepts and best practices',
    tags: ['javascript', 'programming', 'best-practices'],
    rating: 4.8,
    readCount: 1250
  },
  {
    id: 'lib-002',
    title: 'React Design Patterns',
    type: 'article',
    author: 'React Team',
    description: 'Common patterns for building React applications',
    tags: ['react', 'patterns', 'frontend'],
    rating: 4.6,
    readCount: 890
  },
  {
    id: 'lib-003',
    title: 'Clean Code',
    type: 'book',
    author: 'Robert C. Martin',
    description: 'Principles for writing clean, maintainable code',
    tags: ['programming', 'clean-code', 'best-practices'],
    rating: 4.9,
    readCount: 2100
  }
];

export const mockProgressData = {
  overallProgress: 65,
  weeklyGoal: 80,
  currentStreak: 12,
  longestStreak: 25,
  totalStudyTime: 320,
  completedItems: 156,
  totalItems: 240,
  recentActivity: [
    {
      date: '2024-01-28',
      items: 8,
      time: 45
    },
    {
      date: '2024-01-27',
      items: 6,
      time: 32
    },
    {
      date: '2024-01-26',
      items: 10,
      time: 58
    }
  ]
};

export const mockChatHistory = [
  {
    id: 'chat-001',
    title: 'JavaScript Closure Questions',
    lastMessage: 'Can you explain how closures work in JavaScript?',
    timestamp: '2024-01-28T15:30:00Z',
    unreadCount: 0
  },
  {
    id: 'chat-002',
    title: 'React State Management',
    lastMessage: 'What\'s the best way to manage state in a large React app?',
    timestamp: '2024-01-28T14:15:00Z',
    unreadCount: 2
  },
  {
    id: 'chat-003',
    title: 'Algorithm Optimization',
    lastMessage: 'How can I optimize this sorting algorithm?',
    timestamp: '2024-01-28T12:45:00Z',
    unreadCount: 1
  }
];

export const mockSettings = {
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    timezone: 'UTC-5',
    language: 'en',
    theme: 'light'
  },
  notifications: {
    email: true,
    push: false,
    reminders: true,
    weeklyReport: true
  },
  privacy: {
    profileVisible: true,
    progressVisible: false,
    allowAnalytics: true
  }
};




