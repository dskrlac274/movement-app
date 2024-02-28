import React, { useEffect, useState } from "react";
import "./ViewChores.scss";
import { getAllTasks, getAllTasksInRadius } from "../../../api/api";
import TaskCard from "../../atoms/TaskCard";
import { Sliders, X } from "@phosphor-icons/react/dist/ssr";
import Leaflet from "leaflet";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import RadiusSlider from "../../atoms/RadiusSlider/RadiusSlider";
import Button from "../../atoms/Button";

const ViewChores = () => {
  const [activities, setActivities] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [marker, setMarker] = useState([45.40473607821249, 16.34990858459468]);
  const [radius, setRadius] = useState(5);

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
  };

  const getData = async () => {
    const allActivities = await getAllTasks();
    const filteredActivities = allActivities.data.tasks.filter(
      (task) => task.is_activity === 0
    );
    setActivities(filteredActivities);
  };

  useEffect(() => {
    getData();
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

  const filterHandler = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const search = async () => {
    let latLng = `${marker[0]},${marker[1]}`;
    console.log(latLng);

    const allActivities = await getAllTasksInRadius(radius, latLng);
    console.log(allActivities);

    const filteredActivities = allActivities.data.tasks.filter(
      (task) => task.is_activity === 1
    );
    setActivities(filteredActivities);
  };

  return (
    <div className="all-activities-wrapper">
      <div className="applied-filters">
        <p>Applied filters:</p>
        {isFilterOpen ? (
          <X onClick={filterHandler} size={32} />
        ) : (
          <Sliders onClick={filterHandler} size={32} />
        )}
      </div>
      {isFilterOpen && (
        <div className="filter-container">
          <div style={{ height: "220px", margin: "24px 0" }}>
            <MapContainer
              center={marker}
              zoom={6}
              scrollWheelZoom={false}
              id="map-container"
              style={{ height: "100%", minHeight: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={marker}></Marker>
              <Circle center={marker} radius={radius * 1000} />
            </MapContainer>
            <RadiusSlider
              radius={radius}
              setRadius={setRadius}
              onChange={handleRadiusChange}
            />
          </div>
          <div className="btn-container">
            <Button onClick={search}>Search</Button>
          </div>
        </div>
      )}
      <div className="all-activities-container">
        {activities.length > 0 ? (
          activities.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="no-data-wrapper">
            <h3>Currently no available chores</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewChores;
