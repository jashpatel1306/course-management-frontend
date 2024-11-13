import axiosInstance from "apiServices/axiosInstance";
import { Button, Progress, Tooltip } from "components/ui";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import openNotification from "views/common/notification";
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
    "bg-sky-500"
  ];

  // Generate a random index
  const randomIndex = Math.floor(Math.random() * bgColors.length);

  // Return a random background color class
  return bgColors[randomIndex];
};
const CourseCard = ({ index, item, trackingRecode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const enrollCourse = async () => {
    try {
      const response = await axiosInstance.post(
        `student/course/enroll/${item._id}`
      );
      if (response.success) {
        setIsLoading(false);
        const url = `/app/student/course/${item._id}`;
        window.open(url, "_blank");
      } else {
        openNotification("danger", response.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-course error:", error);
      openNotification("danger", error.message);
      setIsLoading(false);
    }
  };
  return (
    <>
      <div
        className={`w-60 rounded-lg overflow-hidden shadow-lg bg-white `}
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
            <div className="w-full h-full flex justify-center items-center text-white font-bold text-5xl uppercase bg-red-300">
              <p>
                {item?.courseName
                  .split(" ") // Split the phrase by spaces
                  .map((word) => word[0].toUpperCase()) // Get the first letter of each word and make it uppercase
                  .slice(0, 4)
                  .join("")}
              </p>
            </div>
          )}
        </div>

        {/* Course Details */}
        <div className={`p-4 `}>
          <Tooltip title={item?.courseName} placement="bottom">
            <h5
              className="text-lg font-bold line-clamp-1 cursor-pointer"
              onClick={() => {
                if (trackingRecode) {
                  const url = `/app/student/course/${item._id}`;
                  window.open(url, "_blank");
                }
              }}
            >
              {item?.courseName}
            </h5>
          </Tooltip>
          <div className="flex justify-start gap-2 py-2 text-white">
            <h4 className="bg-blue-200 text-xs px-2 py-1 rounded">
              {item?.totalSections} Sections
            </h4>
            <h4 className="bg-purple-200 text-xs px-2 py-1 rounded">
              {item?.totalLectures} Lectures
            </h4>
          </div>

          {/* Progress Bar */}
          {trackingRecode ? (
            <>
              <div className="mt-2">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Complete</span>
                </div>
                <Progress
                  percent={
                    trackingRecode.trackingContent.length &&
                    trackingRecode.totalcontent
                      ? Math.round(
                          (trackingRecode.trackingContent.length /
                            trackingRecode.totalcontent) *
                            100
                        ) // Rounds to the nearest integer
                      : 0
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div className="mt-2">
                <Button
                  variant="twoTone"
                  block
                  onClick={enrollCourse}
                  loading={isLoading}
                >
                  Enroll now
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseCard;
