import { Button, Card, Dialog, Select, Upload } from "components/ui";
import React, { useState } from "react";
import { HiOutlineCloudUpload, HiPlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

import StaffForm from "./components/staffForm";
import StaffList from "./components/staffList";
import { BiImport } from "react-icons/bi";
import openNotification from "views/common/notification";
import axiosInstance from "apiServices/axiosInstance";
import DisplayError from "views/common/displayError";
import { FaFileAlt } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { SUPERADMIN } from "constants/roles.constant";

const Staffs = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);

  const [addFlag, setAddFlag] = useState(false);
  const [staffData, setStaffData] = useState();
  const [batchLoading, setBatchLoading] = useState(false);
  const [IsOpen, setIsOpen] = useState(false);
  const [batchList, setBatchList] = useState([]);
  const [allCollegeList, setAllCollegeList] = useState([]);

  const [error, setError] = useState("");

  const handleAddNewStaffClick = () => {
    setAddFlag(true);
  };
  const handleAddNewStaffCloseClick = () => {
    setAddFlag(false);
  };

  
  return (
    <>
   
      <Card className="mt-4">
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
            setAllCollegeList={setAllCollegeList}
            setAllBatchList={setBatchList}
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
