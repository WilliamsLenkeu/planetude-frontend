import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './layouts/AppLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Planning from './pages/Planning';
import PlanningDetail from './pages/PlanningDetail';
import Chat from './pages/Chat';
import Progress from './pages/Progress';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary">Chargement magique... ✨</div>;
  if (!user) return <Navigate to="/auth/login" />;

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />

          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/planning/:id" element={<PlanningDetail />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
