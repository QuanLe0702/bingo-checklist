import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BoardEditor from './pages/BoardEditor';
import PlayMode from './pages/PlayMode';
import PublicView from './pages/PublicView';
import Auth from './pages/Auth';
import Templates from './pages/Templates';
import UserProfile from './pages/UserProfile';
import ForgotPassword from './pages/ForgotPassword';

/**
 * Component bảo vệ route (yêu cầu đăng nhập)
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/login" />;
};

/**
 * App component chính
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/p/:slug" element={<PublicView />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/board/:id"
          element={
            <ProtectedRoute>
              <BoardEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/board/:id/play"
          element={
            <ProtectedRoute>
              <PlayMode />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
