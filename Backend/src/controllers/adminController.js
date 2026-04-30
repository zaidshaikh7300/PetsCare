// const db = require("../config/db");

// // GET ALL USERS
// exports.getAllUsers = (req, res) => {
//   db.query("SELECT id, name, email, role FROM users", (err, result) => {
//     if (err) {
//       console.log("GET USERS ERROR:", err);
//       return res.status(500).send(err);
//     }
//     res.json(result);
//   });
// };

// // GET ALL PETS
// exports.getAllPets = (req, res) => {
//   db.query("SELECT * FROM pets", (err, result) => {
//     if (err) {
//       console.log("GET ALL PETS ERROR:", err);
//       return res.status(500).send(err);
//     }
//     res.json(result);
//   });
// };

// // DELETE PET BY ADMIN
// exports.deletePetByAdmin = (req, res) => {
//   db.query("DELETE FROM pets WHERE id = ?", [req.params.id], (err) => {
//     if (err) {
//       console.log("ADMIN DELETE PET ERROR:", err);
//       return res.status(500).send(err);
//     }
//     res.send("Pet Deleted By Admin");
//   });
// };

const db = require("../config/db");
const { addActivityLog } = require("../services/activityLogService");

// GET ALL USERS
exports.getAllUsers = (req, res) => {
  db.query("SELECT id, name, email, role, is_active FROM users", (err, result) => {
    if (err) {
      console.log("GET USERS ERROR:", err);
      return res.status(500).send(err);
    }
    res.json(result);
  });
};

// GET ALL PETS
exports.getAllPets = (req, res) => {
  db.query("SELECT * FROM pets ORDER BY created_at DESC", (err, result) => {
    if (err) {
      console.log("GET ALL PETS ERROR:", err);
      return res.status(500).send(err);
    }
    res.json(result);
  });
};

// DELETE PET BY ADMIN
exports.deletePetByAdmin = (req, res) => {
  db.query("SELECT * FROM pets WHERE id = ?", [req.params.id], (findErr, pets) => {
    if (findErr) {
      console.log("FIND PET ERROR:", findErr);
      return res.status(500).send(findErr);
    }

    if (pets.length === 0) {
      return res.status(404).send("Pet not found");
    }

    const pet = pets[0];

    db.query("DELETE FROM pets WHERE id = ?", [req.params.id], (err) => {
      if (err) {
        console.log("ADMIN DELETE PET ERROR:", err);
        return res.status(500).send(err);
      }

      addActivityLog(req.user.id, "ADMIN_DELETE_PET", "ADMIN", `Admin deleted pet: ${pet.name}`);
      res.send("Pet Deleted By Admin");
    });
  });
};

// GET ACTIVITY LOGS
exports.getActivityLogs = (req, res) => {
  const sql = `
    SELECT activity_logs.*, users.name AS user_name
    FROM activity_logs
    LEFT JOIN users ON activity_logs.user_id = users.id
    ORDER BY activity_logs.created_at DESC
    LIMIT 100
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("GET ACTIVITY LOGS ERROR:", err);
      return res.status(500).send(err);
    }
    res.json(result);
  });
};