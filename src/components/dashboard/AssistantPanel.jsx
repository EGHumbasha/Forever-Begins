import { Sparkles, AlertTriangle, AlertCircle, CheckCircle2, Info } from 'lucide-react';

const ICONS = {
  warning: AlertTriangle,
  danger: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

const COLORS = {
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  success: 'var(--color-success)',
  info: 'var(--color-info)',
};

export default function AssistantPanel({ suggestions }) {
  return (
    <div className="card assistant-panel">
      <div className="assistant-header">
        <Sparkles size={18} color="var(--color-gold)" />
        <h3>Your Coordinator</h3>
      </div>
      <ul className="assistant-list">
        {suggestions.map((s, i) => {
          const Icon = ICONS[s.type] || Info;
          return (
            <li key={i} className="assistant-item">
              <Icon size={16} color={COLORS[s.type]} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{s.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
