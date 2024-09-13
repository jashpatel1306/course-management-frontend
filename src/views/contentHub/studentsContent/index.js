import { Button, Card } from "components/ui";
import React, { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import CourseCard from "./components/courseCards";
import { useNavigate } from "react-router-dom";
import CourseForm from "./components/courseForm";
import CourseList from "./components/courseList";
const StudentsContent = () => {
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

  return (
    <>
      <Card>
        <div className="flex items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Student Content
          </div>
          <div>
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                handleAddNewCourseCloseClick();
                //setSelectObject(item)
                setCourseData();
                setTimeout(() => {
                  handleAddNewCourseClick();
                }, 50);
              }}
            >
              Add New Content
            </Button>
          </div>
        </div>
      </Card>
      <CourseForm
        isOpen={addCourseFlag}
        handleCloseClick={handleAddNewCourseCloseClick}
        setCourseData={setCourseData}
        courseData={courseData}
      />
       <CourseList
          flag={addCourseFlag}
          parentCloseCallback={handleAddNewCourseCloseClick}
          parentCallback={handleAddNewCourseClick}
          setData={setCourseData}
        />
    
    </>
  );
};

export default StudentsContent;
