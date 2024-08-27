import { Button, Card, Upload } from "components/ui";
import React, { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import BatchScroller from "./components/batchList";
import BatchForm from "./components/batchForm";
import StudentForm from "./components/studentForm";
import StudentList from "./components/studentList";
import { BiImport } from "react-icons/bi";
import openNotification from "views/common/notification";
import axiosInstance from "apiServices/axiosInstance";

const Students = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [addBatchFlag, setAddBatchFlag] = useState(false);
  const [addFlag, setAddFlag] = useState(false);
  const [batchData, setBatchData] = useState();
  const [studentData, setStudentData] = useState();
  const [importLoading, setImportLoading] = useState(false);
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
  const beforeUpload = (files) => {
    let valid = true;

    const allowedFileType = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const maxFileSize = 5000000;
    for (let file of files) {
      if (!allowedFileType.includes(file.type)) {
        valid = false;
      }
      if (file.size >= maxFileSize) {
        valid = false;
      }
    }
    if (valid) {
    }
    return valid;
  };
  const ImportStudentData = async (file) => {
    try {
      setImportLoading(true);
      const response = await axiosInstance.post(`user/students-bulk`, {
        excelFile: file,
      });
      if (response.status) {
        openNotification("success", response.message);
      } else {
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("onFormSubmit error: ", error);
      openNotification("danger", error.message);
    } finally {
      setImportLoading(false);
    }
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
          <div className="flex gap-x-2">
            <Upload
              showList={false}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              beforeUpload={beforeUpload}
              onChange={async (file) => {
                console.log("file:  ", file);
                await ImportStudentData(file[0]);
              }}
            >
              <Button size="sm" variant="twoTone" icon={<BiImport />}>
                Import Data
              </Button>
            </Upload>

            <Button
              size="sm"
              variant="solid"
              loading={importLoading}
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
