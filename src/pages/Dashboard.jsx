import { useState, useEffect } from 'react';
import { CalendarCheck, Wallet, Users, ListChecks, ArrowRight, Plus, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { usePlannerStats } from '../hooks/usePlannerStats';
import { formatDate, formatMoney } from '../utils/dateUtils';
import CountdownRings from '../components/dashboard/CountdownRings';
import StatCard from '../components/dashboard/StatCard';
import AssistantPanel from '../components/dashboard/AssistantPanel';
import OnboardingModal from '../components/dashboard/OnboardingModal';
import './Dashboard.css';

export default function Dashboard() {
  const { data, updateMeta } = useApp();
  const stats = usePlannerStats();
  const { dataLoading } = useApp();
  // Don't show onboarding if data is still loading from Firestore,
  // or if the loaded data already has onboarded: true (seed data)
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    if (!dataLoading && !data.meta.onboarded) {
      setShowOnboarding(true);
    }
    if (data.meta.onboarded) {
      setShowOnboarding(false);
    }
  }, [data.meta.onboarded, dataLoading]);

  return (
    <div className="page-container">
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}

      <div className="page-header dashboard-page-header">
        <div>
          <p className="page-eyebrow">
            {data.meta.coupleNames.partner1 && data.meta.coupleNames.partner2
              ? `${initials(data.meta.coupleNames.partner1)} & ${initials(data.meta.coupleNames.partner2)}`
              : 'Dashboard'}
          </p>
          <h1 className="page-title">Forever begins here</h1>
          <p className="page-subtitle">Everything for your lobola and wedding, in one place.</p>
        </div>
        <Link to="/settings" className="btn btn-ghost btn-sm dashboard-edit-link">
          <Pencil size={14} /> Edit names &amp; dates
        </Link>
      </div>

      <div className="card dashboard-hero">
        <CountdownRings
          lobolaDays={stats.lobolaDays}
          lobolaDate={formatDate(data.meta.lobolaDate)}
          weddingDays={stats.weddingDays}
          weddingDate={formatDate(data.meta.weddingDate)}
        />
        <div className="hero-progress">
          <div className="hero-progress-labels">
            <span>Overall progress</span>
            <span className="hero-progress-pct">{stats.progressPct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${stats.progressPct}%` }} />
          </div>
          <p className="hero-progress-sub">{stats.doneTasks} of {stats.totalTasks} tasks complete</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <StatCard
          icon={ListChecks}
          label="Tasks Remaining"
          value={stats.totalTasks - stats.doneTasks}
          sublabel={stats.overdueTasks.length > 0 ? `${stats.overdueTasks.length} overdue` : 'All on schedule'}
          accent="gold"
        />
        <StatCard
          icon={Wallet}
          label="Budget Used"
          value={formatMoney(stats.totalSpent, data.meta.currency)}
          sublabel={`of ${formatMoney(stats.totalPlanned, data.meta.currency)} planned`}
          accent="emerald"
        />
        <StatCard
          icon={Users}
          label="Guests Confirmed"
          value={stats.confirmedGuests.length}
          sublabel={`${stats.totalHeadcount} total headcount`}
          accent="info"
        />
        <StatCard
          icon={CalendarCheck}
          label="Upcoming (7 days)"
          value={stats.dueSoonTasks.length}
          sublabel="tasks due soon"
          accent="warning"
        />
      </div>

      <div className="dashboard-columns">
        <div className="card upcoming-card">
          <div className="card-header-row">
            <h3>Upcoming Tasks</h3>
            <Link to="/tasks" className="link-arrow">View all <ArrowRight size={14} /></Link>
          </div>
          {stats.dueSoonTasks.length === 0 && stats.overdueTasks.length === 0 ? (
            <p className="empty-hint">Nothing urgent right now — add tasks to start tracking your plan.</p>
          ) : (
            <ul className="upcoming-list">
              {[...stats.overdueTasks, ...stats.dueSoonTasks].slice(0, 6).map((t) => (
                <li key={t.id} className="upcoming-item">
                  <span className={`task-dot priority-${t.priority}`} />
                  <span className="upcoming-item-title">{t.title}</span>
                  <span className="upcoming-item-date">{formatDate(t.dueDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <AssistantPanel suggestions={stats.suggestions} />
      </div>

      <div className="card quick-actions-card">
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Quick Actions</h3>
        <div className="quick-actions-grid">
          <Link to="/tasks" className="quick-action">
            <Plus size={16} /> Add Task
          </Link>
          <Link to="/budget" className="quick-action">
            <Plus size={16} /> Log Expense
          </Link>
          <Link to="/guests" className="quick-action">
            <Plus size={16} /> Add Guest
          </Link>
          <Link to="/lobola" className="quick-action">
            <Plus size={16} /> Lobola Requirement
          </Link>
          <Link to="/vendors" className="quick-action">
            <Plus size={16} /> Add Vendor
          </Link>
          <Link to="/documents" className="quick-action">
            <Plus size={16} /> Generate Document
          </Link>
          <Link to="/shopping" className="quick-action">
            <Plus size={16} /> Shopping List Item
          </Link>
          <Link to="/wedding-day" className="quick-action">
            <Plus size={16} /> Wedding Day Item
          </Link>
          <Link to="/risk" className="quick-action">
            <Plus size={16} /> Review Risk Plan
          </Link>
          <Link to="/honeymoon" className="quick-action">
            <Plus size={16} /> Plan Honeymoon
          </Link>
          <Link to="/reports" className="quick-action">
            <Plus size={16} /> Export a Report
          </Link>
        </div>
      </div>
    </div>
  );
}

function initials(name) {
  if (!name) return '';
  return name.trim().charAt(0).toUpperCase();
}
