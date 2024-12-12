import React from "react";

const SectionHeader = ({ title }) => {
  return (
    <div className="flex space-x-6 m-2 p-2 bg-gray-100 rounded-md shadow-sm ">
      <h1 className="pt-0.5">{title}</h1>
    </div>
  );
};

export default SectionHeader;
