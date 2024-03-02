import React, { useState, useEffect } from "react";
import moment from "moment";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const BookingSummary = ({
  booking,
  payment,
  isFormValid,
  onConfirm,
  display,
}) => {
  const checkInDate = moment(booking.checkInDate);
  const checkOutDate = moment(booking.checkOutDate);
  const numberOfDays = checkOutDate.diff(checkInDate, "days");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [total_amount, setTotalAmount] = useState(0);
  const [transaction_uuid, setTransactionUuid] = useState("");
  const [signature, setSignature] = useState("");

  const handleConfirmBooking = async () => {
    setIsProcessingPayment(true);
    try {
      const response = await fetch("http://localhost:8080/pay/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ total_amount: payment }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { signature, total_amount, transaction_uuid } = responseData;
        setTotalAmount(total_amount);
        setTransactionUuid(transaction_uuid);
        setSignature(signature);

        setIsBookingConfirmed(true);
        setPaymentConfirmed(true);
        onConfirm();
      } else {
        console.error("Failed to confirm booking");
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    if (paymentConfirmed && display) {
      document.getElementById("paymentForm").submit();
    }
  }, [paymentConfirmed, display]);

  const isDateValid = checkOutDate.isSameOrAfter(checkInDate);
  return (
    <div className="row">
      <div className="col-md-6"></div>
      <div className="card card-body mt-5">
        <h4 className="card-title hotel-color">Reservation Summary</h4>
        <p>
          Name: <strong>{booking.guestFullName}</strong>
        </p>
        <p>
          Email: <strong>{booking.guestEmail}</strong>
        </p>
        <p>
          Check-in Date:{" "}
          <strong>{moment(booking.checkInDate).format("MMM Do YYYY")}</strong>
        </p>
        <p>
          Check-out Date:{" "}
          <strong>{moment(booking.checkOutDate).format("MMM Do YYYY")}</strong>
        </p>
        <p>
          Number of Days Booked: <strong>{numberOfDays}</strong>
        </p>

        <div>
          <h5 className="hotel-color">Number of Guest</h5>
          <strong>
            Adult{booking.numOfAdults > 1 ? "s" : ""} : {booking.numOfAdults}
          </strong>
          <strong>
            <p>Children : {booking.numOfChildren}</p>
          </strong>
        </div>

        {payment > 0 && isDateValid ? ( // Add isDateValid condition here
          <>
            <p>
              Total payment: <strong>${payment}</strong>
            </p>

            {isFormValid && !isBookingConfirmed ? (
              <Button variant="success" onClick={handleConfirmBooking}>
                {isProcessingPayment ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Booking Confirmed, Pay through E SEWA.
                  </>
                ) : (
                  "Booking Confirmed, Pay through E SEWA"
                )}
              </Button>
            ) : isBookingConfirmed ? (
              <div className="d-flex justify-content-center align-items-center">
                <div className="text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : null}
            {paymentConfirmed && (
              <form
                id="paymentForm"
                action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
                method="POST"
              >
                <input
                  type="hidden"
                  id="amount"
                  name="amount"
                  value={total_amount}
                  required
                />
                <input
                  type="hidden"
                  id="tax_amount"
                  name="tax_amount"
                  value="0"
                  required
                />
                <input
                  type="hidden"
                  id="total_amount"
                  name="total_amount"
                  value={total_amount}
                  required
                />
                <input
                  type="hidden"
                  id="transaction_uuid"
                  name="transaction_uuid"
                  value={transaction_uuid}
                  required
                />
                <input
                  type="hidden"
                  id="product_code"
                  name="product_code"
                  value="EPAYTEST"
                  required
                />
                <input
                  type="hidden"
                  id="product_service_charge"
                  name="product_service_charge"
                  value="0"
                  required
                />
                <input
                  type="hidden"
                  id="product_delivery_charge"
                  name="product_delivery_charge"
                  value="0"
                  required
                />
                <input
                  type="hidden"
                  id="success_url"
                  name="success_url"
                  value="http://localhost:5173/booking-success?"
                  required
                />
                <input
                  type="hidden"
                  id="failure_url"
                  name="failure_url"
                  value="https://google.com"
                  required
                />
                <input
                  type="hidden"
                  id="signed_field_names"
                  name="signed_field_names"
                  value="total_amount,transaction_uuid,product_code"
                  required
                />
                <input
                  type="hidden"
                  id="signature"
                  name="signature"
                  value={signature}
                  required
                />
              </form>
            )}
          </>
        ) : (
          <p className="text-danger">
            Check-out date must be after check-in date.
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;
