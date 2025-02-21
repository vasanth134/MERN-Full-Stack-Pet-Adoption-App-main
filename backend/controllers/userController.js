const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config" });

const User = require("../models/userModel");

// ✅ User Registration
exports.registration = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ 
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username or email is already taken." });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Save user in DB
    await newUser.save();

    res.status(201).json({ message: `User ${username} successfully created.` });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const dbUser = await User.findOne({ email: email.toLowerCase() });
    if (!dbUser) {
      return res.status(400).json({ message: "Email not recognized." });
    }

    // Check if password is correct
    const isCorrect = await bcrypt.compare(password, dbUser.password);
    if (!isCorrect) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { _id: dbUser._id, username: dbUser.username, email: dbUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token valid for 1 day
    );

    // Send token as an HTTP-only cookie
    res
      .status(200)
      .cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" })
      .json({
        message: "User login successful.",
        user: { _id: dbUser._id, username: dbUser.username, email: dbUser.email },
      });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Authenticated User
exports.userAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "You are not logged in, please log in." });
    }

    // Verify JWT Token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).clearCookie("token").json({ message: "User session expired." });
      }

      res.status(200).json({
        user: { _id: decoded._id, username: decoded.username, email: decoded.email },
        message: "Success.",
      });
    });

  } catch (error) {
    console.error("User auth error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ User Logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "You have been logged out." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
