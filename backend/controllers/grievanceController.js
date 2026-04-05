const Grievance = require("../models/Grievance");
const Officer = require("../models/Officer");
const axios = require("axios");

// CREATE NEW GRIEVANCE
exports.createGrievance = async (req, res) => {
  try {
    console.log("Incoming grievance:", req.body);

    const {
      title,
      description,
      citizen,
      department,
      priorityScore,
      priorityLevel,
      category,
      address,
      contactNumber,
      location,
      image,
    } = req.body;

    if (!title || !description || !citizen) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const grievance = new Grievance({
      title,
      description,
      citizen,
      department: department || "Unassigned",
      priorityScore: priorityScore || 0,
      priority: priorityLevel || "Low",
      category: category || null,
      address: address || null,
      contactNumber: contactNumber || null,
      location: location || null,
      image: image || null,
    });

    await grievance.save();

    // ✅ Officer assignment - INSIDE the function
    let assignedOfficer = null;
    try {
      const officers = await Officer.find({
        department: grievance.department,
        isActive: true,
      });

      if (officers.length > 0) {
        if (priorityLevel === "Critical") {
          assignedOfficer = officers[0]; // Senior officer for critical
        } else {
          assignedOfficer = officers[Math.floor(Math.random() * officers.length)];
        }
      }
    } catch (officerErr) {
      console.log("Officer assignment skipped:", officerErr.message);
    }

    res.status(201).json({
      message: "Grievance created successfully",
      grievance,
      assignedOfficer: assignedOfficer
        ? {
            name: assignedOfficer.name,
            email: assignedOfficer.email,
            phone: assignedOfficer.phone,
            employeeId: assignedOfficer.employeeId,
          }
        : null,
    });

  } catch (error) {
    console.error("Create grievance error:", error);
    res.status(500).json({ message: "Error creating grievance", error: error.message });
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

// GET BY DEPARTMENT
exports.getByDepartment = async (req, res) => {
  try {
    const department = req.params.dept;
    const grievances = await Grievance.find({ department }).sort({ priorityScore: -1 });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching grievances" });
  }
};

// UPDATE STATUS
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