// const db = require("../config/db");

// // GET PETS with pagination
// exports.getPets = (req, res) => {
//   const { role, user_id, page = 1, limit = 6 } = req.query;

//   const offset = (page - 1) * limit;

//   let query = "";
//   let countQuery = "";
//   let params = [];

//   if (role === "admin") {
//     query = "SELECT * FROM pets LIMIT ? OFFSET ?";
//     countQuery = "SELECT COUNT(*) as total FROM pets";
//     params = [Number(limit), Number(offset)];
//   } else {
//     query = "SELECT * FROM pets WHERE user_id = ? LIMIT ? OFFSET ?";
//     countQuery = "SELECT COUNT(*) as total FROM pets WHERE user_id = ?";
//     params = [user_id, Number(limit), Number(offset)];
//   }

//   db.query(query, params, (err, result) => {
//     if (err) return res.status(500).send(err);

//     db.query(countQuery, role === "admin" ? [] : [user_id], (err2, countRes) => {
//       if (err2) return res.status(500).send(err2);

//       res.json({
//         data: result,
//         total: countRes[0].total,
//       });
//     });
//   });
// };

// // ADD PET
// exports.addPet = (req, res) => {
//   const { user_id, name, type, age, vaccination_date, notes } = req.body;
//   const image = req.file ? req.file.filename : null;

//   db.query(
//     "INSERT INTO pets (user_id, name, type, age, vaccination_date, notes, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
//     [user_id, name, type, age, vaccination_date || null, notes || null, image],
//     (err) => {
//       if (err) {
//         console.log("ADD PET ERROR:", err);
//         return res.status(500).send(err);
//       }
//       res.send("Pet Added");
//     }
//   );
// };

// // UPDATE PET
// exports.updatePet = (req, res) => {
//   let { name, type, age, vaccination_date, notes } = req.body;
//   const image = req.file ? req.file.filename : null;

//   if (!vaccination_date || vaccination_date === "") {
//     vaccination_date = null;
//   }

//   db.query(
//     "UPDATE pets SET name = ?, type = ?, age = ?, vaccination_date = ?, notes = ?, image = COALESCE(?, image) WHERE id = ?",
//     [name, type, age, vaccination_date, notes, image, req.params.id],
//     (err) => {
//       if (err) {
//         console.log("UPDATE PET ERROR:", err);
//         return res.status(500).send(err);
//       }
//       res.send("Pet Updated");
//     }
//   );
// };

// // DELETE PET
// exports.deletePet = (req, res) => {
//   db.query("DELETE FROM pets WHERE id = ?", [req.params.id], (err) => {
//     if (err) {
//       console.log("DELETE PET ERROR:", err);
//       return res.status(500).send(err);
//     }
//     res.send("Pet Deleted");
//   });
// };

const db = require("../config/db");
const { addActivityLog } = require("../services/activityLogService");

function getReminderStatus(vaccinationDate) {
  if (!vaccinationDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const vacDate = new Date(vaccinationDate);
  vacDate.setHours(0, 0, 0, 0);

  const diff = Math.ceil((vacDate - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { type: "danger", label: "Overdue ❌" };
  if (diff === 0) return { type: "warning", label: "Today ⚠️" };
  if (diff <= 3) return { type: "info", label: "Upcoming 🔔" };
  return null;
}

function addNotification(userId, title, message, type = "info") {
  db.query(
    "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
    [userId, title, message, type],
    (err) => {
      if (err) {
        console.log("ADD NOTIFICATION ERROR:", err);
      }
    }
  );
}

// GET PETS WITH PAGINATION + SEARCH + FILTER + SORT
exports.getPets = (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;

  const {
    page = 1,
    limit = 6,
    q = "",
    type = "",
    status = "",
    sortBy = "created_at",
    sortOrder = "DESC",
  } = req.query;

  const allowedSortFields = ["name", "age", "type", "vaccination_date", "created_at"];
  const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "created_at";
  const finalSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const offset = (Number(page) - 1) * Number(limit);

  let whereClauses = [];
  let params = [];

  if (role !== "admin") {
    whereClauses.push("user_id = ?");
    params.push(userId);
  }

  if (q) {
    whereClauses.push("(name LIKE ? OR notes LIKE ?)");
    params.push(`%${q}%`, `%${q}%`);
  }

  if (type) {
    whereClauses.push("type = ?");
    params.push(type);
  }

  if (status === "overdue") {
    whereClauses.push("vaccination_date < CURDATE()");
  } else if (status === "today") {
    whereClauses.push("vaccination_date = CURDATE()");
  } else if (status === "upcoming") {
    whereClauses.push("vaccination_date > CURDATE() AND vaccination_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)");
  }

  const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const dataQuery = `
    SELECT * FROM pets
    ${whereSQL}
    ORDER BY ${finalSortBy} ${finalSortOrder}
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) AS total FROM pets
    ${whereSQL}
  `;

  db.query(countQuery, params, (err1, countResult) => {
    if (err1) {
      console.log("COUNT PETS ERROR:", err1);
      return res.status(500).send(err1);
    }

    db.query(dataQuery, [...params, Number(limit), Number(offset)], (err2, result) => {
      if (err2) {
        console.log("GET PETS ERROR:", err2);
        return res.status(500).send(err2);
      }

      res.json({
        data: result,
        total: countResult[0].total,
      });
    });
  });
};

// ADD PET
exports.addPet = (req, res) => {
  const { name, type, age, vaccination_date, notes } = req.body;
  const image = req.file ? req.file.filename : null;
  const userId = req.user.id;

  db.query(
    "INSERT INTO pets (user_id, name, type, age, vaccination_date, notes, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [userId, name, type, age, vaccination_date || null, notes || null, image],
    (err, result) => {
      if (err) {
        console.log("ADD PET ERROR:", err);
        return res.status(500).send(err);
      }

      addActivityLog(userId, "ADD_PET", "PETS", `Added pet: ${name}`);

      const reminder = getReminderStatus(vaccination_date);
      if (reminder) {
        addNotification(
          userId,
          "Vaccination Alert",
          `${name} vaccination status: ${reminder.label}`,
          reminder.type
        );
      }

      res.send("Pet Added");
    }
  );
};

// UPDATE PET
exports.updatePet = (req, res) => {
  let { name, type, age, vaccination_date, notes } = req.body;
  const image = req.file ? req.file.filename : null;
  const petId = req.params.id;

  if (!vaccination_date || vaccination_date === "") {
    vaccination_date = null;
  }

  db.query("SELECT * FROM pets WHERE id = ?", [petId], (findErr, pets) => {
    if (findErr) {
      console.log("FIND PET ERROR:", findErr);
      return res.status(500).send(findErr);
    }

    if (pets.length === 0) {
      return res.status(404).send("Pet not found");
    }

    const pet = pets[0];

    if (req.user.role !== "admin" && pet.user_id !== req.user.id) {
      return res.status(403).send("You can update only your own pet");
    }

    db.query(
      "UPDATE pets SET name = ?, type = ?, age = ?, vaccination_date = ?, notes = ?, image = COALESCE(?, image) WHERE id = ?",
      [name, type, age, vaccination_date, notes, image, petId],
      (err) => {
        if (err) {
          console.log("UPDATE PET ERROR:", err);
          return res.status(500).send(err);
        }

        addActivityLog(req.user.id, "UPDATE_PET", "PETS", `Updated pet: ${name}`);

        const reminder = getReminderStatus(vaccination_date);
        if (reminder) {
          addNotification(
            pet.user_id,
            "Vaccination Alert Updated",
            `${name} vaccination status: ${reminder.label}`,
            reminder.type
          );
        }

        res.send("Pet Updated");
      }
    );
  });
};

// DELETE PET
exports.deletePet = (req, res) => {
  const petId = req.params.id;

  db.query("SELECT * FROM pets WHERE id = ?", [petId], (findErr, pets) => {
    if (findErr) {
      console.log("FIND PET ERROR:", findErr);
      return res.status(500).send(findErr);
    }

    if (pets.length === 0) {
      return res.status(404).send("Pet not found");
    }

    const pet = pets[0];

    if (req.user.role !== "admin" && pet.user_id !== req.user.id) {
      return res.status(403).send("You can delete only your own pet");
    }

    db.query("DELETE FROM pets WHERE id = ?", [petId], (err) => {
      if (err) {
        console.log("DELETE PET ERROR:", err);
        return res.status(500).send(err);
      }

      addActivityLog(req.user.id, "DELETE_PET", "PETS", `Deleted pet: ${pet.name}`);
      res.send("Pet Deleted");
    });
  });
};