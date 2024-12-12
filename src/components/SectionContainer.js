import React from "react";

const SectionContainer = ({ children, title }) => {
  return (
    <div className="h-full border-blue-500 rounded-lg border-2 pt-4 shadow-sm w-full mt-2">
      <h2 className="text-lg font-semibold pb-2 pt-2 text-center">{title}</h2>
      <div className="flex flex-col space-y-4 justify-center p-4">
        {children}
      </div>
    </div>
  );
};

export default SectionContainer;
