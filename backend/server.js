const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const bcrypt = require("bcrypt");

const usersRoutes = require("./routes/usersRoutes");
const petsRoutes = require("./routes/petsRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true, }));
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/pets", petsRoutes);
app.use("/stripe", stripeRoutes);

app.get("/", (req, res) => {
  res.send("The server is online.");
});

app.post("/users/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Hash password (bcrypt or similar)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in database
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// mongoose.connection.on("error", (err) => {
//   console.error("❌ MongoDB Connection Error:", err);
// });
// mongoose.connection.once("open", () => {
//   console.log("✅ MongoDB Connected Successfully");
// });
