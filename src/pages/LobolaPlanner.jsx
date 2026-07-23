import { useState } from 'react';
import { Plus, Trash2, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RequirementGroup from '../components/lobola/RequirementGroup';
import FamilyMemberModal from '../components/lobola/FamilyMemberModal';
import NegotiationAgenda from '../components/lobola/NegotiationAgenda';
import './LobolaPlanner.css';

const TABS = [
  { key: 'requirements', label: 'Requirements' },
  { key: 'families', label: 'Families' },
  { key: 'negotiation', label: 'Negotiation Guide' },
];

export default function LobolaPlanner() {
  const {
    data,
    addFamilyMember,
    deleteFamilyMember,
    addRequirement,
    updateRequirement,
    deleteRequirement,
  } = useApp();

  const [tab, setTab] = useState('requirements');
  const [familyModal, setFamilyModal] = useState(null); // 'bride' | 'groom' | null

  const { requirements, brideFamily, groomFamily } = data.lobola;
  const currency = data.meta.currency;

  return (
    <div className="page-container">
      <div className="page-header">
        <p className="page-eyebrow">Lobola Planner</p>
        <h1 className="page-title">Lobola Planner</h1>
        <p className="page-subtitle">Track family contacts, requirements, and your negotiation day plan.</p>
      </div>

      <div className="lobola-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`lobola-tab ${tab === t.key ? 'lobola-tab-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'requirements' && (
        <div className="req-grid">
          <div className="card">
            <RequirementGroup
              title="Cash Payments"
              hint="Rusambo, danga, and other cash items"
              items={requirements.cash}
              hasAmount
              currency={currency}
              onAdd={(item) => addRequirement('cash', item)}
              onUpdate={(id, patch) => updateRequirement('cash', id, patch)}
              onDelete={(id) => deleteRequirement('cash', id)}
            />
          </div>
          <div className="card">
            <RequirementGroup
              title="Cattle"
              hint="Mombe yehumai and related cattle requirements"
              items={requirements.cattle}
              hasQuantity
              currency={currency}
              onAdd={(item) => addRequirement('cattle', item)}
              onUpdate={(id, patch) => updateRequirement('cattle', id, patch)}
              onDelete={(id) => deleteRequirement('cattle', id)}
            />
          </div>
          <div className="card">
            <RequirementGroup
              title="Groceries"
              items={requirements.groceries}
              hasQuantity
              currency={currency}
              onAdd={(item) => addRequirement('groceries', item)}
              onUpdate={(id, patch) => updateRequirement('groceries', id, patch)}
              onDelete={(id) => deleteRequirement('groceries', id)}
            />
          </div>
          <div className="card">
            <RequirementGroup
              title="Clothing"
              items={requirements.clothing}
              hasQuantity
              currency={currency}
              onAdd={(item) => addRequirement('clothing', item)}
              onUpdate={(id, patch) => updateRequirement('clothing', id, patch)}
              onDelete={(id) => deleteRequirement('clothing', id)}
            />
          </div>
          <div className="card">
            <RequirementGroup
              title="Gifts for Relatives"
              hint="Vatete, sekuru, and other family gifts"
              items={requirements.giftsForRelatives}
              hasAmount
              currency={currency}
              onAdd={(item) => addRequirement('giftsForRelatives', item)}
              onUpdate={(id, patch) => updateRequirement('giftsForRelatives', id, patch)}
              onDelete={(id) => deleteRequirement('giftsForRelatives', id)}
            />
          </div>
          <div className="card">
            <RequirementGroup
              title="Transport"
              hint="Cars, fuel, hired transport for the day"
              items={requirements.transport}
              hasAmount
              currency={currency}
              onAdd={(item) => addRequirement('transport', item)}
              onUpdate={(id, patch) => updateRequirement('transport', id, patch)}
              onDelete={(id) => deleteRequirement('transport', id)}
            />
          </div>
        </div>
      )}

      {tab === 'families' && (
        <div className="family-grid">
          <div className="card">
            <div className="card-header-row">
              <h3>Bride's Family</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setFamilyModal('bride')}>
                <Plus size={14} /> Add
              </button>
            </div>
            <FamilyList members={brideFamily} onDelete={(id) => deleteFamilyMember('bride', id)} />
          </div>
          <div className="card">
            <div className="card-header-row">
              <h3>Groom's Family</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setFamilyModal('groom')}>
                <Plus size={14} /> Add
              </button>
            </div>
            <FamilyList members={groomFamily} onDelete={(id) => deleteFamilyMember('groom', id)} />
          </div>
        </div>
      )}

      {tab === 'negotiation' && (
        <NegotiationAgenda
          groomName={data.meta.coupleNames.partner1}
          brideName={data.meta.coupleNames.partner2}
          lobolaDate={data.meta.lobolaDate}
        />
      )}

      {familyModal && (
        <FamilyMemberModal
          side={familyModal}
          onSave={(member) => addFamilyMember(familyModal, member)}
          onClose={() => setFamilyModal(null)}
        />
      )}
    </div>
  );
}

function FamilyList({ members, onDelete }) {
  if (members.length === 0) {
    return <p className="empty-hint">No family members added yet.</p>;
  }
  return (
    <ul className="family-list">
      {members.map((m) => (
        <li key={m.id} className="family-item">
          <div>
            <p className="family-name">{m.name}</p>
            <p className="family-role">{m.role}</p>
            {m.phone && <p className="family-phone"><Phone size={11} /> {m.phone}</p>}
          </div>
          <button className="icon-btn-danger" onClick={() => onDelete(m.id)} aria-label={`Remove ${m.name}`}>
            <Trash2 size={14} />
          </button>
        </li>
      ))}
    </ul>
  );
}
