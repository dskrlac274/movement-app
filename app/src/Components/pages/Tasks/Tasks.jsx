import React, { useEffect, useState } from "react";
import { getAllTasks } from "../../../api/api";
import TaskCard from "../../atoms/TaskCard";
import "./Tasks.scss";
import { Link } from "react-router-dom";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const getData = async () => {
    const allTasks = await getAllTasks();
    console.log(allTasks.data.tasks);
    setTasks(allTasks.data.tasks);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="all-tasks-wrapper">
      {tasks.length > 0 ? (
        tasks.map((task) => <TaskCard key={task.id} task={task} />)
      ) : (
        <div className="no-data-wrapper">
          <h3>Currently no available tasks</h3>
        </div>
      )}
    </div>
  );
};

export default Tasks;
