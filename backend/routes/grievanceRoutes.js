const express = require("express");
const router = express.Router();
const { createGrievance, getGrievances } = require("../controllers/grievanceController");

// Routes
router.post("/", createGrievance); // submit new grievance
router.get("/", getGrievances);    // get all grievances

module.exports = router;
