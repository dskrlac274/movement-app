import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./Components/templ/MainLayout";
import Login from "./Components/pages/Login/Login";
import Register from "./Components/pages/Register/Register";
import TaskDetails from "./Components/pages/TaskDetails/TaskDetails";
import Tasks from "./Components/pages/Tasks/Tasks";
import Profile from "./Components/pages/Profile/Profile";
import Homepage from "./Components/pages/Homepage/Homepage";
import ViewActivities from "./Components/pages/ViewActivities/ViewActivities";
import ViewChores from "./Components/pages/ViewChores/ViewChores";
import AddNewTask from "./Components/pages/AddNewTask/AddNewTask";
import History from "./Components/pages/History/History";
import ReviewProfile from "./Components/pages/ReviewProfile/ReviewProfile";
import Reviews from "./Components/pages/Reviews/Reviews";
import ProtectedRoute from "./Components/atoms/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Homepage />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/my-profile" element={<Profile />} />
          <Route path="/chores" element={<ViewChores />} />
          <Route path="/activities" element={<ViewActivities />} />
          <Route path="/add-task" element={<AddNewTask />} />
          <Route path="/history" element={<History />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/review-profile" element={<ReviewProfile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
