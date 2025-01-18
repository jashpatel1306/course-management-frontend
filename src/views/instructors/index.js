/* eslint-disable no-unused-vars */
import { Button, Card } from "components/ui";
import React, { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import InstructorForm from "./components/instructorForm";
import InstructorList from "./components/instructorList";
const Instructors = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [addFlag, setAddFlag] = useState(false);
  const [instructorData, setInstructorData] = useState();
  const [allCollegeList, setAllCollegeList] = useState([]);

  const handleAddNewInstructorClick = () => {
    setAddFlag(true);
  };
  const handleAddNewInstructorCloseClick = () => {
    setAddFlag(false);
  };

  return (
    <>
      <Card className="mt-4" bodyClass="p-3 sm:p-[1.25rem]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Instructors Details
          </div>
          <div className="flex gap-x-4">
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                handleAddNewInstructorCloseClick();
                //setSelectObject(item)
                setInstructorData();
                setTimeout(() => {
                  handleAddNewInstructorClick();
                }, 50);
              }}
            >
              Add New Instructor
            </Button>
          </div>
        </div>
      </Card>
      <Card className="mt-4" bodyClass="p-3 sm:p-[1.25rem]">
        <InstructorList
          flag={addFlag}
          parentCloseCallback={handleAddNewInstructorCloseClick}
          parentCallback={handleAddNewInstructorClick}
          setData={setInstructorData}
          setAllCollegeList={setAllCollegeList}
        />
      </Card>
      <InstructorForm
        isOpen={addFlag}
        handleCloseClick={handleAddNewInstructorCloseClick}
        setData={setInstructorData}
        instructorData={instructorData}
      />
    </>
  );
};

export default Instructors;
