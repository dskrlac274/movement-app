import React from "react";
import { User } from "@phosphor-icons/react";

const FileInput = ({ onFileChange }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onFileChange(file);
  };

  return (
    <div>
      <input
        id="file-upload"
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <User size={32} weight="bold" />
      </label>
    </div>
  );
};

export default FileInput;
