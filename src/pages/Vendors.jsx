import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import VendorCard from '../components/vendors/VendorCard';
import VendorFormModal from '../components/vendors/VendorFormModal';
import VendorPaymentScheduleModal from '../components/vendors/VendorPaymentScheduleModal';
import './Vendors.css';

export default function Vendors() {
  const {
    data,
    addVendor,
    updateVendor,
    deleteVendor,
    addVendorPaymentDue,
    updateVendorPaymentDue,
    deleteVendorPaymentDue,
  } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [scheduleVendor, setScheduleVendor] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { vendors, vendorCategories } = data;
  const currency = data.meta.currency;

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return vendors;
    return vendors.filter((v) => v.category === categoryFilter);
  }, [vendors, categoryFilter]);

  const totals = useMemo(() => {
    const totalCost = vendors.reduce((s, v) => s + Number(v.totalCost), 0);
    const totalDeposits = vendors.reduce((s, v) => s + Number(v.deposit), 0);
    const booked = vendors.filter((v) => ['booked', 'paid', 'completed'].includes(v.status)).length;
    return { totalCost, totalDeposits, booked };
  }, [vendors]);

  const handleSave = (vendorData) => {
    if (editingVendor) {
      updateVendor(editingVendor.id, vendorData);
    } else {
      addVendor(vendorData);
    }
    setEditingVendor(null);
  };

  const handleDelete = (id) => {
    if (confirm('Remove this vendor?')) deleteVendor(id);
  };

  // Keep the schedule modal's vendor data fresh as the underlying data changes
  const liveScheduleVendor = scheduleVendor ? vendors.find((v) => v.id === scheduleVendor.id) : null;

  return (
    <div className="page-container">
      <div className="page-header tasks-header">
        <div>
          <p className="page-eyebrow">Vendor Management</p>
          <h1 className="page-title">Vendors</h1>
          <p className="page-subtitle">Caterers, decorators, photographers, and everyone else making the day happen.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingVendor(null); setShowForm(true); }}>
          <Plus size={16} /> Add Vendor
        </button>
      </div>

      <div className="vendor-summary-row">
        <div className="card guest-summary-card">
          <p className="summary-value">{vendors.length}</p>
          <p className="summary-label">Total Vendors</p>
        </div>
        <div className="card guest-summary-card">
          <p className="summary-value">{totals.booked}</p>
          <p className="summary-label">Booked or Paid</p>
        </div>
        <div className="card guest-summary-card">
          <p className="summary-value">{currency === 'USD' ? '$' : ''}{totals.totalCost.toLocaleString()}</p>
          <p className="summary-label">Total Contracted</p>
        </div>
        <div className="card guest-summary-card">
          <p className="summary-value">{currency === 'USD' ? '$' : ''}{totals.totalDeposits.toLocaleString()}</p>
          <p className="summary-label">Deposits Paid</p>
        </div>
      </div>

      <div className="filter-pills" style={{ marginBottom: 'var(--space-5)' }}>
        <button
          className={`filter-pill ${categoryFilter === 'all' ? 'filter-pill-active' : ''}`}
          onClick={() => setCategoryFilter('all')}
        >
          All
        </button>
        {vendorCategories.map((c) => (
          <button
            key={c}
            className={`filter-pill ${categoryFilter === c ? 'filter-pill-active' : ''}`}
            onClick={() => setCategoryFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <p className="empty-hint">
            {vendors.length === 0
              ? 'No vendors added yet. Add your first one to start tracking quotes, contracts, and payments.'
              : 'No vendors in this category yet.'}
          </p>
        </div>
      ) : (
        <div className="vendor-grid">
          {filtered.map((v) => (
            <VendorCard
              key={v.id}
              vendor={v}
              currency={currency}
              onEdit={(vendor) => { setEditingVendor(vendor); setShowForm(true); }}
              onDelete={handleDelete}
              onOpenSchedule={setScheduleVendor}
            />
          ))}
        </div>
      )}

      {showForm && (
        <VendorFormModal
          initial={editingVendor}
          categories={vendorCategories}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingVendor(null); }}
        />
      )}

      {liveScheduleVendor && (
        <VendorPaymentScheduleModal
          vendor={liveScheduleVendor}
          currency={currency}
          onAdd={addVendorPaymentDue}
          onUpdate={updateVendorPaymentDue}
          onDelete={deleteVendorPaymentDue}
          onClose={() => setScheduleVendor(null)}
        />
      )}
    </div>
  );
}
