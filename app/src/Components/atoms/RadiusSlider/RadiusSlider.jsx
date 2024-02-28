import React from "react";
import "./RadiusSlider.scss";

const RadiusSlider = ({ radius, setRadius, onChange }) => {
  const handleChange = (event) => {
    onChange(parseFloat(event.target.value));
    setRadius(parseFloat(event.target.value));
  };

  return (
    <div className="radius-slider">
      <label htmlFor="radius">Radius: {radius} km</label>
      <div className="radius-slider-container"><input
        type="range"
        id="radius"
        name="radius"
        min="1"
        max="50"
        step="1"
        value={radius}
        onChange={handleChange}
      /></div>
    </div>
  );
};

export default RadiusSlider;
