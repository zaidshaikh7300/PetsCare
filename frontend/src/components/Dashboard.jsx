import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pets from "./Pets";
import Navbar from "./Navbar";

function Dashboard() {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/");
    }
  }, [navigate]);

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

  return (
    <div style={{ background: "#425269", minHeight: "100vh" }}>

      <Navbar title="🐾 PetCare Dashboard" theme="blue" />

      <div className="container py-4">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4">
            <h3 className="mb-4 fw-bold text-primary">🐶 Your Pets</h3>
            <Pets />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;