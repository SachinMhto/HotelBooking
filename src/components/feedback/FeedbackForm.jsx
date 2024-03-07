import React, { useState } from "react";
import { getBookingByConfirmationCode } from "../utils/ApiFunctions";
import { useNavigate } from "react-router-dom";

const FeedbackForm = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setConfirmationCode(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await getBookingByConfirmationCode(confirmationCode);
      console.log(data.room.id);
      const { guestEmail, guestName } = data;
      console.log(guestEmail, guestName);
      navigate("/feedbackform", {
        state: {
          roomId: data.room.id,
          guestName: guestName,
          guestEmail: guestEmail,
        },
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <>
      <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-center mb-4">Find My Booking</h2>
        <form onSubmit={handleFormSubmit} className="col-md-6">
          <div className="input-group mb-3">
            <input
              className="form-control"
              type="text"
              id="confirmationCode"
              name="confirmationCode"
              value={confirmationCode}
              onChange={handleInputChange}
              placeholder="Enter the booking confirmation code"
            />

            <button type="submit" className="btn btn-hotel input-group-text">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FeedbackForm;
