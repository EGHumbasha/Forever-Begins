export default function StatCard({ icon: Icon, label, value, sublabel, accent = 'emerald' }) {
  return (
    <div className="card stat-card">
      <div className={`stat-icon stat-icon-${accent}`}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="stat-text">
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
        {sublabel && <p className="stat-sublabel">{sublabel}</p>}
      </div>
    </div>
  );
}
