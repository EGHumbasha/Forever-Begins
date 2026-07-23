import { Routes, Route } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AuthScreen from './components/auth/AuthScreen';
import PlannerSetup from './components/auth/PlannerSetup';
import PendingApproval from './components/auth/PendingApproval';
import JoinPlanner from './components/auth/JoinPlanner';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Budget = lazy(() => import('./pages/Budget'));
const LobolaPlanner = lazy(() => import('./pages/LobolaPlanner'));
const Guests = lazy(() => import('./pages/Guests'));
const Families = lazy(() => import('./pages/Families'));
const Vendors = lazy(() => import('./pages/Vendors'));
const Documents = lazy(() => import('./pages/Documents'));
const Settings = lazy(() => import('./pages/Settings'));
const ShoppingLists = lazy(() => import('./pages/ShoppingLists'));
const WeddingDayOps = lazy(() => import('./pages/WeddingDayOps'));
const RiskManagement = lazy(() => import('./pages/RiskManagement'));
const HoneymoonPlanner = lazy(() => import('./pages/HoneymoonPlanner'));
const Reports = lazy(() => import('./pages/Reports'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function PageLoader() {
  return (
    <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
      Loading…
    </div>
  );
}

export default function App() {
  const { user, plannerId, isAdmin, accessStatus, pendingCount, authLoading } = useAuth();
  const { dataLoading } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth loading
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-gold)' }}>FB</span>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 8 }}>Loading…</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) return <AuthScreen />;

  // Non-admin flow:
  //   no request yet  -> enter the Planner ID (Join screen)
  //   pending/rejected -> waiting screen
  //   approved         -> falls through to the app below
  if (!isAdmin && accessStatus === null) {
    return <JoinPlanner />;
  }
  if (!isAdmin && accessStatus !== 'approved') {
    return <PendingApproval status={accessStatus} />;
  }

  // Admin with no planner yet — create it (only the admin ever sees this screen)
  if (isAdmin && !plannerId) return <PlannerSetup />;

  // Approved partner but the admin hasn't created the planner yet
  if (!isAdmin && !plannerId) {
    return <PendingApproval status="pending" />;
  }

  // All good — show the app
  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isAdmin={isAdmin} pendingCount={pendingCount} />
      <div className="main-area">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/lobola" element={<LobolaPlanner />} />
              <Route path="/guests" element={<Guests />} />
              <Route path="/family" element={<Families />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/shopping" element={<ShoppingLists />} />
              <Route path="/wedding-day" element={<WeddingDayOps />} />
              <Route path="/risk" element={<RiskManagement />} />
              <Route path="/honeymoon" element={<HoneymoonPlanner />} />
              <Route path="/reports" element={<Reports />} />
              {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
