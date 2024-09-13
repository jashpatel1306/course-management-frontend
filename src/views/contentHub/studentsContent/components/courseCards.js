import { Button } from "components/ui";
import React from "react";
import { FaRegEye } from "react-icons/fa";
import { HiEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
const getRandomBgColorClass = () => {
  // Define an array of possible Tailwind background color classes
  const bgColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-sky-500",
  ];

  // Generate a random index
  const randomIndex = Math.floor(Math.random() * bgColors.length);

  // Return a random background color class
  return bgColors[randomIndex];
};
const CourseCard = ({ index, item }) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`max-w-sm rounded-lg overflow-hidden shadow-lg bg-white `}
        key={index}
      >
        {/* Header Section */}
        <div
          className={`group relative w-60 h-40 flex justify-center items-center  ${getRandomBgColorClass()}`}
        >
          {item?.coverImage ? (
            <img
              className=" w-60 h-40 "
              src={
                item?.coverImage ||
                "https://rainbowit.net/html/histudy/assets/images/course/course-online-01.jpg"
              }
              alt="Course Cover"
            />
          ) : (
            <div className="text-white font-bold text-7xl uppercase">
              {item?.courseName
                .split(" ") // Split the phrase by spaces
                .map((word) => word[0].toUpperCase()) // Get the first letter of each word and make it uppercase
                .join("")}
            </div>
          )}
          <div className="w-60 h-40  rounded absolute  bg-gray-900/[.7] group-hover:flex hidden text-xl items-center justify-center">
            <Button
              shape="circle"
              variant="solid"
              className="mr-2"
              size="sm"
              icon={<HiOutlinePencil />}
              onClick={() => {
                navigate(
                  `/app/admin/content-hub/students/course-forms/${item._id}`
                );
              }}
            />
            <Button
              shape="circle"
              variant="solid"
              color="yellow-700"
              className="mr-2"
              size="sm"
              icon={<FaRegEye />}
              onClick={() => {
                navigate(
                  `/app/admin/content-hub/students/course-forms/${item._id}`
                );
              }}
            />
            {/* <Button
              shape="circle"
              color="red-700"
              variant="solid"
              size="sm"
              icon={<HiOutlineTrash />}
            /> */}
          </div>
        </div>

        {/* Course Details */}
        <div className={`p-4 `}>
          <h5 className="text-lg font-bold">{item?.courseName}</h5>
          <div className="flex justify-start gap-2 py-2 text-white">
            <h4 className="bg-blue-200 text-xs px-2 py-1 rounded">
              {item?.totalSections} Sections
            </h4>
            <h4 className="bg-purple-200 text-xs px-2 py-1 rounded">
              {item?.totalLectures} Lectures
            </h4>
          </div>
          {item.isPublic ? (
            <p className="text-base font-bold text-green-500">Publish</p>
          ) : (
            <p className="text-base font-bold text-red-500">Unpublish</p>
          )}
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
    </>
  );
};

export default CourseCard;
