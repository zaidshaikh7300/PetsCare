const db = require("../config/db");

// GET LOGGED-IN USER NOTIFICATIONS
exports.getMyNotifications = (req, res) => {
  db.query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
    [req.user.id],
    (err, result) => {
      if (err) {
        console.log("GET NOTIFICATIONS ERROR:", err);
        return res.status(500).send(err);
      }
      res.json(result);
    }
  );
};

// MARK SINGLE NOTIFICATION AS READ
exports.markAsRead = (req, res) => {
  db.query(
    "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.id],
    (err) => {
      if (err) {
        console.log("MARK NOTIFICATION READ ERROR:", err);
        return res.status(500).send(err);
      }
      res.send("Notification marked as read");
    }
  );
};

// MARK ALL AS READ
exports.markAllAsRead = (req, res) => {
  db.query(
    "UPDATE notifications SET is_read = 1 WHERE user_id = ?",
    [req.user.id],
    (err) => {
      if (err) {
        console.log("MARK ALL NOTIFICATIONS READ ERROR:", err);
        return res.status(500).send(err);
      }
      res.send("All notifications marked as read");
    }
  );
};