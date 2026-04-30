// require("dotenv").config();
// // require("./src/cron/reminderCron");

// require("./src/jobs/vaccineReminderJob");
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const authRoutes = require("./src/routes/authRoutes");
// const petRoutes = require("./src/routes/petRoutes");
// const adminRoutes = require("./src/routes/adminRoutes");

// const app = express();

// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());

// app.use("/uploads", express.static("src/uploads"));

// app.use("/api/auth", authRoutes);
// app.use("/api/pets", petRoutes);
// app.use("/api/admin", adminRoutes);

// app.listen(5000, () => {
//   console.log("🚀 Server running on http://localhost:5000");
// });

require("dotenv").config();
require("./src/jobs/vaccineReminderJob");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./src/routes/authRoutes");
const petRoutes = require("./src/routes/petRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static("src/uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});