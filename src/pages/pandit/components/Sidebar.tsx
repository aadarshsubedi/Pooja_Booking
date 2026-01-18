import { NavLink } from "react-router-dom";
import "./PanditComponents.css";

const Sidebar = () => {
  return (
    <aside className="pandit-sidebar">
      <NavLink to="/pandit/dashboard">Dashboard</NavLink>
      <NavLink to="/pandit/bookings">Bookings</NavLink>
      <NavLink to="/pandit/schedule">Schedule</NavLink>
      <NavLink to="/pandit/earnings">Earnings</NavLink>
      <NavLink to="/pandit/profile">Profile</NavLink>
    </aside>
  );
};

export default Sidebar;
