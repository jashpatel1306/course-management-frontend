import axiosInstance from "apiServices/axiosInstance";
import { Button, Dialog, Input, Progress, Tooltip } from "components/ui";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";
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
const CourseCard = ({ index, item, trackingRecode, certificateRecode }) => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [isLoading, setIsLoading] = useState(false);
  const [IsOpen, setIsOpen] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const { userData } = useSelector((state) => state.auth.user);
  const [selectedName, setSelectedName] = useState("");
  const [error, setError] = useState("");
  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Enroll a course. If the course is successfully enrolled, it opens the course page in a new tab.
   * If there is an error, it displays a notification with the error message.
   */
  /*******  32322a38-de76-4611-8aed-ceef91f560d9  *******/
  const enrollCourse = async () => {
    try {
      const response = await axiosInstance.post(
        `student/course/enroll/${item?._id}`
      );
      if (response.success) {
        setIsLoading(false);
        const url = `/app/student/course/${item?._id}`;
        window.open(url, "_blank");
      } else {
        openNotification("danger", response?.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-course error:", error);
      openNotification("danger", error?.message);
      setIsLoading(false);
    }
  };

  const createCertificate = async () => {
    try {
      const apiData = {
        userId: userData?.user_id,
        studentName: selectedName,
        courseName: item?.courseName,
        courseId: item?._id
        // certificateStatus: "APPROVE"
      };
      const response = await axiosInstance.post(
        `/api/student-certificates`,
        apiData
      );
      if (response.status) {
        setIsLoading(false);
        openNotification("success", response?.message);
        setIsOpen(false);
        setError("");
        setSelectedName("");

        // const url = `/app/student/certificate/${certificateRecode?._id}`;
        // window.open(url, "_blank");
      } else {
        openNotification("danger", response?.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("createCertificate error:", error);
      openNotification("danger", error?.message);
      setIsLoading(false);
    }
  };
  const percentage =
    trackingRecode?.trackingContent?.length && trackingRecode?.totalcontent
      ? Math.round(
          (trackingRecode?.trackingContent?.length /
            trackingRecode?.totalcontent) *
            100
        ) // Rounds to the nearest integer
      : 0;
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
            <div className="w-full h-full flex justify-center items-center text-white font-bold text-5xl uppercase bg-red-300">
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
              className="text-lg font-bold line-clamp-1 cursor-pointer"
              onClick={() => {
                if (trackingRecode) {
                  const url = `/app/student/course/${item?._id}`;
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
              {percentage < 100 ? (
                <div className="mt-2">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Complete</span>
                  </div>
                  <Progress percent={percentage} />
                </div>
              ) : certificateRecode ? (
                certificateRecode?.certificateStatus ? (
                  <>
                    {" "}
                    <div className="mt-2">
                      <Button
                        variant="twoTone"
                        block
                        onClick={() => {
                          //new code
                          const url = `/app/student/certificate/${certificateRecode?._id}`;
                          window.open(url, "_blank");
                        }}
                        loading={isLoading}
                      >
                        Certificate
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {" "}
                    <div className="mt-2">
                      <Button
                        variant="twoTone"
                        block
                        onClick={() => {}}
                        loading={isLoading}
                      >
                        Pending
                      </Button>
                    </div>
                  </>
                )
              ) : (
                <div className="mt-2">
                  <Button
                    variant="twoTone"
                    block
                    onClick={() => {
                      setSelectedName("");
                      setIsOpen(true);
                    }}
                    loading={isLoading}
                  >
                    Get Certificate
                  </Button>
                </div>
              )}
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
      <Dialog
        isOpen={IsOpen}
        style={{
          content: {
            marginTop: 250
          }
        }}
        contentClassName="pb-0 px-0"
        onClose={() => {
          setIsOpen(false);
          setError("");
          setSelectedName("");
        }}
        onRequestClose={() => {
          setIsOpen(false);
          setError("");
          setSelectedName("");
        }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Enter your name for the certificate
          </h5>
          <div className="col-span-1 gap-4 mb-4">
            <Input
              placeholder="Enter your name"
              onChange={(e) => setSelectedName(e.target.value)}
            />
          </div>
          {DisplayError(error)}
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setIsOpen(false);
              setError("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={() => {
              if (selectedName) {
                createCertificate();
              } else {
                setError("Please enter your name");
              }
            }}
            loading={apiLoading}
          >
            Submit
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default CourseCard;
