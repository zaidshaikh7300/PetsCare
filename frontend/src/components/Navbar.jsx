import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ title = "PetCare", theme = "blue" }) {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = role === "admin";

  const themeStyle =
    theme === "dark"
      ? "linear-gradient(90deg, #141e30, #243b55)"
      : "linear-gradient(90deg, #1e3c72, #2a5298)";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    setOpenMenu(false);
    navigate("/");
  };

  return (
    <nav
      className="navbar px-3 py-3"
      style={{
        background: themeStyle,
        color: "white",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <h4 className="m-0 fw-bold">{title}</h4>

        <div className="position-relative" ref={dropdownRef}>
          <button
            type="button"
            className="btn btn-light d-flex align-items-center gap-2 px-3 py-2 shadow-sm border-0 rounded-pill"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "34px",
                height: "34px",
                background: themeStyle,
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>

            <span className="fw-semibold d-none d-sm-inline">
              {name || "User"}
            </span>

            <span className="badge bg-warning text-dark text-uppercase d-none d-md-inline">
              {role || "user"}
            </span>

            <span>{openMenu ? "▲" : "▼"}</span>
          </button>

          {openMenu && (
            <div
              className="bg-white shadow border rounded-4 mt-2 p-2 position-absolute end-0"
              style={{ minWidth: "240px", zIndex: 9999 }}
            >
              <button
                type="button"
                className="w-100 text-start border-0 bg-white px-3 py-2 rounded-3"
                style={{ color: "#212529", fontSize: "16px" }}
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/profile");
                }}
              >
                👤 My Profile
              </button>

              <button
                type="button"
                className="w-100 text-start border-0 bg-white px-3 py-2 rounded-3"
                style={{ color: "#212529", fontSize: "16px" }}
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/dashboard");
                }}
              >
                🏠 Dashboard
              </button>

              {isAdmin && (
                <button
                  type="button"
                  className="w-100 text-start border-0 bg-white px-3 py-2 rounded-3"
                  style={{ color: "#212529", fontSize: "16px" }}
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/admin");
                  }}
                >
                  ⚙️ Admin Dashboard
                </button>
              )}

              <button
                type="button"
                className="w-100 text-start border-0 bg-white px-3 py-2 rounded-3"
                style={{ color: "#212529", fontSize: "16px" }}
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/notifications");
                }}
              >
                🔔 Notifications
              </button>

              {isAdmin && (
                <button
                  type="button"
                  className="w-100 text-start border-0 bg-white px-3 py-2 rounded-3"
                  style={{ color: "#212529", fontSize: "16px" }}
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/activity-logs");
                  }}
                >
                  📜 Activity Logs
                </button>
              )}

              <hr className="my-1" />

              <button
                type="button"
                className="w-100 text-start border-0 bg-white px-3 py-0 rounded-3"
                style={{ color: "#dc3545", fontSize: "16px" }}
                onClick={logout}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;