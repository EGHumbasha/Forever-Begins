import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthScreen.css';

export default function AuthScreen() {
  const { login, register, authError } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);
    if (mode === 'register') {
      if (!form.displayName.trim()) {
        setLocalError('Please enter your name.');
        setLoading(false);
        return;
      }
      const result = await register(form.email, form.password, form.displayName.trim());
      if (!result.success) setLocalError(result.error);
    } else {
      const result = await login(form.email, form.password);
      if (!result.success) setLocalError(result.error);
    }
    setLoading(false);
  };

  const error = localError || authError;

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark">FB</span>
          <div>
            <h1 className="auth-brand-name">Forever Begins</h1>
            <p className="auth-brand-tag">Lobola &amp; Wedding Planner</p>
          </div>
        </div>

        <h2 className="auth-title">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Sign in to continue planning.'
            : "Register, then enter your partner's Planner ID to request access."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div>
              <label htmlFor="displayName">Your name</label>
              <input
                id="displayName"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                placeholder="e.g. Rashford"
                autoFocus
              />
            </div>
          )}
          <div>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              autoFocus={mode === 'login'}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={mode === 'register' ? 'At least 6 characters' : ''}
              required
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <button onClick={() => { setMode('register'); setLocalError(''); }}>Register</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => { setMode('login'); setLocalError(''); }}>Sign in</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
