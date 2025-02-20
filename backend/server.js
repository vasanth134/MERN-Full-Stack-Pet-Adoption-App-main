const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const usersRoutes = require("./routes/usersRoutes");
const petsRoutes = require("./routes/petsRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/pets", petsRoutes);
app.use("/stripe", stripeRoutes);

app.get("/", (req, res) => {
  res.send("The server is online.");
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
