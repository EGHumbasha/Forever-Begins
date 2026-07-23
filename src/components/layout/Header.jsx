import { Menu, Moon, Sun, Download, Check, Loader2, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export default function Header({ onMenuClick }) {
  const { data, saveStatus, toggleTheme, exportData } = useApp();
  const { user, logout } = useAuth();
  const names = data.meta.coupleNames;
  const headerLabel =
    names.partner1 && names.partner2 ? `${names.partner1} & ${names.partner2}` : 'Forever Begins';

  return (
    <header className="app-header">
      <button className="header-menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <div className="header-title">
        <span>{headerLabel}</span>
      </div>

      <div className="header-actions">
        <span className={`save-indicator save-${saveStatus}`}>
          {saveStatus === 'saving' ? (
            <Loader2 size={14} className="spin" />
          ) : (
            <Check size={14} />
          )}
          {saveStatus === 'saving' ? 'Saving…' : 'Saved to cloud'}
        </span>

        <button className="header-icon-btn" onClick={exportData} title="Download backup" aria-label="Download backup">
          <Download size={18} />
        </button>

        <button
          className="header-icon-btn"
          onClick={toggleTheme}
          title="Toggle dark mode"
          aria-label="Toggle dark mode"
        >
          {data.settings.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {user && (
          <button
            className="header-icon-btn header-user-btn"
            onClick={logout}
            title={`Signed in as ${user.displayName || user.email} — click to sign out`}
            aria-label="Sign out"
          >
            <span className="header-user-initial">
              {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
            </span>
            <LogOut size={14} className="header-user-logout" />
          </button>
        )}
      </div>
    </header>
  );
}
