import React from "react";
import { HiExclamationCircle } from "react-icons/hi";

const DisplayError = (message) => {
  return (
    <>
      {message && (
        <div className="flex  mt-1 text-red-500 font-semibold">
          <HiExclamationCircle className="mr-2 text-red-500" size={20} />
          <span>{message}</span>
        </div>
      )}
    </>
  );
};
export default DisplayError;
