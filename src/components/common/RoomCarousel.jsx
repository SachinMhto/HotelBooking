import React, { useEffect, useState } from "react";
import { getAllRooms } from "../utils/ApiFunctions";
import { Link } from "react-router-dom";
import { Card, Carousel, Col, Container, Row } from "react-bootstrap";
import axios from "axios";

const RoomCarousel = () => {
  const [rooms, setRooms] = useState([
    { id: "", roomType: "", roomPrice: "", photo: "" },
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [feedbackData, setFeedbackData] = useState([]);
  const [reviewsFetched, setReviewsFetched] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAllRooms()
      .then((data) => {
        setRooms(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === Math.ceil(rooms.length / 4) - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [rooms.length]);

  if (isLoading) {
    return <div className="mt-5">Loading rooms....</div>;
  }
  if (errorMessage) {
    return <div className="text-danger mb-5 mt-5">Error : {errorMessage}</div>;
  }
  const handleReviewsButtonClick = async (roomId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/bookings/id/${roomId}`
      );
      console.log("Response data:", response.data);
      setFeedbackData(response.data);
      setReviewsFetched(true);
      console.log(guestName);
    } catch (error) {
      console.error("Error submitting review:", error);
      // Handle errors
    }
  };

  return (
    <section className="bg-light mb-5 mt-5 shadow">
      <Link to={"/browse-all-rooms"} className="hote-color text-center">
        Browse all rooms
      </Link>

      <Container>
        <Carousel
          indicators={false}
          controls={false}
          activeIndex={activeIndex}
          onSelect={() => {}}
        >
          {[...Array(Math.ceil(rooms.length / 4))].map((_, index) => (
            <Carousel.Item key={index}>
              <Row>
                {rooms.slice(index * 4, index * 4 + 4).map((room) => (
                  <Col key={room.id} className="mb-4" xs={12} md={6} lg={3}>
                    <Card>
                      <Link to={`/book-room/${room.id}`}>
                        <Card.Img
                          variant="top"
                          src={`data:image/png;base64, ${room.photo}`}
                          alt="Room Photo"
                          className="w-100"
                          style={{ height: "200px" }}
                        />
                      </Link>
                      <Card.Body>
                        <Card.Title className="hotel-color">
                          {room.roomType}
                        </Card.Title>
                        <Card.Title className="room-price">
                          ${room.roomPrice}/night
                        </Card.Title>
                        <div className="flex-shrink-0">
                          <Link
                            to={`/book-room/${room.id}`}
                            className="btn btn-hotel btn-sm"
                          >
                            Book Now
                          </Link>
                          <button
                            className="btn btn-info btn-sm mx-1"
                            onClick={() => handleReviewsButtonClick(room.id)}
                          >
                            Reviews
                          </button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
      {reviewsFetched && (
        <div className="mt-4">
          {feedbackData.length > 0 ? (
            <>
              <h4>Feedbacks:</h4>
              {feedbackData.map((feedback, index) => (
                <div key={index}>
                  <p>Guest Name: {feedback.guestName}</p>
                  <p>Feedback: {feedback.feedback}</p>
                  <hr />
                </div>
              ))}
            </>
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default RoomCarousel;
