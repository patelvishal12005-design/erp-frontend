import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

const CATEGORIES = ["Electronics", "Furniture", "Stationery", "Raw Material", "Finished Good", "Other"];

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Other", quantity: "", unit_price: "", supplier: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = () => {
    setLoading(true);
    API.get("inventory/")
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await API.post("inventory/", form);
      setShowModal(false);
      setForm({ name: "", category: "Other", quantity: "", unit_price: "", supplier: "" });
      fetchItems();
    } catch {
      setError("Failed to add item. Check all fields.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await API.delete(`inventory/${id}/`);
    fetchItems();
  };

  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-sub">{items.length} items · Total value: ₹{Number(totalValue).toLocaleString("en-IN")}</p>
        </div>
        <button id="add-inventory-btn" className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Item
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : items.length === 0 ? (
          <p className="empty-msg">No inventory items yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Category</th><th>Quantity</th>
                <th>Unit Price</th><th>Total Value</th><th>Supplier</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className={item.quantity < 5 ? "low-stock-row" : ""}>
                  <td>{i + 1}</td>
                  <td>
                    <strong>{item.name}</strong>
                    {item.quantity < 5 && <span className="low-stock-badge">Low Stock!</span>}
                  </td>
                  <td><span className="badge">{item.category}</span></td>
                  <td className={item.quantity < 5 ? "text-danger" : ""}>
                    {item.quantity < 5 && "⚠️ "}
                    {item.quantity}
                  </td>
                  <td>₹{Number(item.unit_price).toLocaleString("en-IN")}</td>
                  <td>₹{(item.quantity * item.unit_price).toLocaleString("en-IN")}</td>
                  <td>{item.supplier || "—"}</td>
                  <td>
                    <button className="btn-danger-sm" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add Inventory Item</h2>
            {error && <p className="modal-error">{error}</p>}
            <form onSubmit={handleAdd} className="modal-form">
              <input className="modal-input" placeholder="Item Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <select className="modal-input" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input className="modal-input" type="number" placeholder="Quantity" value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              <input className="modal-input" type="number" placeholder="Unit Price (₹)" value={form.unit_price}
                onChange={(e) => setForm({ ...form, unit_price: e.target.value })} required />
              <input className="modal-input" placeholder="Supplier (optional)" value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}