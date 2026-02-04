const express = require("express");
const router = express.Router();
const { createGrievance, getGrievances, getByDepartment , updateStatus} = require("../controllers/grievanceController");

// Routes
router.post("/", createGrievance); // submit new grievance
router.get("/", getGrievances);
router.get("/department/:dept", getByDepartment);    // get all grievances
router.put("/:id/status", updateStatus);

module.exports = router;
