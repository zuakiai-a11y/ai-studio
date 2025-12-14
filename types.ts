
export enum ViewState {
  SPLASH = 'SPLASH',
  FEATURE_SHOWCASE = 'FEATURE_SHOWCASE',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP', // Added for custom signup flow
  AVATAR_SELECT = 'AVATAR_SELECT',
  BASIC_INFO = 'BASIC_INFO',
  CHAT = 'CHAT',
  AI_ASSISTANT = 'AI_ASSISTANT',
  DASHBOARD = 'DASHBOARD',
  WHITEBOARD = 'WHITEBOARD', // Collaborative Legacy Whiteboard
  WHITEBOARD_EDITOR = 'WHITEBOARD_EDITOR', // New Personal Whiteboard Editor
  TASKS = 'TASKS',
  CALCULATOR = 'CALCULATOR',
  STUDY_HUB = 'STUDY_HUB', // Now Resource Center
  TEST_SERIES = 'TEST_SERIES', // Legacy Test Engine Hub (can be deprecated or kept)
  TEST_RUNNER = 'TEST_RUNNER', // Taking the test
  TEST_ANALYSIS = 'TEST_ANALYSIS', // Post-test report
  PROFILE = 'PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE',
  LEADERBOARD = 'LEADERBOARD',
  PLANNER = 'PLANNER',
  DAILY_FOCUS = 'DAILY_FOCUS',
  QUIZ_GENERATOR = 'QUIZ_GENERATOR',
  ANALYSIS = 'ANALYSIS',
  RANK_PREDICTOR = 'RANK_PREDICTOR',
  NOTIFICATIONS = 'NOTIFICATIONS',
  SETTINGS = 'SETTINGS',
  ABOUT_US = 'ABOUT_US',
  CONTACT_US = 'CONTACT_US',
  FEEDBACK = 'FEEDBACK',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  FLASHCARDS = 'FLASHCARDS', // Legacy Flashcards
  FORMULA_FLASHCARDS = 'FORMULA_FLASHCARDS', // NEW: Syllabus Formula System
  NEO_TIMER = 'NEO_TIMER', // NEW: Advanced Timer
  SHORT_NOTES = 'SHORT_NOTES', // NEW: Founder Content System
  CALENDAR = 'CALENDAR',
  DOUBT_SOLVER = 'DOUBT_SOLVER',
  CERTIFICATE = 'CERTIFICATE',
  MAKE_TEST = 'MAKE_TEST', // Custom Test Builder
  QUIZ_CHALLENGE = 'QUIZ_CHALLENGE',
  ZUKAI_TUBE = 'ZUKAI_TUBE',
  MOTIVATION = 'MOTIVATION',
  PYQ_PAPERS = 'PYQ_PAPERS',
  FORMULA_VAULT = 'FORMULA_VAULT',
  
  // New Test Lab Views
  TEST_LAB_HOME = 'TEST_LAB_HOME',
  TEST_INSTRUCTIONS = 'TEST_INSTRUCTIONS', // Added
  TEST_LAB_INTERFACE = 'TEST_LAB_INTERFACE',
  TEST_LAB_RESULT = 'TEST_LAB_RESULT',

  // Notes
  STRENGTH_NOTES = 'STRENGTH_NOTES'
}

export type NoteColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

// Whiteboard Specific Types
export interface StrokePoint {
  x: number;
  y: number;
}

export interface WhiteboardStroke {
  points: StrokePoint[];
  color: string;
  width: number;
  type: 'pen' | 'highlighter' | 'eraser';
}

export interface WhiteboardPage {
  id: string;
  strokes: WhiteboardStroke[];
  thumbnail?: string; // Base64 Data URL
}

export interface Note {
  id: string;
  title: string;
  content: string; // Used for text notes
  checklist?: ChecklistItem[]; // Used for list notes
  type: 'text' | 'list' | 'image' | 'drawing' | 'whiteboard';
  color: NoteColor;
  labels: string[];
  isPinned: boolean;
  isArchived: boolean;
  isStarred: boolean; // Special Zuaki feature
  reminder?: string; // ISO date string
  images?: string[]; // Array of base64 or URLs
  collaborators?: string[];
  createdAt: number;
  updatedAt?: number;
  // Whiteboard Data
  whiteboardPages?: WhiteboardPage[];
}

export interface FormulaSection {
  title: string;
  content: string[]; // Latex or text formulas
  note?: string;
}

export interface FormulaChapter {
  id: string;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Maths';
  sections: FormulaSection[];
  isDownloaded?: boolean;
}

// Updated Question Model for JEE 2025 Engine
export interface Question {
  id: string;
  year?: number;
  shift?: number;
  text: string; // Mapped from questionText
  image?: string;
  type: 'MCQ' | 'NUMERICAL';
  options?: string[]; // For MCQ
  correctAnswer: string | number; // Option index or number
  explanation: string;
  solutionSteps?: string; // Step-by-step
  formulaUsed?: string[];
  subject: 'Physics' | 'Chemistry' | 'Maths';
  chapter: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isPYQ?: boolean;
  pyqLabel?: string; 
  // Analytics Fields
  timeSpent?: number; // Seconds
  isBookmarked?: boolean;
}

export interface TestConfig {
  id: string;
  title: string;
  type: 'MOCK' | 'CHAPTER' | 'SUBJECT' | 'PYQ' | 'CUSTOM' | 'MINI';
  subjects: string[];
  chapters?: string[];
  duration: number; // minutes
  questionCount: number;
  questions: Question[];
}

export interface ChapterPerformance {
    name: string;
    accuracy: number;
    avgTime: number; // seconds
    status: 'Strong' | 'Weak' | 'Average';
}

export interface TestResult {
  testId: string;
  testTitle: string;
  score: number;
  totalMarks: number;
  accuracy: number;
  timeTaken: number; // seconds
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  percentile: number;
  rank: number;
  date: string;
  subjectWise: {
    Physics: { score: number, total: number, time: number };
    Chemistry: { score: number, total: number, time: number };
    Maths: { score: number, total: number, time: number };
  };
  answers: Record<string, string | number>; // questionId -> userAnswer
  status: Record<string, 'visited' | 'marked' | 'answered' | 'marked_answered' | 'not_visited'>;
  questionTime: Record<string, number>; // questionId -> seconds
  chapterAnalysis?: ChapterPerformance[];
  questions?: Question[]; // Store structure for review
}

export interface VideoResource {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
  url: string; // Embed ID or Link
  category: 'Physics' | 'Chemistry' | 'Maths' | 'Motivation' | 'Strategy';
  type: 'OneShot' | 'Topic' | 'PYQ_Sol';
}

export interface Message {
  id: string;
  sender: 'me' | 'other' | 'ai';
  senderName?: string; // For groups
  text: string;
  timestamp: Date;
  type: 'text' | 'image' | 'voice' | 'file';
  isDisappearing?: boolean;
  fileUrl?: string;
  isEmergency?: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  isOnline: boolean;
  studyStatus?: string;
  type?: 'dm'; 
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date;
  subject: string;
  aiReminder?: string; // ISO Date string for AI suggested reminder
}

export interface StudyDay {
  day: string; // "Mon", "Tue"
  date: string; // ISO String
  seconds: number;
  subjectBreakdown?: Record<string, number>; // seconds per subject
}

export interface UserStats {
  level: number;
  xp: number;
  dailyStreak: number;
  lastStudyDate: string | null;

  dailyTime: number;   // seconds
  weeklyTime: number;  // seconds
  totalTime: number;   // seconds
  studyTimeHours: number;

  studyHistory: StudyDay[];
  
  // New Analytics
  subjectTimes: Record<string, number>; // Total seconds per subject
  avgFocusSession: number; // minutes
  avgBreakLength: number; // minutes
  sessionsCount: number;

  weeklyProgress: number;
  quizzesAttempted: number;
  accuracy: number;
  aiDoubtsAsked: number;
  rankEstimate: number;
  tasksCompleted: number;

  rewardsTotal: number;
  rewardsClaimed: number;

  weakSubjects: string[];
  strongSubjects: string[];
  
  bookmarkedQuestions?: string[]; // IDs
}

export interface UserSettings {
  notifications: boolean;
  aiTone: 'Friendly' | 'Fast' | 'Detailed' | 'Parent';
  privacyMode: boolean;
  theme: 'Neon Blue' | 'Neon Purple' | 'Mixed Glow';
  studyMode: boolean; // DND
}

export interface GroupMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  type: 'text' | 'image' | 'file' | 'voice';
  timestamp: string;
  isEmergency?: boolean;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  inviteCode: string;
  members: string[];
  creatorId: string;
  createdAt: number;
  memberCount: number;
  messages?: GroupMessage[];
  lastMessage?: { text: string; timestamp: number; sender: string };
  type?: 'group';
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromName: string;
  fromAvatar: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  zaId: string;
  status: 'online' | 'offline' | 'studying';
  streak: number;
}

export interface UserProfile {
  name: string;
  username?: string; // Added for new auth
  avatar: string;
  language: 'English' | 'Hindi' | 'Telugu';
  aiVoice: 'Male' | 'Female';
  email?: string;
  phone?: string;
  college?: string;
  studentClass?: '11' | '12' | 'Dropper';
  examMode?: 'JEE' | 'NEET';
  studyRoutine?: 'Focus Grind' | 'Balanced' | 'Chill Revision'; // New
  dailyTarget?: number; // New
  bio?: string;
  gender?: string;
  disability?: boolean;
  userId?: string;
  stats?: UserStats;
  settings?: UserSettings;
  friends?: string[];
  groups?: string[];
  joinedDate?: string; 
  password?: string; // In real app, never store this here. For this mock, it's used in backend service.
}

export interface Flashcard {
    id: string;
    classLevel: string;
    subject: string;
    chapter: string;
    front: string;
    back: string;
    mastered: boolean;
}

// --- NEW FORMULA SYSTEM ---
export interface FormulaCard {
  id: string;
  front: string; // Concept Name
  back: string; // The Formula
  explanation: string;
  example?: string;
  mastered: boolean;
  starred: boolean;
}

export interface FormulaTopic {
  id: string;
  chapter: string;
  topic: string;
  subject: 'Physics' | 'Chemistry' | 'Maths';
  cards: FormulaCard[];
}

// --- ZUAKI NOTIFICATION SYSTEM (ZNC) ---
export type NotificationCategory = 'MISSION' | 'AVATAR' | 'PERFORMANCE' | 'NOTE' | 'UPDATE';

export interface ZuakiNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  deepLink: string;
}

// --- SHORT NOTES (FOUNDER CONTENT) ---
export interface ShortNote {
    id: string;
    subject: 'Physics' | 'Chemistry' | 'Maths';
    chapter: string;
    fileUrl: string;
    fileType: 'image' | 'pdf';
    uploadedAt: number;
}
