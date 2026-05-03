import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
}