const db = require("../config/db");

function addActivityLog(userId, action, module, details) {
  db.query(
    "INSERT INTO activity_logs (user_id, action, module, details) VALUES (?, ?, ?, ?)",
    [userId || null, action, module, details || null],
    (err) => {
      if (err) {
        console.log("ACTIVITY LOG ERROR:", err);
      }
    }
  );
}

module.exports = { addActivityLog };