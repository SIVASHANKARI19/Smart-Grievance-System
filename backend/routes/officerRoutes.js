const express = require("express");
const router = express.Router();
const { verifyToken, adminOnly } = require("../middleware/auth");
const {
  addOfficer,
  getAllOfficers,
  getOfficersByDepartment,
  deleteOfficer,
  updateOfficer,
} = require("../controllers/officerController");

// All routes require login
router.use(verifyToken);

// Admin only routes
router.post("/add", adminOnly, addOfficer);
router.get("/all", adminOnly, getAllOfficers);
router.delete("/:id", adminOnly, deleteOfficer);
router.put("/:id", adminOnly, updateOfficer);

// Officers/Admin can view
router.get("/department/:department", getOfficersByDepartment);

module.exports = router;