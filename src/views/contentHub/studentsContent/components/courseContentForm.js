import { Button, Card } from "components/ui";
import React, { useEffect, useState } from "react";
import {
  HiArrowNarrowLeft,
  HiOutlinePencil,
  HiPlusCircle,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import CourseForm from "./courseForm";
import SectionForm from "./sectionForm";

const CourseContentForm = () => {
  const navigate = useNavigate();
  const { course_id } = useParams();
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [addCourseFlag, setAddCourseFlag] = useState(false);
  const [courseData, setCourseData] = useState();

  const handleAddNewCourseClick = () => {
    setAddCourseFlag(true);
  };
  const handleAddNewCourseCloseClick = () => {
    setAddCourseFlag(false);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [apiFlag, setApiFlag] = useState(false);

  const fetchCourseData = async () => {
    try {
      const response = await axiosInstance.get(`user/course/${course_id}`);
      if (response.success) {
        setCourseData(response.data);
        setIsLoading(false);
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
  const createSection = async () => {
    try {
      setSectionLoading(true);
      const response = await axiosInstance.post(`user/section`, {
        name: "New Section",
        courseId: course_id,
      });
      if (response.success) {
        setApiFlag(true);
        openNotification("success", response.message);
      } else {
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("create-section error:", error);
      openNotification("danger", error.message);
    } finally {
      setSectionLoading(false);
    }
  };

  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setIsLoading(true);

      fetchCourseData();
    }
  }, [apiFlag]);
  useEffect(() => {
    setApiFlag(true);
  }, []);
  return (
    <>
      <div>
        <div className="flex items-center mb-4">
          <div className="text-xl font-semibold text-center mr-4">
            <Button
              className={`back-button px-1 font-bold text-${themeColor}-${primaryColorLevel} border-2 border-${themeColor}-${primaryColorLevel} dark:text-white`}
              size="sm"
              icon={<HiArrowNarrowLeft size={30} />}
              onClick={async () => {
                navigate("/app/admin/content-hub/students");
              }}
            />
          </div>
          <h4
            className={`text-2xl font-semibold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Course Content Details
          </h4>
        </div>

        <Card>
          <div className="flex justify-between items-center">
            <div
              className={`text-lg font-bold capitalize text-${themeColor}-${primaryColorLevel} dark:text-white`}
            >
              {courseData?.courseName}
            </div>
            <Button
              variant="twoTone"
              icon={<HiOutlinePencil />}
              className={`border border-${themeColor}-${primaryColorLevel}`}
              onClick={async () => {
                handleAddNewCourseCloseClick();
                setTimeout(() => {
                  handleAddNewCourseClick();
                }, 50);
              }}
            >
              <span>Edit</span>
            </Button>
          </div>
        </Card>
        <div>
          {isLoading ? (
            <>
              <p>Loading....</p>
            </>
          ) : (
            <>
              {courseData?.sections?.length > 0 ? (
                <>
                  {courseData?.sections.map((section,index) => {
                    return (
                      <>
                        <SectionForm sectionIndex={index} section={section} courseId={course_id}/>
                      </>
                    );
                  })}
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </div>

        <Card className="mt-4">
          <div
            className={` p-2 text-${themeColor}-${primaryColorLevel} border-2 border-dashed border-gray-400 rounded-lg  bg-gray-50`}
          >
            <div>
              <Button
                size="md"
                variant="plain"
                block
                className={`text-${themeColor}-${primaryColorLevel} text-lg hover:bg-${themeColor}-100`}
                icon={<HiPlusCircle size={20} />}
                loading={sectionLoading}
                onClick={createSection}
              >
                <span>Add New Section</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <CourseForm
        isOpen={addCourseFlag}
        handleCloseClick={handleAddNewCourseCloseClick}
        setCourseData={setCourseData}
        courseData={courseData}
      />
    </>
  );
};

export default CourseContentForm;
