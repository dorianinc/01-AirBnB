import { useEffect, useState } from "react";
import { useModal } from "../../../context/Modal";
import { useDispatch } from "react-redux";
import StarsRatingInput from "./StarsRatingInput/StarsRatingInput";

function CreateReviewModal({ spotId }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [buttonClass, setButtonClass] = useState("pinkButton disabled");
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  useEffect(() => {
    if (review.length >= 10 && rating >= 1) {
      setButtonClass("pinkButton");
    }
  }, [review, rating]);

  const handleClick = (e) => {
    console.log("handling.............", spotId)
    const newReview = {review, rating};
    console.log("newReview 👉", newReview)
  
    e.preventDefault();
    // closeModal();
  };
  const onChange = (number) => {
    setRating(parseInt(number));
  };

  return (
    <>
      <h1>How was your stay?</h1>
      <p className="error"></p>
      <form className="loginForm" onSubmit={(e) => handleClick(e)}>
        <textarea
          name="description"
          className="textArea review"
          value={review}
          placeholder="Leave your review here..."
          onChange={(e) => setReview(e.target.value)}
        />
        <StarsRatingInput onChange={onChange} rating={rating}/>
        <button className={buttonClass} disabled={buttonClass.includes("disabled")}>
          Submit Your Review
        </button>
      </form>
    </>
  );
}

export default CreateReviewModal;
