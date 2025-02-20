const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

// Import Routers
const petRouter = require("./routes/petsRoutes");
const userRouter = require("./routes/usersRoutes");
const stripeRouter = require("./routes/stripeRoutes");

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// Serve static files from React client
app.use(express.static(path.join(__dirname, "client/build")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.get("/", (req, res) => res.send("The server is online."));
app.use("/api/v1/pets", petRouter);
app.use("/users", userRouter);
app.use("/payment", stripeRouter);

// Handle React front-end routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

module.exports = app;
