// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const token = req.header("token");

//   if (!token) {
//     return res.status(401).send("Access denied");
//   }

//   try {
//     const verified = jwt.verify(token, "secretkey");
//     req.user = verified;
//     next();
//   } catch (err) {
//     return res.status(400).send("Invalid token");
//   }
// };

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("token");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};