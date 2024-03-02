import React from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../common/Header";

const BookingFailure = () => {
  const location = useLocation();
  const error = location.state?.error;
  return (
    <div className="container">
      <Header title="Booking Success" />
      <div className="mt-5">
        <h3 className="text-danger"> Error Booking Room!</h3>
        <p className="text-danger">{error}</p>
      </div>
    </div>
  );
};

export default BookingFailure;
