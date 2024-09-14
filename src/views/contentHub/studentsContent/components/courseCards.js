import axiosInstance from "apiServices/axiosInstance";
import { Button, Dialog, Select } from "components/ui";
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
    college: null,
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
  const AssignCourseData = async (adminStatus) => {
    try {
      setAssignLoading(true);
      let apiData = {
        batchId: selectAssignData.batch.value,
        excelFile: selectAssignData.file,
      };
      if (adminStatus) {
        apiData = { ...apiData, collegeId: selectAssignData.college.value };
      }
      const response = await axiosInstance.post(`user/students-bulk`, apiData);
      if (response.success) {
        openNotification("success", response.message);
        setIsOpen(false);
        setError("");
      } else {
        openNotification("danger", response.message);
      }
      setSelectAssignData({
        file: null,
        batch: null,
        college: null,
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
      if (!selectAssignData?.college?.value) {
        setError("Please Select College Name.");
      }

      if (selectAssignData?.college?.value) {
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
            {userData?.authority.toString() === SUPERADMIN && (
              <Button
                shape="circle"
                color="green-700"
                variant="solid"
                size="sm"
                icon={<CgAssign size={20} />}
                onClick={() => {
                  setIsOpen(true);
                }}
              />
            )}
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
            college: null,
          });
        }}
        onRequestClose={() => {
          setIsOpen(false);
          setError("");
          setSelectAssignData({
            college: null,
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
                    isMulti
                    isSearchable={true}
                    className="w-[100%] md:mb-0 mb-4 sm:mb-0"
                    placeholder="Colleges"
                    options={allCollegeList}
                    value={selectAssignData.college}
                    onChange={(item) => {
                      setSelectAssignData({
                        ...selectAssignData,
                        college: item,
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
