import React from "react";
import "./ReviewProfile.scss";
import User from "../../../assets/User.png";
import ReactStars from "react-stars";
import { render } from "react-dom";
import Button from "../../atoms/Button";

const ratingChanged = (newRating) => {
  console.log(newRating);
};

const ReviewProfile = () => {
  //here the profile of ungraded person will be
  return (
    <div className="review-profile-wrapper">
      <img src={User} alt="" />
      <p>Marko Markić</p>

      <div className="profile-reviews-wrapper">
        <p>Average grade 3.6</p>

        <ReactStars
          count={5}
          onChange={ratingChanged}
          size={24}
          color2={"#ffd700"}
          half={"false"}
        />
      </div>

      <Button>Rate</Button>
      <Button>Did not attend</Button>
    </div>
  );
};

export default ReviewProfile;
