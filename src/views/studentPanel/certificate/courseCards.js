import { Button, Dialog, Tooltip } from "components/ui";
import React from "react";
import { useSelector } from "react-redux";
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
    "bg-sky-500"
  ];

  // Generate a random index
  const randomIndex = Math.floor(Math.random() * bgColors.length);

  // Return a random background color class
  return bgColors[randomIndex];
};
const CourseCard = ({ index, item, certificateRecode }) => {
  const navigate = useNavigate();
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  return (
    <>
      <div
        className={`w-full rounded-lg overflow-hidden shadow-lg bg-white `}
        key={index}
      >
        {/* Header Section */}
        <div
          className={`group relative w-full h-40 flex justify-center items-center  ${getRandomBgColorClass()}`}
        >
          {item?.coverImage ? (
            <img
              className=" w-full h-40 "
              src={
                item?.coverImage ||
                "https://rainbowit.net/html/histudy/assets/images/course/course-online-01.jpg"
              }
              alt="Course Cover"
            />
          ) : (
            <div
              className={`w-full h-full flex justify-center items-center text-white font-bold text-5xl uppercase bg-red-300`}
            >
              <p>
                {item?.courseName
                  .split(" ") // Split the phrase by spaces
                  .map((word) => word[0]?.toUpperCase()) // Get the first letter of each word and make it uppercase
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
              className={`text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-${themeColor}-${primaryColorLevel}`}
            >
              {item?.courseName}
            </h5>
          </Tooltip>
          {certificateRecode &&
            (certificateRecode?.certificateStatus ? (
              <>
                <div className="mt-2">
                  <Button
                    variant="twoTone"
                    block
                    onClick={() => {
                      //new code
                      const url = `/app/student/certificate/${certificateRecode?._id}`;
                      window.open(url, "_blank");
                    }}
                  >
                    Certificate
                  </Button>
                </div>
              </>
            ) : (
              <>
                {" "}
                <div className="mt-2">
                  <Button variant="twoTone" block>
                    Pending
                  </Button>
                </div>
              </>
            ))}
        </div>
      </div>
    </>
  );
};

export default CourseCard;
