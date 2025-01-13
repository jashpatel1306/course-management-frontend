import { Card } from "components/ui";
import React from "react";
import { useSelector } from "react-redux";
import CourseList from "./components/courseList";
const StudentsContent = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  return (
    <>
      <Card bodyClass="p-3 sm:p-[1.25rem]">
        <div className="flex items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            My Courses
          </div>
        </div>
      </Card>
      <CourseList />
    </>
  );
};

export default StudentsContent;
