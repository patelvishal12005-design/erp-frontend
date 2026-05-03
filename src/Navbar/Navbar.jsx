import { useNavigate, useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/employees": "Employees",
  "/inventory": "Inventory",
  "/finance": "Finance",
  "/sales": "Sales",
};

export default function Navbar({
  setOpen,
  isMobile,
}) {

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const title = PAGE_TITLES[pathname] || "ERP";

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (

    <header className="navbar">

      {/* LEFT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >

        {/* MOBILE MENU BUTTON */}
        {isMobile && (

          <button
            onClick={() => setOpen(true)}
            style={{
              width: "42px",
              height: "42px",

              border: "none",

              borderRadius: "12px",

              background:
                "linear-gradient(135deg,#7c3aed,#9333ea)",

              color: "#fff",

              fontSize: "20px",

              fontWeight: "bold",

              cursor: "pointer",

              boxShadow:
                "0 4px 12px rgba(124,58,237,0.35)",
            }}
          >
            ☰
          </button>

        )}

        {/* TITLE */}
        <h2 className="navbar-title">
          {title}
        </h2>

      </div>

      {/* RIGHT */}
      <div className="navbar-right">

        <span className="navbar-user">
          👤 Admin
        </span>

        <button
          id="logout-btn"
          onClick={logout}
          className="btn-logout"
        >
          Logout
        </button>

      </div>

    </header>
  );
}