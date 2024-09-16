import { Button, Card } from "components/ui";
import React, { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import AssignCourseForm from "./components/assignCourseForm";
import AssignCourseList from "./components/assignCourseList";
const AssignCourse = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);

  const [addFlag, setAddFlag] = useState(false);
  const [assignCourseData, setAssignCourseData] = useState();
  const [IsOpen, setIsOpen] = useState(false);
  const [batchList, setBatchList] = useState([]);
  const [allCollegeList, setAllCollegeList] = useState([]);

  const handleAddNewAssignCourseClick = () => {
    setAddFlag(true);
  };
  const handleAddNewAssignCourseCloseClick = () => {
    setAddFlag(false);
  };

  return (
    <>
      <Card className="mt-4">
        <div className="flex items-center justify-between ">
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
              Add New Assign Course
            </Button>
          </div>
        </div>
      </Card>
      <Card className="mt-4">
        <AssignCourseList
          flag={addFlag}
          parentCloseCallback={handleAddNewAssignCourseCloseClick}
          parentCallback={handleAddNewAssignCourseClick}
          setData={setAssignCourseData}
          setAllCollegeList={setAllCollegeList}
        />
      </Card>
      <AssignCourseForm
        isOpen={addFlag}
        handleCloseClick={handleAddNewAssignCourseCloseClick}
        setData={setAssignCourseData}
        assignCourseData={assignCourseData}
      />
    </>
  )
}

export default AssignCourse
