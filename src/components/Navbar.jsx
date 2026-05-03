import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };

  return (
    <div className="bg-black text-white p-4 flex justify-between">

      <h1 className="text-2xl font-bold">
        ERP System
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 px-4 py-2 rounded"
      >
        Logout
      </button>

    </div>
  );
}