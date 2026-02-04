
const Grievance = require("../models/Grievance");
const axios = require("axios");

// CREATE NEW GRIEVANCE
exports.createGrievance = async (req, res) => {
  try {
    console.log("Incoming grievance:", req.body);

    const { title, description, citizen } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const grievance = new Grievance({
      title,
      description,
      citizen
    });

    await grievance.save();

    res.status(201).json({
      message: "Grievance created successfully",
      grievance
    });

  } catch (error) {
    console.error("Create grievance error:", error);
    res.status(500).json({
      message: "Error creating grievance",
      error: error.message
    });
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

exports.getByDepartment = async (req, res) => {
  try {
    const department = req.params.dept;

    const grievances = await Grievance.find({
      department
    }).sort({ priorityScore: -1 });

    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching grievances" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(grievance);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
};


