// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import "./PanditLayout.css";

// const PanditLayout = () => {
//   return (
//     <div className="pandit-shell">
//       <Sidebar />
//       <div className="pandit-content">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default PanditLayout;
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PanditTopbar from "../components/Topbar";
import "./PanditLayout.css";

const PanditLayout = () => {
  return (
    <div className="pandit-shell">
      <Sidebar />

      <div className="pandit-main">
        <PanditTopbar />

        <div className="pandit-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PanditLayout;
