import { Button, Card} from "components/ui";
import React, { useState } from "react";
import {  HiPlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

import StaffForm from "./components/staffForm";
import StaffList from "./components/staffList";


const Staffs = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [addFlag, setAddFlag] = useState(false);
  const [staffData, setStaffData] = useState();
  const [IsOpen] = useState(false);
  const handleAddNewStaffClick = () => {
    setAddFlag(true);
  };
  const handleAddNewStaffCloseClick = () => {
    setAddFlag(false);
  };

  
  return (
    <>
   
      <Card className="mt-4" bodyClass="p-3 sm:p-[1.25rem]">
        <div className="flex items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Staffs Details
          </div>
          <div className="flex gap-x-4">
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                handleAddNewStaffCloseClick();
                //setSelectObject(item)
                setStaffData();
                setTimeout(() => {
                  handleAddNewStaffClick();
                }, 50);
              }}
            >
              Add New Staff
            </Button>
          </div>
        </div>
        <div>
          <StaffList
            flag={addFlag}
            parentCloseCallback={handleAddNewStaffCloseClick}
            parentCallback={handleAddNewStaffClick}
            setData={setStaffData}
            refreshFlag={!IsOpen}
          />
        </div>
      </Card>

      <StaffForm
        isOpen={addFlag}
        handleCloseClick={handleAddNewStaffCloseClick}
        setData={setStaffData}
        staffData={staffData}
      />
  
    </>
  );
};

export default Staffs;
