import React, { useState } from "react";

import { Button, Card } from "components/ui";

import { HiPlusCircle } from "react-icons/hi";
import DepartmentList from "./components/departmentsList";
import DepartmentForm from "./components/departmentsForm";
import { useSelector } from "react-redux";
const AddnewDepartment = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [addFlag, setAddFlag] = useState(false);
  const [departmentData, setDepartmentData] = useState();

  const handleAddnewDepartmentClick = () => {
    setAddFlag(true);
  };
  const handleAddnewDepartmentCloseClick = () => {
    setDepartmentData(null);
    setAddFlag(false);
  };

  return (
    <>
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <div
            className={`text-xl font-semibold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Departments
          </div>
          <div>
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                handleAddnewDepartmentCloseClick();
                setTimeout(() => {
                  handleAddnewDepartmentClick();
                }, 50);
              }}
            >
              Add New Department
            </Button>
          </div>
        </div>
      </Card>
      <DepartmentForm
        IsOpen={addFlag}
        setIsOpen={setAddFlag}
        handleCloseClick={handleAddnewDepartmentCloseClick}
        departmentData={departmentData}
      />
      <Card>
        <DepartmentList
          flag={addFlag}
          parentCloseCallback={handleAddnewDepartmentCloseClick}
          parentCallback={handleAddnewDepartmentClick}
          setData={setDepartmentData}
        />
      </Card>
    </>
  );
};

export default AddnewDepartment;
