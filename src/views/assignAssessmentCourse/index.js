import { Button, Card } from "components/ui";
import React, { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import AssignAssessmentCourseForm from "./components/assignAssessmentCourseForm";
import AssignAssessmentCourseList from "./components/assignAssessmentCourseList";
const AssignCourse = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [addFlag, setAddFlag] = useState(false);
  const [assignCourseData, setAssignCourseData] = useState();
  const handleAddNewAssignCourseClick = () => {
    setAddFlag(true);
  };
  const handleAddNewAssignCourseCloseClick = () => {
    setAddFlag(false);
  };

  return (
    <>
      <Card className="mt-4" bodyClass="p-3 sm:p-[1.25rem]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Assign Courses Details
          </div>
          <div className="flex gap-x-4">
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                handleAddNewAssignCourseCloseClick();
                //setSelectObject(item)
                setAssignCourseData();
                setTimeout(() => {
                  handleAddNewAssignCourseClick();
                }, 50);
              }}
            >
              Add New Assign Assessment Course
            </Button>
          </div>
        </div>
      </Card>
      {/* <Card className="mt-4"> */}
        <AssignAssessmentCourseList
          flag={addFlag}
          parentCloseCallback={handleAddNewAssignCourseCloseClick}
          parentCallback={handleAddNewAssignCourseClick}
          setData={setAssignCourseData}
        />
      {/* </Card> */}
      <AssignAssessmentCourseForm
        isOpen={addFlag}
        handleCloseClick={handleAddNewAssignCourseCloseClick}
        setData={setAssignCourseData}
        assignCourseData={assignCourseData}
      />
    </>
  )
}

export default AssignCourse
