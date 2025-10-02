import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md top-bar">
      <div className="p-6 text-2xl font-bold text-purple-700 border-b border-gray-200 icon">
        Newsx
      </div>
      <nav className="mt-6 top-button move-left">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `block px-6 py-3 text-gray-700 hover:bg-purple-100 hover:text-purple-700 ${
              isActive ? "bg-purple-200 text-purple-900 font-semibold" : ""
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/content-management"
          className={({ isActive }) =>
            `block px-6 py-3 text-gray-700 hover:bg-purple-100 hover:text-purple-700 ${
              isActive ? "bg-purple-200 text-purple-900 font-semibold" : ""
            }`
          }
        >
          Content Management
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
