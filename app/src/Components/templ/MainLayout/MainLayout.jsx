import React from "react";
import "./MainLayout.scss";
import Header from "../../molecules/Header";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="main-layout-wrapper">
      <div className="main-section">
        <div className="content-wrapper">
          <Header />

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
