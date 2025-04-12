
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import Techniques from "./pages/Techniques";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import AboutPrivacy from "./pages/AboutPrivacy";
import About from "./pages/About";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/about-privacy" element={<AboutPrivacy />} />
              <Route 
                path="/assessment" 
                element={
                  <ProtectedRoute>
                    <Assessment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/settings" 
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/techniques" 
                element={
                  <ProtectedRoute>
                    <Techniques />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/techniques/:id" 
                element={
                  <ProtectedRoute>
                    <Techniques />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
