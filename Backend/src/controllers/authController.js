const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { addActivityLog } = require("../services/activityLogService");

// REGISTER
exports.register = (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role || "owner"],
    (err, result) => {
      if (err) {
        console.log("REGISTER ERROR:", err);
        return res.status(500).send(err);
      }

      addActivityLog(result.insertId, "REGISTER", "AUTH", `User registered with email ${email}`);
      res.send("User Registered Successfully");
    }
  );
};

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.log("LOGIN ERROR:", err);
      return res.status(500).send(err);
    }

    if (result.length === 0) {
      return res.status(404).send("User not found");
    }

    const user = result[0];

    if (!user.is_active) {
      return res.status(403).send("Account is inactive");
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    addActivityLog(user.id, "LOGIN", "AUTH", `User logged in: ${user.email}`);

    res.json({
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  });
};

// UPDATE PROFILE
exports.updateProfile = (req, res) => {
  const { name, email } = req.body;

  db.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, req.user.id],
    (err) => {
      if (err) {
        console.log("UPDATE PROFILE ERROR:", err);
        return res.status(500).send(err);
      }

      addActivityLog(req.user.id, "UPDATE_PROFILE", "AUTH", `Profile updated to ${email}`);
      res.send("Profile Updated Successfully");
    }
  );
};

// CHANGE PASSWORD
exports.changePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;

  db.query("SELECT * FROM users WHERE id = ?", [req.user.id], (err, result) => {
    if (err) {
      console.log("CHANGE PASSWORD ERROR:", err);
      return res.status(500).send(err);
    }

    if (result.length === 0) {
      return res.status(404).send("User not found");
    }

    const user = result[0];
    const validPassword = bcrypt.compareSync(oldPassword, user.password);

    if (!validPassword) {
      return res.status(401).send("Old password is incorrect");
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, req.user.id],
      (err2) => {
        if (err2) {
          console.log("UPDATE PASSWORD ERROR:", err2);
          return res.status(500).send(err2);
        }

        addActivityLog(req.user.id, "CHANGE_PASSWORD", "AUTH", "Password changed");
        res.send("Password Updated Successfully");
      }
    );
  });
};

// RESET PASSWORD
exports.resetPassword = (req, res) => {
  const { email, newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 8);

  db.query(
    "UPDATE users SET password = ? WHERE email = ?",
    [hashedPassword, email],
    (err, result) => {
      if (err) {
        console.log("RESET PASSWORD ERROR:", err);
        return res.status(500).send(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("User not found");
      }

      addActivityLog(null, "RESET_PASSWORD", "AUTH", `Password reset for ${email}`);
      res.send("Password Reset Successful");
    }
  );
};