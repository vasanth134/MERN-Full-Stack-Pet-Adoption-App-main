const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../config/config" }); // ✅ Fix the typo & remove duplicate call

module.exports = (req, res, next) => {
  // Read the token from the cookie
  const token = req.cookies?.token; // ✅ Use optional chaining to avoid errors

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message); // ✅ Log the exact error

    // If the token is expired or invalid, clear the cookie
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    return res.status(400).json({ message: "Invalid or expired token" });
  }
};
