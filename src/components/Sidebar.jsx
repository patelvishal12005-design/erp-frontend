import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-5">ERP</h1>

      <div className="flex flex-col gap-3">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/employees">Employees</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/finance">Finance</Link>
        <Link to="/sales">Sales</Link>
      </div>
    </div>
  );
}