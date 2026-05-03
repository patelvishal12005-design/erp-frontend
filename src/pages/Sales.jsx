import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ product_id: "", product_name: "", customer: "", quantity: "", unit_price: "" });
  const [saving, setSaving] = useState(false);
  const [useCustomProduct, setUseCustomProduct] = useState(false);

  const fetchSales = () => {
    setLoading(true);
    API.get("sales/")
      .then((res) => setSales(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchInventory = () => {
    API.get("inventory/")
      .then((res) => setInventory(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchSales();
    fetchInventory();
  }, []);

  const totalRevenue = sales.reduce((s, r) => s + r.quantity * r.unit_price, 0);

  const handleProductChange = (e) => {
    const productId = e.target.value;
    if (productId && productId !== "custom") {
      const product = inventory.find(item => String(item.id) === String(productId));
      if (product) {
        setForm({
          ...form,
          product_id: productId,
          product_name: product.name,
          unit_price: product.unit_price
        });
        setUseCustomProduct(false);
      }
    } else if (productId === "custom") {
      setUseCustomProduct(true);
      setForm({ ...form, product_id: "", product_name: "", unit_price: "" });
    } else {
      setUseCustomProduct(false);
      setForm({ ...form, product_id: "", product_name: "", unit_price: "" });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form };
      if (!useCustomProduct) {
        if (!data.product_id) {
          alert("Please select a product from the inventory.");
          setSaving(false);
          return;
        }
        delete data.product_name;
        delete data.unit_price;
      } else {
        delete data.product_id;
      }
      await API.post("sales/", data);
      setShowModal(false);
      setForm({ product_id: "", product_name: "", customer: "", quantity: "", unit_price: "" });
      setUseCustomProduct(false);
      fetchSales();
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to add sale.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sale?")) return;
    await API.delete(`sales/${id}/`);
    fetchSales();
  };

  const fmt = (n) => Number(n).toLocaleString("en-IN");

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales</h1>
          <p className="page-sub">{sales.length} transactions · Revenue: ₹{fmt(totalRevenue)}</p>
        </div>
        <button id="add-sale-btn" className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Sale
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : sales.length === 0 ? (
          <p className="empty-msg">No sales recorded yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th><th>Product</th><th>Customer</th><th>Qty</th>
                <th>Unit Price</th><th>Total</th><th>Date</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s, i) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td><strong>{s.product_name}</strong></td>
                  <td>{s.customer}</td>
                  <td>{s.quantity}</td>
                  <td>₹{fmt(s.unit_price)}</td>
                  <td className="text-success"><strong>₹{fmt(s.total)}</strong></td>
                  <td>{s.date}</td>
                  <td><button className="btn-danger-sm" onClick={() => handleDelete(s.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add Sale</h2>
            <form onSubmit={handleAdd} className="modal-form">
              <select className="modal-input" value={form.product_id} onChange={handleProductChange}>
                <option value="">-- Select Product from Inventory --</option>
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} (Stock: {item.quantity} - ₹{fmt(item.unit_price)})
                  </option>
                ))}
                <option value="custom">-- Custom Product --</option>
              </select>
              
              {useCustomProduct && (
                <>
                  <input className="modal-input" placeholder="Product Name" value={form.product_name}
                    onChange={(e) => setForm({ ...form, product_name: e.target.value })} required />
                  <input className="modal-input" type="number" placeholder="Unit Price (₹)" value={form.unit_price}
                    onChange={(e) => setForm({ ...form, unit_price: e.target.value })} required />
                </>
              )}
              
              <input className="modal-input" placeholder="Customer Name" value={form.customer}
                onChange={(e) => setForm({ ...form, customer: e.target.value })} required />
              <input className="modal-input" type="number" placeholder="Quantity" value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Add Sale"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}