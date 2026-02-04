const express = require("express");
const User = require("./models/User");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const grievanceRoutes = require("./routes/grievanceRoutes");

require("dotenv").config();

const app = express();
const MONGOURL = process.env.MONGO_URI;


app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/grievances", grievanceRoutes);




app.get("/", (req, res) => {
  res.send("Smart Grievance System Backend is running");
});

mongoose.connect(MONGOURL, {

}).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); 
  })
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
