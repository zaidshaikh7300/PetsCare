import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

function Profile() {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

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

  const updateProfile = async () => {
    try {
      await API.put("/auth/update-profile", {
        // id: userId,
        name,
        email,
      });

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Profile update failed");
    }
  };

  const changePassword = async () => {
    try {
      await API.put("/auth/change-password", {
        // id: userId,
        oldPassword,
        newPassword,
      });

      setOldPassword("");
      setNewPassword("");
      toast.success("Password updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Password update failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2f7, #dfe9f3)",
      }}
    >
      <Navbar title="👤 My Profile" theme="blue" />
      
      <div className="container py-4">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 h-100">
              <div className="card-body text-center p-4">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "90px",
                    height: "90px",
                    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                    color: "white",
                    fontSize: "32px",
                    fontWeight: "bold",
                  }}
                >
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </div>

                <h4 className="fw-bold mb-1">{name || "User"}</h4>
                <p className="text-muted mb-3">{email || "No email"}</p>

                <span className="badge bg-info text-dark px-3 py-2 text-uppercase">
                  {role}
                </span>

                <hr className="my-4" />

                <div className="text-start">
                  <p className="mb-2">
                    <strong>User ID:</strong> {userId}
                  </p>
                  <p className="mb-0">
                    <strong>Status:</strong> Active
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card border-0 shadow-lg rounded-4 mb-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3 text-primary">Update Profile</h4>
                <p className="text-muted mb-4">
                  Change your basic profile information below.
                </p>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      className="form-control form-control-lg"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      className="form-control form-control-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    className="btn btn-primary px-4 py-2"
                    onClick={updateProfile}
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3 text-warning">Change Password</h4>
                <p className="text-muted mb-4">
                  Keep your account secure by updating your password regularly.
                </p>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Old Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Enter old password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    className="btn btn-warning px-4 py-2"
                    onClick={changePassword}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;