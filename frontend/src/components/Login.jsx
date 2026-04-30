import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("owner");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      if (res.data.role !== role) {
        toast.warning("Wrong role selected ❌");
        return;
      }

      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("token", res.data.token);

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Login Failed ❌");
    }
  };

  const handleResetPassword = async () => {
    try {
      await API.put("/auth/reset-password", {
        email: resetEmail,
        newPassword: resetPassword,
      });

      toast.success("Password reset successful ✅");
      setShowReset(false);
      setResetEmail("");
      setResetPassword("");
    } catch (err) {
      toast.error("Reset failed ❌");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(to right, #74ebd5, #ACB6E5)" }}
    >
      <div
        className="card shadow p-4"
        style={{ width: "370px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-3">🐾 Pet Care Login</h3>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="d-flex mb-3 gap-2">
          <button
            type="button"
            className={`btn w-50 ${
              role === "owner" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setRole("owner")}
          >
            Owner
          </button>

          <button
            type="button"
            className={`btn w-50 ${
              role === "admin" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <button className="btn btn-primary w-100" onClick={login}>
          Login
        </button>

        <p
          className="text-center mt-2 text-primary"
          style={{ cursor: "pointer" }}
          onClick={() => setShowReset(!showReset)}
        >
          Forgot Password?
        </p>

        {showReset && (
          <div className="mt-3">
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Enter new password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
            />
            <button className="btn btn-warning w-100" onClick={handleResetPassword}>
              Reset Password
            </button>
          </div>
        )}

        <p className="text-center mt-3">
          Don't have account? <a href="/register">Register</a>
        </p>

        <p className="text-center mt-3 text-muted" style={{ fontSize: "12px" }}>
          Select role before login
        </p>
      </div>
    </div>
  );
}

export default Login;