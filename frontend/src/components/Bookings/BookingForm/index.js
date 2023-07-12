import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useCalendar } from "../../../context/CalendarContext";
import { useCounter } from "../../../context/CounterContext";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";
import Calendar from "../../Calendar";
import GuestCounter from "../GuestCounter";
import ModalButton from "../../Modals/ModalButton";
import LoginFormModal from "../../Modals/LoginFormModal/LoginForm";
import "./BookingForm.css";

const BookingForm = ({ spot, action }) => {
  const [showCounter, setShowCounter] = useState(false);
  const {
    setOnStartDate,
    startDate,
    endDate,
    showCalendar,
    setShowCalendar,
    setFocus,
    calendarErrors,
  } = useCalendar();

  const { setNumAdults, setNumChildren, setNumInfants, occupancy, setOccupancy } = useCounter();
  const history = useHistory();
  const calendarRef = useRef();
  const counterRef = useRef();
  const user = useSelector((state) => state.session.user);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!Object.values(calendarErrors).length) {
      history.push(`/bookings/spots/${spot.id}`);
    }
  };

  const openCalendar = () => {
    setOnStartDate(true);
    setShowCalendar(true);
    setFocus(1);
  };

  const closeCalendar = () => {
    setShowCalendar(false);
    setFocus("");
  };

  const openCounter = () => {
    setShowCounter(true);
  };

  const closeCounter = () => {
    setShowCounter(false);
  };

  useEffect(() => {
    localStorage.setItem("storedNumAdults", 1);
    localStorage.setItem("storedNumChildren", 0);
    localStorage.setItem("storedNumInfants", 0);
    setNumAdults(1);
    setNumChildren(0);
    setNumInfants(0);
    setOccupancy(1);
    return () => {
      setShowCalendar(false);
    };
  }, []);

  useEffect(() => {
    if (!showCalendar && !showCounter) return;

    document.addEventListener("click", (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        closeCalendar(true);
      }
      if (counterRef.current && !counterRef.current.contains(e.target)) {
        closeCounter();
      }
    });

    return () => {
      document.removeEventListener("click", closeCalendar);
      document.removeEventListener("click", closeCounter);
    };
  }, [showCalendar, showCounter]);

  return (
    <>
      {action === "create" ? (
        <div ref={calendarRef}>
          <div className="bookings-container">
            <div className="bookings-selection-container">
              <div className="start-end-display">
                <div className={`start-date-shell`} onClick={openCalendar}>
                  <p id="checkin-text">CHECK-IN</p>
                  <p id="start-date-text">
                    {startDate ? format(startDate, "MM/dd/yyyy") : "Add Date"}
                  </p>
                </div>
                <div className={`end-date-shell`} onClick={openCalendar}>
                  <p id="checkout-text">CHECKOUT</p>
                  <p id="end-date-text">{endDate ? format(endDate, "MM/dd/yyyy") : "Add Date"}</p>
                </div>
                <div className={`calendar-container ${!showCalendar ? "hidden" : ""}`}>
                  <Calendar minNights={spot.minNights} />
                </div>
              </div>
              <div className="num-guests-selector" onClick={openCounter} ref={counterRef}>
                <div style={{ padding: "5px 10px" }}>
                  <p id="checkout-text">Guests</p>
                  <p id="end-date-text">
                    {occupancy} guest{occupancy > 1 ? "s" : ""}
                  </p>
                </div>
                <div className={`num-guests-container ${!showCounter ? "hidden" : ""}`}>
                  <GuestCounter maxGuests={spot.maxGuests} />
                </div>
              </div>
            </div>
          </div>
          <div className="booking-button-container">
            {startDate && endDate ? (
              user ? (
                <button className="pink-button reserve" onClick={(e) => handleBooking(e)}>
                  Reserve
                </button>
              ) : (
                <ModalButton
                  modalComponent={<LoginFormModal />}
                  buttonContent={<button className="pink-button reserve">Reserve</button>}
                />
              )
            ) : (
              <button className="pink-button reserve" onClick={openCalendar}>
                Check Availability
              </button>
            )}
          </div>
        </div>
      ) : (
        action === "edit"(<div>editing here</div>)
      )}
    </>
  );
};

export default BookingForm;
