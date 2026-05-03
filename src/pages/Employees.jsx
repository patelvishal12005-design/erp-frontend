import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

const DEPT_OPTIONS = ["Engineering", "Sales", "HR", "Finance", "Operations", "Marketing"];

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "", department: "Engineering", salary: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchEmployees = () => {
    setLoading(true);
    API.get("employees/")
      .then((res) => setEmployees(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      console.log("Sending employee data:", form);
      const response = await API.post("employees/", form);
      console.log("Response:", response.data);
      setShowModal(false);
      setForm({ name: "", email: "", role: "", department: "Engineering", salary: "" });
      fetchEmployees();
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response data:", err.response?.data);
      console.error("Error response status:", err.response?.status);
      const errorMsg = err.response?.data?.email?.[0] || err.response?.data?.detail || err.response?.statusText || err.message || "Check all fields.";
      setError(`Failed to add employee: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    await API.delete(`employees/${id}/`);
    fetchEmployees();
  };

  const markAttendance = async (id, status) => {
    try {
      await API.post(`employees/${id}/mark_attendance/`, { status });
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Failed to mark attendance.");
    }
  };

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-sub">{employees.length} team members</p>
        </div>
        <button id="add-employee-btn" className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Employee
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : employees.length === 0 ? (
          <p className="empty-msg">No employees found. Add your first one!</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Email</th><th>Role</th>
                <th>Department</th><th>Salary</th><th>Joined</th><th>Today's Attendance</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={emp.id}>
                  <td>{i + 1}</td>
                  <td><strong>{emp.name}</strong></td>
                  <td>{emp.email}</td>
                  <td>{emp.role}</td>
                  <td><span className="badge">{emp.department}</span></td>
                  <td>₹{Number(emp.salary).toLocaleString("en-IN")}</td>
                  <td>{emp.date_joined}</td>
                  <td>
                    {emp.today_status ? (
                      <span
                        className={`badge ${emp.today_status === 'Present' ? 'badge-green' : emp.today_status === 'Absent' ? 'badge-red' : ''}`}
                        onClick={() => markAttendance(emp.id, emp.today_status === 'Present' ? 'Absent' : emp.today_status === 'Absent' ? 'Leave' : 'Present')}
                        style={{ cursor: 'pointer' }}
                        title="Click to change status"
                      >
                        {emp.today_status}
                      </span>
                    ) : (
                      <>
                        <button className="btn-secondary" style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem", marginRight: "4px" }} onClick={() => markAttendance(emp.id, "Present")}>P</button>
                        <button className="btn-danger-sm" style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem", marginRight: "4px" }} onClick={() => markAttendance(emp.id, "Absent")}>A</button>
                        <button className="btn-secondary" style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }} onClick={() => markAttendance(emp.id, "Leave")}>L</button>
                      </>
                    )}
                  </td>
                  <td>
                    <button className="btn-danger-sm" onClick={() => handleDelete(emp.id)}>
                      Delete
                    </button>
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
            <h2 className="modal-title">Add Employee</h2>
            {error && <p className="modal-error">{error}</p>}
            <form onSubmit={handleAdd} className="modal-form">
              <input className="modal-input" placeholder="Full Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="modal-input" type="email" placeholder="Email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <input className="modal-input" placeholder="Role / Designation" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })} required />
              <select className="modal-input" value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}>
                {DEPT_OPTIONS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <input className="modal-input" type="number" placeholder="Salary (₹)" value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })} required />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}