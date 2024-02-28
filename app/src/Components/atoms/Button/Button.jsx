import React from "react";
import "./Button.scss";
import { SignOut } from "@phosphor-icons/react";

const Button = ({ onClick, children, type = "button", icon, isRed }) => {
  return (
    <React.Fragment>
      {icon ? (
        <div className="button-with-icon-wrapper">
          <button
            onClick={onClick}
            type={type}
            className={`button-with-icon ${isRed ? "isRed" : ""} ${icon ? "small" : ""}`}
          >
            <SignOut size={24} /> {children}
          </button>
        </div>
      ) : (
        <button
          onClick={onClick}
          type={type}
          className={`button-without-icon ${isRed ? "isRed" : ""}`}
        >
          {children}
        </button>
      )}
    </React.Fragment>
  );
};

export default Button;
