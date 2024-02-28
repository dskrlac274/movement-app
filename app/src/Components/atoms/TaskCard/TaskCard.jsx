import React, { useEffect, useState } from "react";
import "./TaskCard.scss";
import money from "../../../assets/money.png";
import hiking from "../../../assets/hiking.png";
import noImage from "../../../assets/user.png";
import { Steps } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const TaskCard = ({ task }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    if (task.difficulty_id == 1) {
      setDifficulty("easy");
    } else if (task.difficulty_id == 2) {
      setDifficulty("medium");
    } else {
      setDifficulty("hard");
    }
  }, []);

  return (
    <Link to={`/tasks/${task.id}`}>
      <div className="task-card-wrapper">
        <div className="task-card-header">
          <h4>{task.name}</h4>
          <div className="task-card-header-reward">
            {task.is_activity == 0 ? (
              <>
                <img src={money} alt="money-icon" />
                <p>{task.reward} €</p>
              </>
            ) : (
              <>
                <img src={hiking} alt="hiking-icon" />
              </>
            )}
          </div>
        </div>

        <div className="task-card-content">
          <p>Start date: {formatDate(task.start_date)}</p>
          <div className="task-card-content-footer">
            <div className="task-card-content-item">
              <img src={noImage} alt="user-image" />
              <p>
                {task.user?.first_name} {task.user?.last_name}
              </p>
            </div>
            <div className="task-card-content-item">
              <Steps size={32} />
              <p>{difficulty}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TaskCard;
