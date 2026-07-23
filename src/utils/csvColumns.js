export const CSV_COLUMNS = {
  budget: [
    { key: 'name', label: 'Category' },
    { key: 'planned', label: 'Planned' },
    { key: 'spent', label: 'Spent' },
    { key: 'remaining', label: 'Remaining' },
  ],
  payments: [
    { key: 'date', label: 'Date' },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount' },
  ],
  guests: [
    { key: 'name', label: 'Name' },
    { key: 'side', label: 'Side' },
    { key: 'partySize', label: 'Party Size' },
    { key: 'rsvp', label: 'RSVP' },
    { key: 'table', label: 'Table' },
    { key: 'phone', label: 'Phone' },
  ],
  vendors: [
    { key: 'name', label: 'Vendor' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status' },
    { key: 'totalCost', label: 'Total Cost' },
    { key: 'deposit', label: 'Deposit' },
    { key: 'balance', label: 'Balance' },
    { key: 'contractSigned', label: 'Contract Signed' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
  ],
  tasks: [
    { key: 'title', label: 'Task' },
    { key: 'category', label: 'Category' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' },
    { key: 'dueDate', label: 'Due Date' },
  ],
};

export function buildBudgetRows(categories) {
  return categories.map((c) => ({
    ...c,
    remaining: Number(c.planned) - Number(c.spent),
  }));
}

export function buildPaymentRows(payments, categories) {
  return payments.map((p) => ({
    ...p,
    category: categories.find((c) => c.id === p.categoryId)?.name || '',
  }));
}

export function buildVendorRows(vendors) {
  return vendors.map((v) => ({
    ...v,
    balance: Number(v.totalCost) - Number(v.deposit),
    contractSigned: v.contractSigned ? 'Yes' : 'No',
  }));
}
