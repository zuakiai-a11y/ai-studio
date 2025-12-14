
import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile, TestConfig, TestResult } from './types';
import { Navigation } from './components/Navigation';
import { SidebarMenu } from './components/SidebarMenu';
import { ActiveTimeTracker } from './components/ActiveTimeTracker';
import { BottomNavigation } from './components/BottomNavigation';
import { ChatInterface } from './components/ChatInterface';
import { GeminiAssistant } from './components/GeminiAssistant';
import { Dashboard } from './components/Dashboard';
import { Whiteboard } from './components/Whiteboard';
import { TodoList } from './components/TodoList';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { FeatureShowcase } from './components/FeatureShowcase';
import { Calculator } from './components/Calculator';
import { CalculatorPopup } from './components/CalculatorPopup';
import { StudyHub } from './components/StudyHub';
import { TestSeries } from './components/TestSeries';
import { Profile } from './components/Profile';
import { EditProfile } from './components/EditProfile';
import { Leaderboard } from './components/Leaderboard';
import { Planner } from './components/Planner';
import { QuizGenerator } from './components/QuizGenerator';
import { RankPredictor } from './components/RankPredictor';
import { AboutUs } from './components/AboutUs';
import { ContactUs } from './components/ContactUs';
import { Feedback } from './components/Feedback';
import { WeeklyAnalysis } from './components/WeeklyAnalysis';
import { Achievements } from './components/Achievements';
import { Notifications } from './components/Notifications';
import { Flashcards } from './components/Flashcards';
import { CalendarView } from './components/CalendarView';
import { DoubtSolver } from './components/DoubtSolver';
import { Certificate } from './components/Certificate';
import { MakeTest } from './components/MakeTest';
import { QuizChallenge } from './components/QuizChallenge';
import { ZukaiTube } from './components/ZukaiTube';
import { MotivationalZone } from './components/MotivationalZone';
import { PYQPapers } from './components/PYQPapers';
import { TestRunner } from './components/TestRunner';
import { TestAnalysis } from './components/TestAnalysis';
import { FormulaVault } from './components/FormulaVault';
import { FormulaFlashcards } from './components/FormulaFlashcards';
import { TestLabDashboard } from './components/TestLabDashboard';
import { TestInstructions } from './components/TestInstructions';
import { TestInterface } from './components/TestInterface';
import { TestResultFull } from './components/TestResultFull';
import { StrengthNotes } from './components/StrengthNotes';
import { ShortNotes } from './components/ShortNotes'; // NEW
import { ZuakiNeoTimer } from './components/ZuakiNeoTimer'; 
import { Auth } from './components/Auth'; 
import { ShieldCheck, Menu, ArrowLeft, User, Plus, X } from 'lucide-react';
import { firebase } from './services/backend';
import { notificationService } from './services/notificationService';
import { statsService } from './services/statsService';

const App: React.FC = () => {
  // 3. AUTO-LOGIN SYSTEM
  // Initialize state based on local storage token check
  const [view, setView] = useState<ViewState>(() => {
    const token = localStorage.getItem('zuaki_auth_token');
    const userId = localStorage.getItem('zuaki_user_id');
    const googleUid = localStorage.getItem('zuaki_google_uid'); // Check google auth
    
    // If we have token and ID (or google uid), we assume logged in for initial render
    if (token && (userId || googleUid)) {
        return ViewState.DASHBOARD;
    }
    return ViewState.SPLASH;
  });

  const [history, setHistory] = useState<ViewState[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  
  // Floating Calculator State
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  
  // Test Lab State
  const [activeTestConfig, setActiveTestConfig] = useState<TestConfig | null>(null);
  
  // Initialize User Profile State (empty initially)
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});

  // Effect: Hydrate User Profile on Auto-Login or manual login
  useEffect(() => {
      const loadProfile = async () => {
          const userId = localStorage.getItem('zuaki_user_id');
          if (userId) {
              try {
                  const doc = await firebase.firestore().doc(`users/${userId}`).get();
                  if (doc.exists) {
                      const data = doc.data();
                      setUserProfile(data);
                      
                      // Routing Logic for Incomplete Profiles
                      if (view === ViewState.DASHBOARD && !data.studentClass) {
                          // Redirect returning users with incomplete profiles to Avatar Select per request
                          setView(ViewState.AVATAR_SELECT);
                      }

                      // --- ZNC: NOTIFICATION CHECKS ---
                      // Run notification logic once profile is loaded
                      notificationService.checkWelcome(data);
                      notificationService.checkDaily(data);
                      
                      const stats = statsService.getStats();
                      notificationService.checkPerformance(stats);
                  }
              } catch(e) { console.error("Profile load failed", e); }
          }
      };
      
      // Load if we are already past auth screens
      if (view !== ViewState.SPLASH && view !== ViewState.LOGIN && view !== ViewState.SIGNUP) {
          loadProfile();
      }
  }, [view]); 

  // --- DEEP LINK HANDLER ---
  const handleDeepLink = (path: string) => {
      // Simple router for ZNC Deep Links
      if (path.includes('/setup/avatar')) handleNavigate(ViewState.AVATAR_SELECT);
      else if (path.includes('/missions/today')) handleNavigate(ViewState.TASKS);
      else if (path.includes('/chapter') || path.includes('/flashcards')) handleNavigate(ViewState.FORMULA_FLASHCARDS);
      else if (path.includes('/profile')) handleNavigate(ViewState.PROFILE);
      else if (path.includes('/tests')) handleNavigate(ViewState.TEST_LAB_HOME);
      else if (path.includes('/missions/booster')) handleNavigate(ViewState.DAILY_FOCUS);
      else if (path.includes('/notes')) handleNavigate(ViewState.STRENGTH_NOTES);
      else if (path.includes('/updates')) handleNavigate(ViewState.FEATURE_SHOWCASE);
      else handleNavigate(ViewState.NOTIFICATIONS);
  };

  // Navigation Logic
  const handleNavigate = (newView: ViewState) => {
      if (newView === view) return;
      setHistory(prev => [...prev, view]);
      setView(newView);
  };

  const handleGoBack = () => {
      if (history.length > 0) {
          const prevView = history[history.length - 1];
          setHistory(prev => prev.slice(0, -1));
          setView(prevView);
      } else {
          setView(ViewState.DASHBOARD);
      }
  };

  const handleSplashComplete = () => {
    const token = localStorage.getItem('zuaki_auth_token');
    if (token) {
        setView(ViewState.DASHBOARD);
    } else {
        setView(ViewState.FEATURE_SHOWCASE); // Then to LOGIN
    }
  };

  const handleShowcaseComplete = () => setView(ViewState.LOGIN);
  
  // Handler for Auth Success
  const handleAuthSuccess = (user: Partial<UserProfile>, isNewUser?: boolean) => {
      setUserProfile(user);
      
      // If new user or profile incomplete, go to Avatar Selection first
      if (isNewUser || !user.studentClass) {
          setView(ViewState.AVATAR_SELECT);
      } else {
          // Returning user with complete profile goes to Dashboard
          setView(ViewState.DASHBOARD);
      }
  };

  const handleLogout = () => {
    localStorage.removeItem('zuaki_auth_token');
    localStorage.removeItem('zuaki_user_id');
    localStorage.removeItem('zuaki_google_uid'); // Clear google data
    localStorage.removeItem('zuaki_email');
    localStorage.removeItem('zuaki_photo_url');
    
    setHistory([]);
    setView(ViewState.LOGIN);
    setUserProfile({});
  };

  // Profile Update Handler (used by Onboarding & EditProfile)
  const handleProfileUpdate = (data: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...data };
    setUserProfile(updated);
    
    // Sync to Backend
    if (updated.userId) {
        firebase.firestore().doc(`users/${updated.userId}`).update(data);
    }

    // Flow Control for Onboarding Steps
    // Avatar -> Info -> Dashboard (Assuming Avatar is first based on handleAuthSuccess)
    if (view === ViewState.AVATAR_SELECT) {
        setView(ViewState.BASIC_INFO);
    } else if (view === ViewState.BASIC_INFO) {
        setView(ViewState.DASHBOARD);
    }
  };

  // --- Test Lab Handlers ---
  const handleStartTest = async (config: any) => {
      // Direct config or generator config
      let testConfig = config;
      if (!config.id) {
          // It's a generator config
          testConfig = await firebase.firestore().tests.generateTest(config);
      }
      
      setActiveTestConfig(testConfig);
      handleNavigate(ViewState.TEST_INSTRUCTIONS);
  };

  const handleTestComplete = async (results: any) => {
      await firebase.firestore().tests.saveResult(results);
      setTestResult(results);
      setHistory(prev => [...prev.slice(0, -1), ViewState.TEST_LAB_HOME]);
      setView(ViewState.TEST_LAB_RESULT);
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.CHAT: return <ChatInterface />;
      case ViewState.AI_ASSISTANT: return <GeminiAssistant userProfile={userProfile} onBack={handleGoBack} />;
      case ViewState.DASHBOARD: return <Dashboard onChangeView={handleNavigate} onOpenCalc={() => setIsCalcOpen(true)} userProfileProp={userProfile} />;
      case ViewState.WHITEBOARD: return <Whiteboard />;
      case ViewState.TASKS: return <TodoList />;
      
      case ViewState.PLANNER: return <Planner />; 
      case ViewState.QUIZ_GENERATOR: return <QuizGenerator onBack={handleGoBack} />;
      case ViewState.RANK_PREDICTOR: return <RankPredictor />;
      
      // Full screen calculator
      case ViewState.CALCULATOR: return <Calculator onClose={() => setView(ViewState.DASHBOARD)} />;
      case ViewState.STUDY_HUB: return <StudyHub onChangeView={handleNavigate} />;
      
      // Legacy Test Series
      case ViewState.TEST_SERIES: return <TestSeries onChangeView={handleNavigate} />;
      case ViewState.TEST_RUNNER: return <TestRunner onComplete={(res) => { setTestResult(res); setView(ViewState.TEST_ANALYSIS); }} onExit={handleGoBack} />;
      case ViewState.TEST_ANALYSIS: return <TestAnalysis result={testResult} onExit={() => setView(ViewState.TEST_SERIES)} />;
      
      // New Test Lab
      case ViewState.TEST_LAB_HOME: return <TestLabDashboard onStartTest={handleStartTest} onViewHistory={(r) => { setTestResult(r); handleNavigate(ViewState.TEST_LAB_RESULT); }} />;
      case ViewState.TEST_INSTRUCTIONS: return activeTestConfig ? <TestInstructions config={activeTestConfig} onStart={() => setView(ViewState.TEST_LAB_INTERFACE)} onCancel={handleGoBack} /> : <div className="p-10 text-white">Loading Test...</div>;
      case ViewState.TEST_LAB_INTERFACE: return activeTestConfig ? <TestInterface config={activeTestConfig} onComplete={handleTestComplete} onExit={handleGoBack} onOpenCalc={() => setIsCalcOpen(true)} /> : <div className="p-10 text-white">Loading Test...</div>;
      case ViewState.TEST_LAB_RESULT: return <TestResultFull result={testResult} onExit={() => setView(ViewState.TEST_LAB_HOME)} />;

      case ViewState.MAKE_TEST: return <MakeTest onBack={handleGoBack} onChallenge={(code) => { setView(ViewState.QUIZ_CHALLENGE); }} />;
      case ViewState.QUIZ_CHALLENGE: return <QuizChallenge />;
      case ViewState.LEADERBOARD: return <Leaderboard />;
      
      // New Content Views
      case ViewState.ZUKAI_TUBE: return <ZukaiTube />;
      case ViewState.MOTIVATION: return <MotivationalZone />;
      case ViewState.PYQ_PAPERS: return <PYQPapers />;
      case ViewState.FORMULA_VAULT: return <FormulaVault onBack={handleGoBack} />;
      case ViewState.FORMULA_FLASHCARDS: return <FormulaFlashcards onBack={handleGoBack} />;
      case ViewState.NEO_TIMER: return <ZuakiNeoTimer />;
      case ViewState.SHORT_NOTES: return <ShortNotes />; // NEW
      
      // Notes & Whiteboard
      case ViewState.STRENGTH_NOTES: return <StrengthNotes onBack={handleGoBack} />;

      // Notifications (New ZNC)
      case ViewState.NOTIFICATIONS: return <Notifications onChangeView={handleDeepLink} />;

      case ViewState.PROFILE: return (
        <Profile 
          userProfile={userProfile} 
          onUpdateProfile={handleProfileUpdate}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
      case ViewState.EDIT_PROFILE: return (
        <EditProfile 
            userProfile={userProfile} 
            onSave={handleProfileUpdate}
            onBack={handleGoBack}
        />
      );
      case ViewState.DAILY_FOCUS: return <TestSeries />;
      case ViewState.ANALYSIS: return <WeeklyAnalysis />;
      case ViewState.ACHIEVEMENTS: return <Achievements />;
      case ViewState.SETTINGS: return (
        <Profile 
          userProfile={userProfile} 
          onUpdateProfile={handleProfileUpdate}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );

      case ViewState.ABOUT_US: return <AboutUs />;
      case ViewState.CONTACT_US: return <ContactUs />;
      case ViewState.FEEDBACK: return <Feedback />;

      case ViewState.FLASHCARDS: return <Flashcards />;
      case ViewState.CALENDAR: return <CalendarView />;
      case ViewState.DOUBT_SOLVER: return <DoubtSolver />;
      case ViewState.CERTIFICATE: return <Certificate userProfile={userProfile} />;
      
      default: return <Dashboard onChangeView={handleNavigate} onOpenCalc={() => setIsCalcOpen(true)} userProfileProp={userProfile} />;
    }
  };

  // --- TOP LEVEL VIEWS (No Layout) ---
  if (view === ViewState.SPLASH) return <SplashScreen onComplete={handleSplashComplete} />;
  if (view === ViewState.FEATURE_SHOWCASE) return <FeatureShowcase onComplete={handleShowcaseComplete} />;
  
  if (view === ViewState.LOGIN || view === ViewState.SIGNUP) {
      return <Auth onLoginSuccess={handleAuthSuccess} initialMode={view === ViewState.LOGIN ? 'LOGIN' : 'SIGNUP'} />;
  }

  // --- ONBOARDING FLOW ---
  // Ensure Avatar comes first based on handleAuthSuccess logic for new users
  if (view === ViewState.AVATAR_SELECT) {
      return <Onboarding step="AVATAR" onComplete={handleProfileUpdate} initialProfile={userProfile} />;
  }
  if (view === ViewState.BASIC_INFO) {
      return <Onboarding step="INFO" onComplete={handleProfileUpdate} initialProfile={userProfile} />;
  }

  return (
    <div className="h-screen w-screen bg-[#020617] flex text-white relative overflow-hidden font-sans selection:bg-cyber-cyan selection:text-black">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-cyber-bg to-cyber-bg opacity-80 z-0"></div>
      
      <ActiveTimeTracker />
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onChangeView={handleNavigate} userProfile={userProfile} />

      {/* Floating Calculator Global Instance */}
      {isCalcOpen && <CalculatorPopup onClose={() => setIsCalcOpen(false)} />}

      <div className="hidden lg:block z-50 h-full relative">
         <Navigation 
            currentView={view} 
            onChangeView={handleNavigate} 
            onLogout={handleLogout} 
            userProfile={userProfile}
         />
      </div>

      <main className="flex-1 h-full relative z-10 flex flex-col items-center">
        {/* Global Back & Menu Button for Mobile */}
        <div className="lg:hidden fixed top-6 left-6 z-[60] flex items-center gap-3">
             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg"
             >
                 <Menu size={20} />
             </button>
             {history.length > 0 && view !== ViewState.DASHBOARD && view !== ViewState.TEST_LAB_INTERFACE && view !== ViewState.STRENGTH_NOTES && view !== ViewState.FORMULA_FLASHCARDS && view !== ViewState.NOTIFICATIONS && view !== ViewState.NEO_TIMER && view !== ViewState.SHORT_NOTES && ( 
                 <button 
                    onClick={handleGoBack}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg animate-in fade-in zoom-in"
                 >
                     <ArrowLeft size={20} />
                 </button>
             )}
        </div>

        {/* Desktop Global Back (Top Left) */}
        {history.length > 0 && view !== ViewState.DASHBOARD && view !== ViewState.TEST_LAB_INTERFACE && view !== ViewState.STRENGTH_NOTES && view !== ViewState.FORMULA_FLASHCARDS && view !== ViewState.NOTIFICATIONS && view !== ViewState.NEO_TIMER && view !== ViewState.SHORT_NOTES && (
            <div className="hidden lg:block absolute top-6 left-6 z-[60]">
                 <button 
                    onClick={handleGoBack}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all"
                    title="Go Back"
                 >
                     <ArrowLeft size={20} />
                 </button>
            </div>
        )}

        <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="flex-1 w-full overflow-hidden relative flex justify-center">
             <div className="w-full h-full">
                {renderContent()}
             </div>
        </div>
        <BottomNavigation currentView={view} onChangeView={handleNavigate} />
      </main>
    </div>
  );
};

export default App;
