import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const fetchAttendance = () => {
    setLoading(true);
    API.get(`attendance/monthly/?year=${year}&month=${month}`)
      .then((res) => {
        setAttendanceData(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAttendance();
  }, [year, month]);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Monthly Attendance</h1>
          <p className="page-sub">View employee presence across the whole month</p>
        </div>
        <div className="flex gap-4 items-center">
          <button className="btn-secondary" onClick={handlePrevMonth}>&lt; Prev</button>
          <strong className="text-lg">{monthNames[month - 1]} {year}</strong>
          <button className="btn-secondary" onClick={handleNextMonth}>Next &gt;</button>
        </div>
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : !attendanceData || attendanceData.records.length === 0 ? (
          <p className="empty-msg">No employees found.</p>
        ) : (
          <table className="data-table" style={{ minWidth: "1200px" }}>
            <thead>
              <tr>
                <th style={{ position: "sticky", left: 0, background: "#f3f4f6", zIndex: 1, borderRight: "1px solid #e5e7eb" }}>Employee Name</th>
                {Array.from({ length: attendanceData.days_in_month }, (_, i) => i + 1).map(day => (
                  <th key={day} style={{ textAlign: "center", padding: "0.5rem" }}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceData.records.map((record) => (
                <tr key={record.employee_id}>
                  <td style={{ position: "sticky", left: 0, background: "#fff", zIndex: 1, borderRight: "1px solid #e5e7eb" }}>
                    <strong>{record.employee_name}</strong>
                  </td>
                  {Array.from({ length: attendanceData.days_in_month }, (_, i) => i + 1).map(day => {
                    const status = record.attendance[day];
                    let bg = "transparent";
                    let text = "-";
                    let color = "#cbd5e1";
                    
                    if (status === "Present") {
                      bg = "#dcfce7"; text = "P"; color = "#15803d";
                    } else if (status === "Absent") {
                      bg = "#fee2e2"; text = "A"; color = "#dc2626";
                    } else if (status === "Leave") {
                      bg = "#f3f4f6"; text = "L"; color = "#4b5563";
                    }

                    return (
                      <td key={day} style={{ textAlign: "center", padding: "0.25rem" }}>
                        <div style={{
                          width: "24px", height: "24px", margin: "0 auto",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold",
                          backgroundColor: bg, color: color
                        }}>
                          {text}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </MainLayout>
  );
}
