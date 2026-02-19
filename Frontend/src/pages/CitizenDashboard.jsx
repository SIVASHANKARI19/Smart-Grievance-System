import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createGrievance } from "../api/grievances";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

const CitizenDashboard = () => {
  const { user, isLoading } = useAuth(); // citizen
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
if (isLoading) {
  return <p className="text-center mt-10">Loading...</p>;
}

if (!user) {
  return <p className="text-center mt-10">User not authenticated</p>;
}
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    await createGrievance({
      title,
      description,
      citizen: user._id,
    });

    alert("Grievance created");
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <h2 className="text-2xl font-bold text-[#1F3A5F] mb-4">
          Raise a Grievance
        </h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Grievance Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded-md p-2"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Submitting..." : "Submit Grievance"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CitizenDashboard;
