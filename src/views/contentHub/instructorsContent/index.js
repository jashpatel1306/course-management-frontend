import React, { useState } from "react";
import CourseForm from "./components/courseForm";
import CourseList from "./components/courseList";
const InstructorsContent = () => {
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

export default InstructorsContent;
