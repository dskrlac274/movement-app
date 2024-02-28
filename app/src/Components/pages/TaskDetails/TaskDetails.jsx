import React from "react";
import "./TaskDetails.scss";

import {
  MapPin,
  Money,
  Info,
  Calendar,
  CalendarX,
  UsersThree,
  Steps,
} from "@phosphor-icons/react";
import Button from "../../atoms/Button";
import TaskOfferUserCard from "../../atoms/TaskOfferUserCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTaskById } from "../../../api/api";
import Leaflet from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { acceptJob } from "../../../api/api";
import { notifySuccess, notifyFailure } from "../../atoms/Toast/Toast";

const TaskDetails = () => {
  const position = [45.5105190562796, 15.693413086588];
  Leaflet.Icon.Default.imagePath =
    "//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/"; // marker image

  let { id } = useParams();
  const [task, setTask] = useState({});
  const [taskCreator, setTaskCreator] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const accept = async () => {
    try {
      const response = await acceptJob(id);
      notifySuccess("You accepted the job!");

      console.log("You accepted job");
    } catch {
      console.log("You failed to join job");
      notifyFailure();
    }
  };

  const getTaskData = async (id) => {
    console.log(id);
    const currentTask = await getTaskById(id);
    console.log(currentTask);

    setTaskCreator({
      firstName: currentTask.data.task.user.first_name,
      lastName: currentTask.data.task.user.last_name,
      email: currentTask.data.task.user.email,
    });

    console.log(currentTask.data.task);
    setTask(currentTask.data.task);

    console.log("Jajajja", currentTask.data.task.user);
    setTaskCreator({
      firstName: currentTask.data.task.user.first_name,
      lastName: currentTask.data.task.user.last_name,
      email: currentTask.data.task.user.email,
    });
    console.log(task);
  };

  useEffect(() => {
    getTaskData(id);
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  return (
    <div className="task-details-wrapper">
      <h3>{task.name}</h3>
      {Object.keys(task).length > 0 ? (
        <div className="task-details-info">
          {task.is_activity == 0 && (
            <div className="task-details-info-item">
              <Money size={24} className="icon" />
              <p>Reward: {task.reward} €</p>
            </div>
          )}
          <div className="task-details-info-item">
            <Info size={24} className="icon" />
            <p>Description: {task.description}</p>
          </div>
          <div className="task-details-info-item">
            <Calendar size={24} className="icon" />
            <p>Start date: {formatDate(task.start_date)}</p>
          </div>
          <div className="task-details-info-item">
            <CalendarX size={24} className="icon" />
            <p>End date: {formatDate(task.end_date)}</p>
          </div>
          <div className="task-details-info-item">
            <UsersThree size={24} className="icon" />
            <p>Group size: 8 people</p>
          </div>
          <div className="task-details-info-item">
            <Steps size={24} className="icon" />
            <p>Difficulty: {task.difficulty_id}</p>
          </div>

          <div style={{ height: "220px" }}>
            <MapContainer
              center={[task.lat, task.lng]}
              zoom={10}
              scrollWheelZoom={false}
              id="map-container"
              style={{ height: "100%", minHeight: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[task.lat, task.lng]}></Marker>
            </MapContainer>
          </div>
          <Button onClick={accept}>Accept job</Button>
          <TaskOfferUserCard user={taskCreator} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TaskDetails;
