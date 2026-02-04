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
    ref: "User", // links grievance to user
    required: true
  },

  priority: {
    type: String,
    default: "Normal", 
  },
   department: { type: String },
   priority: {
  type: String,
  enum: ["Low", "Medium", "High", "Critical"]
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
