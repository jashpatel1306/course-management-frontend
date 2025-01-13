import axiosInstance from "apiServices/axiosInstance";
import { Button, Dialog, Select, Tooltip } from "components/ui";
import { SUPERADMIN } from "constants/roles.constant";
import React, { useEffect, useState } from "react";
import { CgAssign } from "react-icons/cg";
import { FaRegEye } from "react-icons/fa";
import { HiEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
    "bg-sky-500",
  ];

  // Generate a random index
  const randomIndex = Math.floor(Math.random() * bgColors.length);

  // Return a random background color class
  return bgColors[randomIndex];
};
const CourseCard = ({ index, item }) => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth.user);
  const [IsOpen, setIsOpen] = useState(false);
  const [allCollegeList, setAllCollegeList] = useState([]);
  const [selectAssignData, setSelectAssignData] = useState({
    collegeId: null,
    courseId: null,
  });
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [error, setError] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const getCollegeOptionData = async () => {
    try {
      setCollegeLoading(true);
      const response = await axiosInstance.get(`admin/college-option`);

      if (response.success) {
        setAllCollegeList(response.data);
      } else {
        openNotification("danger", response.error);
      }
    } catch (error) {
      console.log("getCollegeOptionData error :", error.message);
      openNotification("danger", error.message);
    } finally {
      setCollegeLoading(false);
    }
  };

  const AssignCourseData = async () => {
    try {
      setAssignLoading(true);
      let apiData = {
        collegeId: selectAssignData.collegeId.value,
        courseId: selectAssignData.courseId,
      };

      const response = await axiosInstance.post(
        `user/assign-course-college`,
        apiData
      );
      if (response.success) {
        openNotification("success", response.message);
        setIsOpen(false);
        setError("");
      } else {
        openNotification("danger", response.message);
      }
      setSelectAssignData({
        collegeId: null,
        courseId: null,
      });
    } catch (error) {
      console.log("onFormSubmit error: ", error);
      openNotification("danger", error.message);
    } finally {
      setAssignLoading(false);
    }
  };
  const onHandleBox = async () => {
    try {
      if (!selectAssignData?.collegeId?.value) {
        setError("Please Select College Name.");
      }

      if (selectAssignData?.collegeId?.value && selectAssignData?.courseId) {
        setError("");
        await AssignCourseData();
      }
    } catch (error) {
      console.log("onHandleBox error :", error);
    }
  };
  useEffect(() => {
    if (IsOpen) {
      getCollegeOptionData();
    }
  }, [IsOpen]);
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
              className="w-full h-40"
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
          <div className="w-full h-40  rounded absolute  bg-gray-900/[.7] group-hover:flex hidden text-xl items-center justify-center">
            {((!item.collegeId &&
              userData?.authority.toString() === SUPERADMIN) ||
              userData.collegeId === item.collegeId) && (
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
            )}

            <Button
              shape="circle"
              variant="solid"
              color="yellow-700"
              className="mr-2"
              size="sm"
              icon={<FaRegEye />}
              onClick={() => {
                const url = `/app/admin/course/preview/${item._id}`;
                window.open(url, "_blank");
              }}
            />
            {userData?.authority.toString() === SUPERADMIN &&
              item.isPublish && (
                <Button
                  shape="circle"
                  color="green-700"
                  variant="solid"
                  size="sm"
                  icon={<CgAssign size={20} />}
                  onClick={() => {
                    if (item.isPublish) {
                      setSelectAssignData({
                        collegeId: null,
                        courseId: item._id,
                      });
                      setIsOpen(true);
                    } else {
                      openNotification("warning", "Course is not published.");
                    }
                  }}
                />
              )}
          </div>
        </div>

        {/* Course Details */}
        <div className={`p-4 `}>
          <Tooltip title={item?.courseName} placement="bottom">
            <h5 className="text-xl font-bold line-clamp-1 capitalize">
              {item?.courseName}
            </h5>
          </Tooltip>
          <div className="flex justify-start gap-2 py-2 text-white">
            <h4 className="text-[#666666] bg-[#B4C8EC] text-sm px-2 py-1 rounded">
              {item?.totalSections} Sections
            </h4>
            <h4 className="text-[#666666] bg-[#D3CCFF] text-sm px-2 py-1 rounded">
              {item?.totalLectures} Lectures
            </h4>
          </div>
          {item.isPublish ? (
            <p className="text-base font-bold text-[#25A716]">Publish</p>
          ) : (
            <p className="text-base font-bold text-[#E1574C]">Unpublish</p>
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
      <Dialog
        isOpen={IsOpen}
        style={{
          content: {
            marginTop: 250,
          },
        }}
        contentClassName="pb-0 px-0"
        onClose={() => {
          setIsOpen(false);
          setError("");
          setSelectAssignData({
            collegeId: null,
            courseId: null,
          });
        }}
        onRequestClose={() => {
          setIsOpen(false);
          setError("");
          setSelectAssignData({
            collegeId: null,
            courseId: null,
          });
        }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Assign Course To Colleges
          </h5>
          <div className="col-span-1 gap-4 mb-4">
            {userData.authority.toString() === SUPERADMIN && (
              <>
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  Select College Name
                </div>
                <div className="col-span-2">
                  <Select
                    isSearchable={true}
                    className="w-[100%] md:mb-0 mb-4 sm:mb-0"
                    placeholder="Colleges"
                    options={allCollegeList}
                    loading={collegeLoading}
                    value={selectAssignData.collegeId}
                    onChange={(item) => {
                      setSelectAssignData({
                        ...selectAssignData,
                        collegeId: item,
                      });
                    }}
                  />
                </div>
              </>
            )}
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
          <Button variant="solid" onClick={onHandleBox} loading={assignLoading}>
            Submit
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default CourseCard;
