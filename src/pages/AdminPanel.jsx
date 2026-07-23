import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, UserX, RefreshCw, Shield, Clock, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

export default function AdminPanel() {
  const { user, plannerId, approveUser, rejectUser, revokeUser, getAccessRequests } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    const data = await getAccessRequests();
    data.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (uid) => {
    if (!plannerId) {
      alert('You need to create a planner first before approving users.');
      return;
    }
    setActionLoading(uid + '_approve');
    await approveUser(uid);
    await fetchRequests();
    setActionLoading(null);
  };

  const handleReject = async (uid) => {
    setActionLoading(uid + '_reject');
    await rejectUser(uid);
    await fetchRequests();
    setActionLoading(null);
  };

  const handleRevoke = async (uid) => {
    if (!confirm('Revoke this user\'s access? They will no longer be able to view or edit the planner.')) return;
    setActionLoading(uid + '_revoke');
    await revokeUser(uid);
    await fetchRequests();
    setActionLoading(null);
  };

  const pending = requests.filter((r) => r.status === 'pending');
  const approved = requests.filter((r) => r.status === 'approved');
  const rejected = requests.filter((r) => r.status === 'rejected');

  return (
    <div className="page-container">
      <div className="page-header">
        <p className="page-eyebrow">Admin</p>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={28} color="var(--color-gold)" /> Admin Panel
        </h1>
        <p className="page-subtitle">
          Manage who can access the planner. Approve your partner's request below.
        </p>
      </div>

      <div className="admin-info-card card">
        <div className="admin-info-row">
          <div>
            <p className="admin-info-label">Signed in as</p>
            <p className="admin-info-value">{user?.displayName} ({user?.email})</p>
          </div>
          <div>
            <p className="admin-info-label">Planner ID</p>
            <p className="admin-info-value admin-planner-id">{plannerId || 'No planner created yet'}</p>
          </div>
        </div>
      </div>

      <div className="admin-section-header">
        <h3><Clock size={16} /> Pending Requests ({pending.length})</h3>
        <button className="btn btn-ghost btn-sm" onClick={fetchRequests}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="empty-hint">Loading...</p>
      ) : pending.length === 0 ? (
        <div className="card">
          <p className="empty-hint">No pending requests. When your partner registers, they'll appear here.</p>
        </div>
      ) : (
        <div className="admin-request-list">
          {pending.map((req) => (
            <div key={req.id} className="admin-request-card card">
              <div className="admin-request-info">
                <p className="admin-request-name">{req.displayName}</p>
                <p className="admin-request-email">{req.email}</p>
                <p className="admin-request-time">Requested {new Date(req.requestedAt).toLocaleString()}</p>
              </div>
              <div className="admin-request-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleApprove(req.uid)}
                  disabled={actionLoading === req.uid + '_approve'}
                >
                  <Check size={14} /> {actionLoading === req.uid + '_approve' ? 'Approving...' : 'Approve'}
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleReject(req.uid)}
                  disabled={actionLoading === req.uid + '_reject'}
                >
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {approved.length > 0 && (
        <>
          <h3 className="admin-section-title"><CheckCircle size={16} color="var(--color-success)" /> Approved Users ({approved.length})</h3>
          <div className="admin-request-list">
            {approved.map((req) => (
              <div key={req.id} className="admin-request-card card admin-request-approved">
                <div className="admin-request-info">
                  <p className="admin-request-name">{req.displayName}</p>
                  <p className="admin-request-email">{req.email}</p>
                  <p className="admin-request-time">Approved {req.approvedAt ? new Date(req.approvedAt).toLocaleString() : ''}</p>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRevoke(req.uid)}
                  disabled={actionLoading === req.uid + '_revoke'}
                >
                  <UserX size={14} /> Revoke Access
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {rejected.length > 0 && (
        <>
          <h3 className="admin-section-title"><XCircle size={16} color="var(--color-danger)" /> Rejected / Revoked ({rejected.length})</h3>
          <div className="admin-request-list">
            {rejected.map((req) => (
              <div key={req.id} className="admin-request-card card admin-request-rejected">
                <div className="admin-request-info">
                  <p className="admin-request-name">{req.displayName}</p>
                  <p className="admin-request-email">{req.email}</p>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleApprove(req.uid)}
                  disabled={actionLoading === req.uid + '_approve'}
                >
                  <Check size={14} /> Re-approve
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
