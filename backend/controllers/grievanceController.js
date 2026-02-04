
const Grievance = require("../models/Grievance");
const axios = require("axios");

// CREATE NEW GRIEVANCE
exports.createGrievance = async (req, res) => {
  try {
    const { title, description, citizen } = req.body;

    // 1️⃣ Call Python AI server
    const response = await axios.post("http://127.0.0.1:5001/classify", {
      description
    });

    const { department, priority } = response.data;

    // 2️⃣ Create grievance with AI results
    const grievance = new Grievance({
      title,
      description,
      citizen,
      department,
      priority,
      status: "Pending" // default
    });

    await grievance.save();
    res.status(201).json({ msg: "Grievance submitted", grievance });
  } catch (err) {
    console.error("Error saving grievance:", err.message);
    res.status(500).send("Server Error");
  }
};


// GET ALL GRIEVANCES
exports.getGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find().populate("citizen", "name email");
    res.json(grievances);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
