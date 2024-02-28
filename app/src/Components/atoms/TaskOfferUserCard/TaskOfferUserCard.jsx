import React from "react";
import "./TaskOfferUserCard.scss";
import noImage from "../../../assets/user.png";

const TaskOfferUserCard = ({ user }) => {
  return (
    <div className="task-offer-user-card-wrapper">
      <p>Job offers:</p>
      <div className="task-offer-user-card-content">
        <img src={noImage} alt="user-img" />
        <div className="task-offer-user-card-content-text">
          <p>
            {user.firstName} {user.lastName}
          </p>
          <p>Contact: {user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskOfferUserCard;
