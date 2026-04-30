// const router = require("express").Router();
// const {
//   getPets,
//   addPet,
//   updatePet,
//   deletePet
// } = require("../controllers/petController");

// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../uploads"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

// router.get("/", getPets);
// router.post("/", upload.single("image"), addPet);
// router.put("/:id", upload.single("image"), updatePet);
// router.delete("/:id", deletePet);

// module.exports = router;

const router = require("express").Router();
const {
  getPets,
  addPet,
  updatePet,
  deletePet
} = require("../controllers/petController");

const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get("/", authMiddleware, getPets);
router.post("/", authMiddleware, upload.single("image"), addPet);
router.put("/:id", authMiddleware, upload.single("image"), updatePet);
router.delete("/:id", authMiddleware, deletePet);

module.exports = router;