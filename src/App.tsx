import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { JournalProvider } from "./contexts/JournalContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { OnboardingQuestionnaire } from "@/components/onboarding/OnboardingQuestionnaire";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Games from "./pages/Games";
import Journal from "./components/Journal/Journal";

import MindfulMaze from "./components/MindfulMaze/MindfulMaze";
import MemoryMatch from "./components/MemoryMatch/MemoryMatch";
import BreathingGame from "./components/BreathingGame";
import EmojiGarden from "./components/EmojiGarden/EmojiGarden";
import PunchingBag from "./components/PunchingBag/PunchingBag";
import QuizSection from "./components/QuizSection";
import ProfilePage from "./components/Profile/ProfilePage";
import Sahayak from "./components/Sahayak/Sahayak";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <JournalProvider>
      <OnboardingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<OnboardingQuestionnaire />} />
            <Route 
              path="/dashboard" 
              element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
              } 
            />
            <Route 
              path="/journal" 
              element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
              } 
            />
            <Route path="/games" element={<Games />} />
            <Route path="/games/mindful-maze" element={<MindfulMaze />} />
            <Route path="/games/memory-match" element={<MemoryMatch />} />
            <Route path="/games/breathing" element={<BreathingGame />} />
            <Route path="/games/emoji-garden" element={<EmojiGarden />} />
            <Route path="/games/punching-bag" element={<PunchingBag />} />
            <Route path="/games/mental-health-quiz" element={<QuizSection />} />
            <Route 
              path="/profile" 
              element={
              <ProtectedRoute>
              <ProfilePage />
              </ProtectedRoute>
              } 
            />
            <Route path="/sahayak" element={<Sahayak />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </OnboardingProvider>
      </JournalProvider>
  </QueryClientProvider>
);

export default App;