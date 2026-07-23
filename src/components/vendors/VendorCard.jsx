import { Star, Phone, Mail, FileText, Calendar, Pencil, Trash2 } from 'lucide-react';
import { formatMoney } from '../../utils/dateUtils';

const STATUS_LABELS = {
  considering: 'Considering',
  contacted: 'Contacted',
  booked: 'Booked',
  paid: 'Paid in Full',
  completed: 'Completed',
};

export default function VendorCard({ vendor, currency, onEdit, onDelete, onOpenSchedule }) {
  const balance = vendor.totalCost - vendor.deposit;

  return (
    <div className="card vendor-card">
      <div className="vendor-card-top">
        <div>
          <span className="vendor-category-tag">{vendor.category}</span>
          <h4 className="vendor-name">{vendor.name}</h4>
        </div>
        <span className={`vendor-status vendor-status-${vendor.status}`}>{STATUS_LABELS[vendor.status]}</span>
      </div>

      {vendor.rating > 0 && (
        <div className="vendor-rating" aria-label={`${vendor.rating} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} size={13} fill={n <= vendor.rating ? 'var(--color-gold)' : 'none'} color="var(--color-gold)" />
          ))}
        </div>
      )}

      <div className="vendor-contact-row">
        {vendor.phone && <span><Phone size={12} /> {vendor.phone}</span>}
        {vendor.email && <span><Mail size={12} /> {vendor.email}</span>}
      </div>

      <div className="vendor-cost-row">
        <div>
          <p className="vendor-cost-label">Total</p>
          <p className="vendor-cost-value">{formatMoney(vendor.totalCost, currency)}</p>
        </div>
        <div>
          <p className="vendor-cost-label">Balance</p>
          <p className="vendor-cost-value">{formatMoney(Math.max(0, balance), currency)}</p>
        </div>
        <div className="vendor-contract-tag">
          <FileText size={12} />
          {vendor.contractSigned ? 'Signed' : 'No contract'}
        </div>
      </div>

      {vendor.notes && <p className="vendor-notes">{vendor.notes}</p>}

      <div className="vendor-card-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => onOpenSchedule(vendor)}>
          <Calendar size={13} /> Payments
        </button>
        <button className="icon-btn-ghost" onClick={() => onEdit(vendor)} aria-label={`Edit ${vendor.name}`}>
          <Pencil size={14} />
        </button>
        <button className="icon-btn-danger" onClick={() => onDelete(vendor.id)} aria-label={`Delete ${vendor.name}`}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
