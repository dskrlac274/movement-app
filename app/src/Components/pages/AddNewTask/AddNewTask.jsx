import React, { useEffect, useState } from "react";
import "./AddNewTask.scss";
import Input from "../../atoms/Input";
import Button from "../../atoms/Button";
import LocationFinderDummy from "../../atoms/LocationFinderDummy";
import { addTask } from "../../../api/api";
import Leaflet from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { notifySuccess, notifyFailure } from "../../atoms/Toast/Toast";
import { useNavigate } from "react-router";

const AddNewTask = () => {
  const [latLng, setLatLng] = useState({});
  const [marker, setMarker] = useState([45.40473607821249, 16.34990858459468]);
  const [task, setTaskData] = useState({
    name: "",
    reward: 1,
    statusId: 1,
    groupSize: 1,
    description: "",
    startDate: "",
    endDate: "",
    difficultyId: "",
    isActivity: 0,
    lat: marker[0],
    lng: marker[1],
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMarker([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const addNewTask = async () => {
    console.log(task);
    console.log(task.lat + " " + task.lng);
    try {
      const res = await addTask(task);
      console.log(res);
      notifySuccess("Successfully added task!!");
      navigate("/");
    } catch {
      notifyFailure();
    }
  };
  const handleInputChange = (name, value) => {
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    console.log(value);
  };
  const handleNameChange = (e) => {
    handleInputChange("name", e.target.value);
  };
  const handleRewardChange = (e) => {
    handleInputChange("reward", e.target.value);
  };
  const handleGroupSizeChange = (e) => {
    handleInputChange("groupSize", e.target.value);
  };
  const handleDescriptionChange = (e) => {
    handleInputChange("description", e.target.value);
  };
  const handleStartDateChange = (e) => {
    handleInputChange("startDate", e.target.value);
  };
  const handleEndDateChange = (e) => {
    handleInputChange("endDate", e.target.value);
  };
  const handleIsActivityChange = (e) => {
    if (e.target.value == "Activity") {
      handleInputChange("isActivity", 1);
    } else {
      handleInputChange("isActivity", 0);
    }
  };
  const handleDifficultyChange = (e) => {
    if (e.target.value == "Easy") {
      handleInputChange("difficultyId", 1);
    } else if (e.target.value == "Medium") {
      handleInputChange("difficultyId", 2);
    } else {
      handleInputChange("difficultyId", 3);
    }
  };
  useEffect(() => {
    console.log(latLng.lat + " " + latLng.lng);
    if (latLng.lat != undefined && latLng.lng != undefined) {
      console.log("change to" + latLng.lat + latLng.lng);
      task.lat = latLng.lat;
      task.lng = latLng.lng;
      setMarker([latLng.lat, latLng.lng]);
      console.log(marker);
    }
  }, [latLng]);

  return (
    <div className="add-task-wrapper">
      <Input
        placeholder={"Wood chopping"}
        label={"Name:"}
        name="name"
        value={task?.name}
        onChange={handleNameChange}
      />
      <div className="input-wrapper">
        <label className="label-main" name="difficultyId">
          Task type:
        </label>
      </div>
      <div className="activity-type-container">
        <div className="activity-type-item">
          <input
            type="radio"
            id="chore"
            name="activity_type"
            value="Chore"
            onChange={handleIsActivityChange}
          />
          <label htmlFor="chore">Chore</label>
        </div>
        <div className="activity-type-item">
          <input
            type="radio"
            id="activity"
            name="activity_type"
            value="Activity"
            onChange={handleIsActivityChange}
          />
          <label htmlFor="activity">Activity</label>
        </div>
      </div>
      {!task.isActivity && (
        <Input
          placeholder={"100"}
          label={"Reward (€):"}
          name="name"
          value={task?.reward}
          onChange={handleRewardChange}
        />
      )}
      <div style={{ height: "220px", margin: "24px 0" }}>
        <MapContainer
          center={marker}
          zoom={6}
          scrollWheelZoom={false}
          id="map-container"
          style={{ height: "100%", minHeight: "100%" }}
        >
          <LocationFinderDummy setLatLng={setLatLng} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={marker}></Marker>
        </MapContainer>
      </div>
      <Input
        placeholder={"Describe your task"}
        label={"Description:"}
        name="description"
        type="textarea"
        value={task?.description}
        onChange={handleDescriptionChange}
      />
      <Input
        placeholder={"5"}
        label={"Number of people needed:"}
        name="groupSize"
        value={task?.groupSize}
        onChange={handleGroupSizeChange}
      />
      <Input
        label={"Start date:"}
        name="startDate"
        value={task?.startDate}
        onChange={handleStartDateChange}
        type="date"
      />
      <Input
        label={"End date:"}
        name="endDate"
        value={task?.endDate}
        onChange={handleEndDateChange}
        type="date"
      />
      <div className="input-wrapper">
        <label className="label-main" name="difficultyId">
          Difficulty:
        </label>
        <select
          name="difficultyId"
          id="difficultyId"
          className="input-main"
          onClick={handleDifficultyChange}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <div className="button-container">
        <Button type="submit" onClick={addNewTask}>
          Add new task
        </Button>
      </div>
    </div>
  );
};

export default AddNewTask;
