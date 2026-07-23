import './CountdownRings.css';

/**
 * The signature element: two interlocking arcs, one for lobola day, one
 * for the wedding day — visually echoing two families/two milestones
 * converging into a single timeline. Deliberately not a generic stat-card
 * grid: order and overlap encode the real relationship between the two
 * events (lobola typically precedes the wedding).
 */
function Ring({ label, days, date, color, size = 168, totalSpan = 180 }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedDays = days === null ? totalSpan : Math.max(0, Math.min(days, totalSpan));
  const progress = days === null ? 0 : 1 - clampedDays / totalSpan;
  const offset = circumference * (1 - progress);
  const isPast = days !== null && days < 0;

  return (
    <div className="ring-block">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="ring-svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="ring-progress"
        />
        <text x="50%" y="46%" textAnchor="middle" className="ring-days" fill="var(--text-primary)">
          {days === null ? '—' : isPast ? 'Today+' : Math.abs(days)}
        </text>
        <text x="50%" y="60%" textAnchor="middle" className="ring-unit" fill="var(--text-secondary)">
          {days === null ? 'no date set' : isPast ? 'has passed' : 'days to go'}
        </text>
      </svg>
      <div className="ring-label">
        <span className="ring-label-dot" style={{ background: color }} />
        <div>
          <p className="ring-label-name">{label}</p>
          <p className="ring-label-date">{date}</p>
        </div>
      </div>
    </div>
  );
}

export default function CountdownRings({ lobolaDays, lobolaDate, weddingDays, weddingDate }) {
  return (
    <div className="countdown-rings">
      <Ring label="Lobola Day" days={lobolaDays} date={lobolaDate} color="var(--color-gold)" />
      <div className="ring-connector" aria-hidden="true">
        <svg width="48" height="2" viewBox="0 0 48 2">
          <line x1="0" y1="1" x2="48" y2="1" stroke="var(--color-faint)" strokeWidth="2" strokeDasharray="2 6" />
        </svg>
      </div>
      <Ring label="Wedding Day" days={weddingDays} date={weddingDate} color="var(--color-emerald-deep)" />
    </div>
  );
}
