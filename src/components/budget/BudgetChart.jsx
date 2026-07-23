import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatMoney } from '../../utils/dateUtils';

const COLORS = ['#0b3d2e', '#c9a24b', '#1f5c45', '#e3c98a', '#3b6a8c', '#b8762e', '#9c3b3b', '#7a7468', '#2f6b4f', '#a89f8d'];

export default function BudgetChart({ categories, currency }) {
  const chartData = categories
    .filter((c) => c.planned > 0 || c.spent > 0)
    .map((c) => ({ name: c.name, value: c.spent || 0.0001 }));

  if (chartData.length === 0) {
    return <p className="empty-hint">Add planned amounts to see your spending breakdown.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={100} paddingAngle={2}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatMoney(value, currency)} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
