import axios from "axios";
import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const Feedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId, guestName: initialGuestName, guestEmail } = location.state;

  const [guestName, setGuestName] = useState(initialGuestName || "");
  const [feedback, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(!initialGuestName);

  const handleGuestNameChange = (event) => {
    setGuestName(event.target.value);
  };

  const handleAnonymousChange = () => {
    setIsAnonymous(!isAnonymous);
    if (!isAnonymous) {
      setGuestName("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Prepare feedback data
    const feedbackData = {
      roomId,
      guestName: isAnonymous ? "Anonymous" : guestName,
      guestEmail,
      feedback,
    };

    try {
      // Send feedback data to backend
      const response = await fetch(
        "http://localhost:8080/bookings/add-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(feedbackData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }
      // Handle success response
      console.log("Feedback submitted successfully");
      navigate("/thankyou");
    } catch (error) {
      // Handle error
      console.error("Error submitting feedback:", error.message);
      // Show error message to the user
    }
  };
  return (
    <>
      <h1>Give Your Feedback!!</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Your Name:
            {isAnonymous ? (
              <select onChange={handleGuestNameChange} value="">
                <option value="">Anonymous</option>
              </select>
            ) : (
              <input
                type="text"
                value={guestName}
                onChange={handleGuestNameChange}
                readOnly
              />
            )}
          </label>
        </div>
        <div>
          <label>
            Feedback:
            <textarea
              value={feedback}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={handleAnonymousChange}
            />
            Remain Anonymous
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Feedback;
