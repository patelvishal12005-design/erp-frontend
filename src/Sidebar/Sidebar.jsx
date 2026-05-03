import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Sidebar() {

  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);

  }, []);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/employees", label: "Employees", icon: "👥" },
    { to: "/attendance", label: "Attendance", icon: "📅" },
    { to: "/inventory", label: "Inventory", icon: "📦" },
    { to: "/finance", label: "Finance", icon: "💰" },
    { to: "/sales", label: "Sales", icon: "🛒" },
  ];

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      {isMobile && !open && (

        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            top: "40px",
            // left: "14px",
            width: "30px",
            height: "30px",

            border: "none",
            borderRadius: "12px",

            background:
              "linear-gradient(black)",

            color: "#fff",

            fontSize: "15px",
            fontWeight: "bold",

            cursor: "pointer",

            zIndex: "2000",

            boxShadow:
              "0 4px 12px rgba(0, 0, 0, 0.4)",
          }}
        >
          ☰
        </button>

      )}

      {/* OVERLAY */}
      {isMobile && open && (

        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: "1500",
          }}
        ></div>

      )}

      {/* SIDEBAR */}
      <div
        style={{
          width: isMobile ? "240px" : "260px",

          height: "100vh",

          background: "#111827",

          color: "#fff",

          padding: "20px",

          position: isMobile ? "fixed" : "relative",

          top: 0,

          left: isMobile
            ? (open ? "0" : "-240px")
            : "0",

          zIndex: "1600",

          transition: "0.3s ease",

          overflowY: "auto",

          display: "flex",
          flexDirection: "column",

          boxShadow: isMobile
            ? "0 0 20px rgba(0,0,0,0.35)"
            : "none",
        }}
      >

        {/* TOP */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <h3
            style={{
              margin: 0,
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: "700",
            }}
          >
            ⚡ ERP Pro
          </h3>

          {/* CLOSE BUTTON */}
          {isMobile && (

            <button
              onClick={() => setOpen(false)}
              style={{
                width: "34px",
                height: "34px",
                // top: "20px",
                border: "none",
                borderRadius: "10px",

                background: "#000000",

                cursor: "pointer",

                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              ✕
            </button>

          )}

        </div>

        {/* LINKS */}
        <div
          style={{
            marginTop: "30px",

            display: "flex",
            flexDirection: "column",

            gap: "10px",
          }}
        >

          {navItems.map((item) => (

            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              style={{
                textDecoration: "none",

                color: "#fff",

                padding: "14px",

                borderRadius: "12px",

                fontSize: isMobile
                  ? "15px"
                  : "16px",

                fontWeight: "500",

                background:
                  pathname === item.to
                    ? "linear-gradient(135deg,#7c3aed,#9333ea)"
                    : "rgba(255,255,255,0.08)",

                transition: "0.3s",
              }}
            >
              {item.icon} {item.label}
            </Link>

          ))}

        </div>

      </div>
    </>
  );
}