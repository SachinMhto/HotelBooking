import React from "react";
import { useSelector } from "react-redux";

const BookingSuccess = () => {
  const confirmationCode = useSelector((state) => state.confirmationCode);
  console.log(confirmationCode);

  return (
    <div>
      <h1>Booking Successful!</h1>
      <p>Your confirmation code is: {confirmationCode}</p>
      {/* You can add additional content here */}
    </div>
  );
};

export default BookingSuccess;
