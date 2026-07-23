export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffMs = target - now;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  });
}

export function formatMoney(amount, currency = 'USD') {
  const n = Number(amount) || 0;
  const symbol = currency === 'USD' ? '$' : currency + ' ';
  return symbol + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function isOverdue(dateStr, status) {
  if (!dateStr || status === 'done') return false;
  return daysUntil(dateStr) < 0;
}

export function isDueSoon(dateStr, status, withinDays = 7) {
  if (!dateStr || status === 'done') return false;
  const d = daysUntil(dateStr);
  return d >= 0 && d <= withinDays;
}
