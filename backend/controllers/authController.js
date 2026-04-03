const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "citizen",
      department: department || null,
    });

    await user.save();

    res.status(201).json({
      msg: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    console.error("REGISTER ERROR FULL:", err);
    res.status(500).json({
      msg: "Server Error",
      error: err.message
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // 2. We MUST put `department` inside the JWT Token so the frontend knows what department this officer is!
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department, // <--- ADDED THIS FIELD
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
