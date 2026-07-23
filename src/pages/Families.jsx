import { useApp } from '../context/AppContext';
import { Phone } from 'lucide-react';
import './Families.css';

export default function Families() {
  const { data } = useApp();
  const { brideFamily, groomFamily } = data.lobola;
  const allMembers = [
    ...brideFamily.map((m) => ({ ...m, side: "Bride's Family" })),
    ...groomFamily.map((m) => ({ ...m, side: "Groom's Family" })),
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <p className="page-eyebrow">Family Coordination</p>
        <h1 className="page-title">Families</h1>
        <p className="page-subtitle">
          A combined view of both families' contacts and roles. Add members from the Lobola Planner's
          Families tab.
        </p>
      </div>

      {allMembers.length === 0 ? (
        <div className="card">
          <p className="empty-hint">
            No family members added yet. Head to the Lobola Planner → Families tab to add contacts for
            both sides.
          </p>
        </div>
      ) : (
        <div className="card">
          <table className="task-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Side</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {allMembers.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.name}</td>
                  <td>
                    <span className={`side-tag ${m.side.startsWith('Bride') ? 'side-bride' : 'side-groom'}`}>
                      {m.side}
                    </span>
                  </td>
                  <td>{m.role || '—'}</td>
                  <td>
                    {m.phone ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Phone size={12} /> {m.phone}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="task-table-cat">{m.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
