const jwt = require("jsonwebtoken");

// Verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// Only admin can access
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Admins only." });
  }
  next();
};

// Only officer can access
exports.officerOnly = (req, res, next) => {
  if (req.user.role !== "officer" && req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Officers only." });
  }
  next();
};