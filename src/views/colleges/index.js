import React, { useState } from "react";

import { Button, Card } from "components/ui";

import { HiPlusCircle } from "react-icons/hi";
import CollegesList from "./components/collegesList";
import CollegesForm from "./components/collegesForm";
import { useSelector } from "react-redux";
const Colleges = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [addFlag, setAddFlag] = useState(false);
  const [userData, setUserData] = useState();
  const handleAddNewCollegeClick = () => {
    setAddFlag(true);
  };
  const handleAddNewCollegeCloseClick = () => {
    setAddFlag(false);
  };
  return (
    <>
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Colleges
          </div>
          <div>
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                handleAddNewCollegeCloseClick();
                //setSelectObject(item)
                setUserData();
                setTimeout(() => {
                  handleAddNewCollegeClick();
                }, 50);
              }}
            >
              Add New Colleges
            </Button>
          </div>
        </div>
      </Card>
      <CollegesForm
        isOpen={addFlag}
        handleCloseClick={handleAddNewCollegeCloseClick}
        userData={userData}
      />
      <Card>
        <CollegesList
          flag={addFlag}
          parentCloseCallback={handleAddNewCollegeCloseClick}
          parentCallback={handleAddNewCollegeClick}
          setUserData={setUserData}
        />
      </Card>
    </>
  );
};

export default Colleges;
