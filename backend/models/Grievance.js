const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  department: {
    type: String
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "Low"
  },

  priorityScore: {
    type: Number
  },

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Grievance", grievanceSchema);