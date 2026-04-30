import { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load notifications");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      loadNotifications();
    } catch (err) {
      console.log(err);
      toast.error("Failed to mark notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put("/notifications/read-all");
      toast.success("All notifications marked as read");
      loadNotifications();
    } catch (err) {
      console.log(err);
      toast.error("Failed to mark all notifications");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9" }}>
      <Navbar title="🔔 Notifications" theme="blue" />

      <div className="container py-4">
        <div className="card shadow border-0 rounded-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fw-bold text-primary m-0">🔔 Notifications</h3>
              <button className="btn btn-primary btn-sm" onClick={markAllAsRead}>
                Mark All Read
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="alert alert-info">No notifications found</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`border rounded-3 p-3 mb-3 ${n.is_read ? "bg-light" : "bg-white shadow-sm"
                    }`}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="mb-1">{n.title}</h5>
                      <p className="mb-1">{n.message}</p>
                      <small className="text-muted">
                        {new Date(n.created_at).toLocaleString()}
                      </small>
                    </div>

                    {!n.is_read && (
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => markAsRead(n.id)}
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;