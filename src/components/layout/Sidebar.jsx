import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ListChecks, Wallet, Users, HeartHandshake,
  UserPlus, Building2, FileText, ShoppingBag, ClipboardList,
  ShieldAlert, Plane, BarChart3, Settings as SettingsIcon,
  Shield, X,
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/lobola', label: 'Lobola Planner', icon: HeartHandshake },
  { to: '/shopping', label: 'Shopping Lists', icon: ShoppingBag },
  { to: '/guests', label: 'Guests', icon: UserPlus },
  { to: '/vendors', label: 'Vendors', icon: Building2 },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/wedding-day', label: 'Wedding Day Ops', icon: ClipboardList },
  { to: '/risk', label: 'Risk Management', icon: ShieldAlert },
  { to: '/honeymoon', label: 'Honeymoon', icon: Plane },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/family', label: 'Families', icon: Users },
];

export default function Sidebar({ open, onClose, isAdmin, pendingCount = 0 }) {
  return (
    <>
      {open && <div className="sidebar-scrim" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">FB</span>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">Forever Begins</span>
            <span className="sidebar-brand-tag">Lobola &amp; Wedding Planner</span>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-utility-nav">
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) => `sidebar-link sidebar-link-admin ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <Shield size={18} strokeWidth={2} />
              <span>Admin Panel</span>
              {pendingCount > 0 && (
                <span className="sidebar-badge" aria-label={`${pendingCount} pending approval${pendingCount > 1 ? 's' : ''}`}>
                  {pendingCount}
                </span>
              )}
            </NavLink>
          )}
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          >
            <SettingsIcon size={18} strokeWidth={2} />
            <span>Settings</span>
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <p>Two families,<br />one beginning.</p>
        </div>
      </aside>
    </>
  );
}
