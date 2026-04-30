const router = require("express").Router();
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getMyNotifications);
router.put("/:id/read", authMiddleware, markAsRead);
router.put("/read-all", authMiddleware, markAllAsRead);

module.exports = router;