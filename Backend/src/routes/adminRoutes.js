// const router = require("express").Router();
// const {
//   getAllUsers,
//   getAllPets,
//   deletePetByAdmin,
// } = require("../controllers/adminController");

// const { sendVaccineReminders } = require("../services/reminderService");

// router.get("/users", getAllUsers);
// router.get("/pets", getAllPets);
// router.delete("/pets/:id", deletePetByAdmin);

// // test reminder route
// router.get("/send-reminders", (req, res) => {
//   sendVaccineReminders();
//   res.send("Reminder job triggered manually");
// });

// module.exports = router;

const router = require("express").Router();
const {
  getAllUsers,
  getAllPets,
  deletePetByAdmin,
  getActivityLogs,
} = require("../controllers/adminController");

const { sendVaccineReminders } = require("../services/reminderService");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/pets", authMiddleware, adminMiddleware, getAllPets);
router.delete("/pets/:id", authMiddleware, adminMiddleware, deletePetByAdmin);
router.get("/activity-logs", authMiddleware, adminMiddleware, getActivityLogs);

// test reminder route
router.get("/send-reminders", authMiddleware, adminMiddleware, (req, res) => {
  sendVaccineReminders();
  res.send("Reminder job triggered manually");
});

module.exports = router;