import { Button } from "components/ui";
import React from "react";
import { FaRegEye } from "react-icons/fa";
import { HiEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
function generateRandomName(minLength, maxLength) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const nameLength =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let randomName = "";

  for (let i = 0; i < nameLength; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    randomName += alphabet[randomIndex];
  }

  // Capitalize the first letter
  return randomName.charAt(0).toUpperCase() + randomName.slice(1);
}

const CourseCard = ({ index, item }) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
      {/* Header Section */}
      <div className="group relative w-60 h-40 flex justify-center items-center bg-sky-500 ">
        {index % 2 === 0 ? (
          <img
            className=" w-60 h-40"
            src="https://rainbowit.net/html/histudy/assets/images/course/course-online-01.jpg" // Replace with the image URL or component
            alt="Course Cover"
          />
        ) : (
          <div className="text-white font-bold text-7xl uppercase">
            {generateRandomName(2, 4)}
          </div>
        )}
        <div className="w-60 h-40  rounded absolute  bg-gray-900/[.7] group-hover:flex hidden text-xl items-center justify-center">
          <Button
            shape="circle"
            variant="solid"
            className="mr-2"
            size="sm"
            icon={<HiOutlinePencil />}
          />
          <Button
            shape="circle"
            variant="solid"
            color="yellow-700"
            className="mr-2"
            size="sm"
            icon={<FaRegEye />}
          />
          <Button
            shape="circle"
            color="red-700"
            variant="solid"
            size="sm"
            icon={<HiOutlineTrash />}
          />
        </div>
      </div>

      {/* Course Details */}
      <div className="p-4">
        <h5 className="text-lg font-bold">React Front To Back {index}</h5>
        <div className="flex justify-start gap-2 py-2 text-white">
          <h4 className="bg-blue-200 text-xs px-2 py-1 rounded">
            {index * 5} Sections
          </h4>
          <h4 className="bg-purple-200 text-xs px-2 py-1 rounded">
            {index * 5 + 5} Topics
          </h4>
        </div>
        {/* Progress Bar */}
        {/* <div className="mt-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Complete</span>
            <span>90%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full mt-1">
            <div
              className="bg-green-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: "90%" }}
            >
              90%
            </div>
          </div>
        </div>

        */}
      </div>
    </div>
  );
};

export default CourseCard;
