import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import AdminDashboard from './components/dashboards/AdminDashboard';
import AgentDashboard from './components/dashboards/AgentDashboard';
import FieldView from './pages/FieldView';
import SupportCenter from './pages/SupportCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';

/* Wraps pages that need the public Navbar + Footer */
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  /* Map AuthUser → Navbar shape */
  const navUser = user
    ? {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        avatar: user.avatar_url,
      }
    : null;

  return (
    <>
      <Navbar user={navUser} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Public pages */}
    <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
    <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
    <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
    <Route path="/how-it-works" element={<PublicLayout><Home /></PublicLayout>} />
    <Route path="/support" element={<PublicLayout><SupportCenter /></PublicLayout>} />
    <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
    <Route path="/terms" element={<PublicLayout><TermsOfService /></PublicLayout>} />
    <Route path="/cookies" element={<PublicLayout><CookiePolicy /></PublicLayout>} />

    {/* Auth */}
    <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

    {/* Dashboards */}
    <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
    <Route path="/agent/dashboard" element={<ProtectedRoute allowedRoles={['agent']}><AgentDashboard /></ProtectedRoute>} />

    {/* Field View */}
    <Route path="/field/:id" element={<ProtectedRoute><FieldView /></ProtectedRoute>} />

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;