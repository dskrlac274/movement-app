import React, { useEffect, useState } from "react";
import "./History.scss";
import { getHistoryTasks } from "../../../api/api";
import TaskCard from "../../atoms/TaskCard";

const History = () => {
  const [activities, setActivities] = useState([]);

  const getData = async () => {
    const allActivities = await getHistoryTasks();
    const filteredActivities = allActivities.data.tasks;
    setActivities(filteredActivities);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="all-activities-wrapper">
      {activities.length > 0 ? (
        activities.map((task) => <TaskCard key={task.id} task={task} />)
      ) : (
        <div className="no-data-wrapper">
          <h3>Currently no history tasks</h3>
        </div>
      )}
    </div>
  );
};

export default History;
