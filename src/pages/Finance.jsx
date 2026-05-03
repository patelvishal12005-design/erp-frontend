import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

export default function Finance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", amount: "", type: "income", notes: "" });
  const [saving, setSaving] = useState(false);

  const fetchRecords = () => {
    setLoading(true);
    API.get("finance/")
      .then((res) => setRecords(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRecords(); }, []);

  const totalIncome = records.filter((r) => r.type === "income").reduce((s, r) => s + Number(r.amount), 0);
  const totalExpense = records.filter((r) => r.type === "expense").reduce((s, r) => s + Number(r.amount), 0);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post("finance/", form);
      setShowModal(false);
      setForm({ title: "", amount: "", type: "income", notes: "" });
      fetchRecords();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await API.delete(`finance/${id}/`);
    fetchRecords();
  };

  const fmt = (n) => Number(n).toLocaleString("en-IN");

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Finance</h1>
          <p className="page-sub">Track income and expenses</p>
        </div>
        <button id="add-finance-btn" className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Record
        </button>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: "1.5rem" }}>
        <div className="kpi-card kpi-green">
          <div className="kpi-icon">💹</div>
          <div><p className="kpi-label">Total Income</p><p className="kpi-value">₹{fmt(totalIncome)}</p></div>
        </div>
        <div className="kpi-card kpi-red">
          <div className="kpi-icon">📉</div>
          <div><p className="kpi-label">Total Expense</p><p className="kpi-value">₹{fmt(totalExpense)}</p></div>
        </div>
        <div className="kpi-card kpi-blue">
          <div className="kpi-icon">🏆</div>
          <div><p className="kpi-label">Net Balance</p><p className="kpi-value">₹{fmt(totalIncome - totalExpense)}</p></div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : records.length === 0 ? (
          <p className="empty-msg">No finance records yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Title</th><th>Type</th><th>Amount</th><th>Date</th><th>Notes</th><th>Action</th></tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td><strong>{r.title}</strong></td>
                  <td>
                    <span className={`badge ${r.type === "income" ? "badge-green" : "badge-red"}`}>
                      {r.type === "income" ? "Income" : "Expense"}
                    </span>
                  </td>
                  <td className={r.type === "income" ? "text-success" : "text-danger"}>
                    {r.type === "income" ? "+" : "-"}₹{fmt(r.amount)}
                  </td>
                  <td>{r.date}</td>
                  <td>{r.notes || "—"}</td>
                  <td><button className="btn-danger-sm" onClick={() => handleDelete(r.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add Finance Record</h2>
            <form onSubmit={handleAdd} className="modal-form">
              <input className="modal-input" placeholder="Title" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <input className="modal-input" type="number" placeholder="Amount (₹)" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              <select className="modal-input" value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <textarea className="modal-input" placeholder="Notes (optional)" rows={3} value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Add Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}