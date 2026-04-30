// const router = require("express").Router();
// const {
//   register,
//   login,
//   updateProfile,
//   changePassword,
//   resetPassword,
// } = require("../controllers/authController");

// router.post("/register", register);
// router.post("/login", login);
// router.put("/update-profile", updateProfile);
// router.put("/change-password", changePassword);
// router.put("/reset-password", resetPassword);

// module.exports = router;

const router = require("express").Router();
const {
  register,
  login,
  updateProfile,
  changePassword,
  resetPassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.put("/update-profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.put("/reset-password", resetPassword);

module.exports = router;