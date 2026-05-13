/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TraineesPage from "./pages/TraineesPage";
import TraineeProfilePage from "./pages/TraineeProfilePage";
import RoadmapPage from "./pages/RoadmapPage";
import RequestsPage from "./pages/RequestsPage";
import ActivityPage from "./pages/ActivityPage";
import AccountsPage from "./pages/AccountsPage";

// Components
import Sidebar from "./components/Sidebar";

// Theme Types & Context
type Theme = "light" | "dark";
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

// Auth Context (Pseudo-auth for prototype)
type Role = "manager" | "trainee" | null;
interface AuthContextType {
  role: Role;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// Layout Wrapper
const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  
  return (
    <div className="flex h-screen bg-surface-50 text-surface-text overflow-hidden font-sans transition-colors duration-500">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative p-4 md:p-8 lg:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { role } = useAuth();
  if (!role) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [role, setRole] = useState<Role>(null);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === "light" ? "dark" : "light";
      return newTheme;
    });
  };
  const login = (newRole: Role) => setRole(newRole);
  const logout = () => setRole(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Handle default font loading (Recipe 1 & 11 vibe)
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ role, login, logout }}>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/trainees" element={<ProtectedRoute><TraineesPage /></ProtectedRoute>} />
            <Route path="/trainee/:id" element={<ProtectedRoute><TraineeProfilePage /></ProtectedRoute>} />
            <Route path="/roadmap/:id" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
            <Route path="/activity" element={<ProtectedRoute><ActivityPage /></ProtectedRoute>} />
            <Route path="/accounts" element={<ProtectedRoute><AccountsPage /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

