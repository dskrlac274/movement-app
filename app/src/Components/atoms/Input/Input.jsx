import React, { useEffect, useState } from "react";
import "./Input.scss";

const Input = ({
  placeholder,
  label,
  type = "text",
  onChange,
  isDisabledDefault,
  defaultValue,
}) => {
  const [isDisabled, setIsDisabled] = useState(isDisabledDefault);
  useEffect(() => {
    console.log(isDisabledDefault + " isDisabledDefault");
    setIsDisabled(isDisabledDefault);
  }, [isDisabledDefault]);
  return (
    <div className="input-wrapper">
      {label && <label className="label-main">{label}</label>}
      {(type == "text" ||
        type == "date" ||
        type == "email" ||
        type == "password") && (
        <input
          type={type}
          placeholder={placeholder}
          className={`input-main ${isDisabled ? "disabled" : ""}`}
          onChange={onChange}
          disabled={isDisabled}
          value={defaultValue}
      />
      )}
      {type == "textarea" && (
        <textarea
          type={type}
          placeholder={placeholder}
          className={`input-main ${isDisabled ? "disabled" : ""}`}
          onChange={onChange}
          disabled={isDisabled}
          rows={8}
        />
      )}
    </div>
  );
};

export default Input;
