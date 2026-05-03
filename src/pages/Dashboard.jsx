import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

const KPICard = ({ label, value, icon, color }) => (
  <div className={`kpi-card kpi-${color}`}>
    <div className="kpi-icon">{icon}</div>
    <div>
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("stats/")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n) =>
    Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <MainLayout>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Welcome back — here's your business overview</p>
      </div>

      {loading ? (
        <div className="loader-wrap"><div className="loader" /></div>
      ) : (
        <>
          <div className="kpi-grid">
            <KPICard label="Total Employees" value={stats?.employees ?? 0} icon="👥" color="blue" />
            <KPICard label="Inventory Items" value={stats?.products ?? 0} icon="📦" color="purple" />
            <KPICard label="Total Sales" value={stats?.total_sales ?? 0} icon="🛒" color="green" />
            <KPICard label="Net Profit" value={`₹${fmt(stats?.net_profit ?? 0)}`} icon="💰" color="orange" />
          </div>

          <div className="section-grid">
            <div className="card">
              <h2 className="card-title">Recent Sales</h2>
              {stats?.recent_sales?.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Customer</th>
                      <th>Qty</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_sales.map((s) => (
                      <tr key={s.id}>
                        <td>{s.product_name}</td>
                        <td>{s.customer}</td>
                        <td>{s.quantity}</td>
                        <td>₹{fmt(s.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="empty-msg">No sales records yet.</p>
              )}
            </div>

            <div className="card">
              <h2 className="card-title">Finance Summary</h2>
              <div className="finance-summary">
                <div className="finance-row income">
                  <span>💹 Total Income</span>
                  <strong>₹{fmt(stats?.total_income ?? 0)}</strong>
                </div>
                <div className="finance-row expense">
                  <span>📉 Total Expense</span>
                  <strong>₹{fmt(stats?.total_expense ?? 0)}</strong>
                </div>
                <div className="finance-row profit">
                  <span>🏆 Net Profit</span>
                  <strong>₹{fmt(stats?.net_profit ?? 0)}</strong>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}