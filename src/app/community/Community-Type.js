import React from "react";

function CommunityType({ selectedOptions, handleCheckboxChange }) {
  const handleInternalCheckboxChange = (e) => {
    const { name, checked } = e.target;
    handleCheckboxChange(name, checked);
  };

  const firstColumnOptions = Object.keys(selectedOptions).slice(0, 6);
  const secondColumnOptions = Object.keys(selectedOptions).slice(6);
  return (
    <div className="p-6 bg-gray-50 rounded-lg border border-gray-300">
      <h2 className="text-xl text-center justify-center font-semibold mb-4">
        Select Community Type
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          {firstColumnOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={option}
                checked={selectedOptions[option]}
                onChange={handleInternalCheckboxChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <div>
          {secondColumnOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={option}
                checked={selectedOptions[option]}
                onChange={handleInternalCheckboxChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunityType;
