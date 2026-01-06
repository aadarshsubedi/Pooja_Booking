import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "./PanditLayout.css";

const PanditLayout = () => {
  return (
    <div className="pandit-layout">
      <Sidebar />
      <div className="pandit-content">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
};

export default PanditLayout;
