import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Services from './pages/Services.jsx';
import Memberships from './pages/Memberships.jsx';
import FAQ from './pages/FAQ.jsx';
import About from './pages/About.jsx';
import BookNow from './pages/BookNow';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import TeamPortal from './pages/TeamPortal';
import MemberDashboard from './pages/MemberDashboard';
import MemberLogin from './pages/MemberLogin';
import MemberSignup from './pages/MemberSignup';
import SmsTerms from './pages/SmsTerms';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ClientPortal from './pages/ClientPortal';


const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-cream">
        <div className="w-8 h-8 border-4 border-taupe border-t-clay rounded-full animate-spin"></div>
      </div>
    );
  }

  // Admin and team routes use their own localStorage sessions.
  // Skip the Base44 auth check for these routes so the SDK never
  // intercepts and redirects away from them.
  const isAdminOrTeamRoute =
    location.pathname === '/admin' ||
    location.pathname === '/admin-login' ||
    location.pathname === '/team' ||
    location.pathname === '/provider' ||
    location.pathname === '/provider-login' ||
    location.pathname === '/staff-login';

  if (!isAdminOrTeamRoute && authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/memberships" element={<Memberships />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/book" element={<BookNow />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/team" element={<TeamPortal />} />
        <Route path="/provider" element={<Navigate to="/team" replace />} />
        <Route path="/dashboard" element={<MemberDashboard />} />
        <Route path="/provider-login" element={<Navigate to="/team" replace />} />
        <Route path="/member-login" element={<MemberLogin />} />
        <Route path="/member-signup" element={<MemberSignup />} />
        <Route path="/sms-terms" element={<SmsTerms />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/portal" element={<ClientPortal />} />
        <Route path="/staff-login" element={<Navigate to="/team" replace />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
