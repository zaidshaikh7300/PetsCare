import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role");

    if (!userId) {
      navigate("/");
      return;
    }

    if (userRole !== "admin") {
      toast.error("Access Denied ❌");
      navigate("/dashboard");
      return;
    }

    loadData();
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

  const loadData = async () => {
    try {
      const u = await API.get("/admin/users");
      const p = await API.get("/admin/pets");
      setUsers(u.data);
      setPets(p.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load admin data");
    }
  };

  const deletePet = async (id) => {
    try {
      await API.delete(`/admin/pets/${id}`);
      toast.success("Pet deleted successfully");
      loadData();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  const petTypeCount = pets.reduce((acc, pet) => {
    const type = pet.type ? pet.type : "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const petTypeLabels = Object.keys(petTypeCount);
  const petTypeValues = Object.values(petTypeCount);

  const petTypeChartData = {
    labels: petTypeLabels,
    datasets: [
      {
        label: "Number of Pets",
        data: petTypeValues,
        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#ffc107",
          "#dc3545",
          "#6f42c1",
          "#20c997",
          "#fd7e14",
          "#6610f2",
        ],
        borderRadius: 8,
      },
    ],
  };

  const petTypeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Pets by Type",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const barData = {
    labels: ["Users", "Pets"],
    datasets: [
      {
        label: "Count",
        data: [users.length, pets.length],
        backgroundColor: ["#0d6efd", "#198754"],
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: Object.keys(petTypeCount),
    datasets: [
      {
        label: "Pets by Type",
        data: Object.values(petTypeCount),
        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#ffc107",
          "#dc3545",
          "#6f42c1",
          "#20c997",
          "#fd7e14",
          "#6610f2",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Users vs Pets" },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Pets by Type" },
    },
  };

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh" }}>
      <Navbar title="⚙️ Admin Dashboard" theme="dark" />

      <div className="container py-4">
        <div className="row text-center mb-4">
          <div className="col-md-6 mb-3">
            <div className="card shadow p-4 bg-primary text-white border-0 rounded-4">
              <h5>Total Users</h5>
              <h2>{users.length}</h2>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="card shadow p-4 bg-success text-white border-0 rounded-4">
              <h5>Total Pets</h5>
              <h2>{pets.length}</h2>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-lg-6 mb-4">
            <div className="card shadow rounded-4 border-0 h-100">
              <div
                className="card-body d-flex align-items-center justify-content-center"
                style={{ height: "350px", padding: "10px" }}   // 👈 FIX HEIGHT
              >
                <Bar data={barData} options={{ ...barOptions, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card shadow rounded-4 border-0 h-100">
              <div
                className="card-body d-flex align-items-center justify-content-center"
                style={{ height: "350px", padding: "10px" }}   // 👈 SAME HEIGHT
              >
                {pets.length > 0 ? (
                  <Pie data={pieData} options={{ ...pieOptions, maintainAspectRatio: false }} />
                ) : (
                  <p className="text-center text-muted m-0">
                    No pet data available for chart
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow rounded-4 border-0">
                <div className="card-body">
                  <div style={{ height: "350px" }}>
                    {pets.length > 0 ? (
                      <Bar
                        data={petTypeChartData}
                        options={petTypeChartOptions}
                      />
                    ) : (
                      <p className="text-center text-muted m-0">
                        No pet data available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow rounded-4 border-0 mb-4">
          <div className="card-header bg-dark text-white rounded-top-4">
            Users
          </div>

          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge bg-info text-dark">{u.role}</span>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card shadow rounded-4 border-0">
          <div className="card-header bg-dark text-white rounded-top-4">
            Pets
          </div>

          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Age</th>
                  <th>Owner ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.type}</td>
                    <td>{p.age}</td>
                    <td>{p.user_id}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deletePet(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {pets.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No pets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;