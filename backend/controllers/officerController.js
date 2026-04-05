const Officer = require("../models/Officer");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ADD OFFICER (Admin only)
exports.addOfficer = async (req, res) => {
  try {
    const { name, email, phone, department, password } = req.body;

    if (!name || !email || !phone || !department || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if officer already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Create User account for officer
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "officer",
      department,
    });
    await user.save();

    // Generate employee ID
    const count = await Officer.countDocuments({ department });
    const deptCode = department.substring(0, 2).toUpperCase();
    const employeeId = `${deptCode}${String(count + 1).padStart(3, "0")}`;

    // Create Officer record
    const officer = new Officer({
      name,
      email,
      phone,
      department,
      employeeId,
      userId: user._id,
    });
    await officer.save();

    res.status(201).json({
      msg: "Officer added successfully",
      officer: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        phone: officer.phone,
        department: officer.department,
        employeeId: officer.employeeId,
      },
    });
  } catch (err) {
    console.error("Add officer error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// GET ALL OFFICERS (Admin only)
exports.getAllOfficers = async (req, res) => {
  try {
    const officers = await Officer.find().sort({ department: 1 });
    res.json(officers);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// GET OFFICERS BY DEPARTMENT
exports.getOfficersByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const officers = await Officer.find({ department, isActive: true });
    res.json(officers);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// DELETE OFFICER (Admin only)
exports.deleteOfficer = async (req, res) => {
  try {
    const officer = await Officer.findById(req.params.id);
    if (!officer) return res.status(404).json({ msg: "Officer not found" });

    // Deactivate user account
    await User.findByIdAndUpdate(officer.userId, { role: "citizen" });

    // Delete officer record
    await Officer.findByIdAndDelete(req.params.id);

    res.json({ msg: "Officer removed successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// UPDATE OFFICER (Admin only)
exports.updateOfficer = async (req, res) => {
  try {
    const { name, phone, department, isActive } = req.body;

    const officer = await Officer.findByIdAndUpdate(
      req.params.id,
      { name, phone, department, isActive },
      { new: true }
    );

    if (!officer) return res.status(404).json({ msg: "Officer not found" });

    // Update user department too
    await User.findByIdAndUpdate(officer.userId, { department });

    res.json({ msg: "Officer updated successfully", officer });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};