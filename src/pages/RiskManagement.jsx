import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import RiskCard from '../components/risk/RiskCard';
import './RiskManagement.css';

export default function RiskManagement() {
  const { data, updateRisk } = useApp();
  const { risks } = data;

  const preparedCount = useMemo(() => risks.filter((r) => r.status === 'prepared').length, [risks]);

  return (
    <div className="page-container">
      <div className="page-header">
        <p className="page-eyebrow">Risk Management</p>
        <h1 className="page-title">Risk Management</h1>
        <p className="page-subtitle">
          Backup plans for the things that can go wrong — so if they do, you already know what to do.
        </p>
      </div>

      <div className="card risk-progress-card">
        <div className="hero-progress-labels">
          <span>Risks Prepared For</span>
          <span className="hero-progress-pct">{preparedCount} / {risks.length}</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${risks.length ? (preparedCount / risks.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="risk-grid">
        {risks.map((risk) => (
          <RiskCard key={risk.id} risk={risk} onUpdate={updateRisk} />
        ))}
      </div>
    </div>
  );
}
