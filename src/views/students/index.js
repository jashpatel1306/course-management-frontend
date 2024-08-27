import { Button, Card } from "components/ui";
import React, { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import BatchScroller from "./components/batchList";
import BatchForm from "./components/batchForm";
import StudentForm from "./components/studentForm";
import StudentList from "./components/studentList";

const Students = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [addBatchFlag, setAddBatchFlag] = useState(false);
  const [addFlag, setAddFlag] = useState(false);
  const [batchData, setBatchData] = useState();
  const [studentData, setStudentData] = useState();
  
  const handleAddNewBatchClick = () => {
    setAddBatchFlag(true);
  };
  const handleAddNewBatchCloseClick = () => {
    setAddBatchFlag(false);
  };
  const handleAddNewStudentClick = () => {
    setAddFlag(true);
  };
  const handleAddNewStudentCloseClick = () => {
    setAddFlag(false);
  };

  return (
    <>
      <Card>
        <div className="flex items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Batches
          </div>
          <div>
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                handleAddNewBatchCloseClick();
                //setSelectObject(item)
                setBatchData();
                setTimeout(() => {
                  handleAddNewBatchClick();
                }, 50);
              }}
            >
              Add New Batches
            </Button>
          </div>
        </div>
        <div>
          <BatchScroller
            flag={addBatchFlag}
            parentCloseCallback={handleAddNewBatchCloseClick}
            parentCallback={handleAddNewBatchClick}
            batchData={batchData}
          />
        </div>
      </Card>

      <BatchForm
        isOpen={addBatchFlag}
        handleCloseClick={handleAddNewBatchCloseClick}
        batchData={batchData}
      />

      <Card className="mt-4">
        <div className="flex items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Batch Details
          </div>
          <div>
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                handleAddNewStudentCloseClick();
                //setSelectObject(item)
                setStudentData();
                setTimeout(() => {
                  handleAddNewStudentClick();
                }, 50);
              }}
            >
              Add New Student
            </Button>
          </div>
        </div>
        <div>
          <StudentList
            flag={addFlag}
            parentCloseCallback={handleAddNewStudentCloseClick}
            parentCallback={handleAddNewStudentClick}
            setData={setStudentData}
            
          />
        </div>
      </Card>

      <StudentForm
        isOpen={addFlag}
        handleCloseClick={handleAddNewStudentCloseClick}
        setData={setStudentData}
        studentData={studentData}
      />
    </>
  );
};

export default Students;
