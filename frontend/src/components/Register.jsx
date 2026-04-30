import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "owner",
  });

  const navigate = useNavigate();

  const register = async () => {
    try {
      await API.post("/auth/register", form);
      toast.success("User Registered Successfully ✅");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Registration Failed ❌");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(to right, #74ebd5, #ACB6E5)" }}
    >
      <div
        className="card shadow p-4"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-3">🐾 Pet Care Register</h3>

        <input
          className="form-control mb-3"
          placeholder="Enter Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="form-select mb-3"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>

        <button className="btn btn-success w-100" onClick={register}>
          Register
        </button>

        <p className="text-center mt-3">
          Already have account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;