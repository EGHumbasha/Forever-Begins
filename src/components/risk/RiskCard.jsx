import { useState } from 'react';
import { Sparkles, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';
import { RISK_SUGGESTIONS, RISK_STATUS_OPTIONS } from '../../utils/riskContent';

const STATUS_ICONS = {
  'not-prepared': AlertTriangle,
  'in-progress': Clock,
  prepared: ShieldCheck,
};

export default function RiskCard({ risk, onUpdate }) {
  const [plan, setPlan] = useState(risk.defaultPlan);
  const suggestion = RISK_SUGGESTIONS[risk.id];
  const StatusIcon = STATUS_ICONS[risk.status] || AlertTriangle;

  const handleUseSuggestion = () => {
    setPlan(suggestion);
    onUpdate(risk.id, { defaultPlan: suggestion });
  };

  return (
    <div className="card risk-card">
      <div className="card-header-row">
        <h3>{risk.title}</h3>
        <select
          value={risk.status}
          onChange={(e) => onUpdate(risk.id, { status: e.target.value })}
          className={`risk-status-select risk-status-${risk.status}`}
        >
          {RISK_STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <label htmlFor={`plan-${risk.id}`} style={{ marginTop: 'var(--space-3)' }}>Backup Plan</label>
      <textarea
        id={`plan-${risk.id}`}
        rows={5}
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        onBlur={() => onUpdate(risk.id, { defaultPlan: plan })}
        placeholder="What will you do if this happens?"
      />

      {suggestion && plan !== suggestion && (
        <button className="btn btn-ghost btn-sm" onClick={handleUseSuggestion} style={{ marginTop: 'var(--space-2)' }}>
          <Sparkles size={13} /> Use suggested plan
        </button>
      )}

      <label htmlFor={`notes-${risk.id}`} style={{ marginTop: 'var(--space-3)' }}>Notes</label>
      <input
        id={`notes-${risk.id}`}
        defaultValue={risk.notes}
        onBlur={(e) => onUpdate(risk.id, { notes: e.target.value })}
        placeholder="Backup contacts, costs, anything else"
      />
    </div>
  );
}
