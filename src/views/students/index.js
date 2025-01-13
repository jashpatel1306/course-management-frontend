import { Button, Card, Dialog, Select, Upload } from "components/ui";
import React, { useState } from "react";
import { HiOutlineCloudUpload, HiPlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

import StudentForm from "./components/studentForm";
import StudentList from "./components/studentList";
import { BiImport } from "react-icons/bi";
import openNotification from "views/common/notification";
import axiosInstance from "apiServices/axiosInstance";
import DisplayError from "views/common/displayError";
import { FaFileAlt } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { SUPERADMIN } from "constants/roles.constant";

const Students = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);

  const [addFlag, setAddFlag] = useState(false);
  const [studentData, setStudentData] = useState();
  const [importLoading, setImportLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [IsOpen, setIsOpen] = useState(false);
  const [batchList, setBatchList] = useState([]);
  const [allCollegeList, setAllCollegeList] = useState([]);
  const [selectImportData, setSelectImportData] = useState({
    file: null,
    batch: null,
    college: null,
  });
  const [error, setError] = useState("");

  const handleAddNewStudentClick = () => {
    setAddFlag(true);
  };
  const handleAddNewStudentCloseClick = () => {
    setAddFlag(false);
  };
  const getBatchOptionData = async (collegeId = "") => {
    try {
      setBatchLoading(true);
      const response =
        userData.authority.toString() === SUPERADMIN && collegeId
          ? await axiosInstance.get(`admin/batches-option/${collegeId}`)
          : await axiosInstance.get(`user/batches-option`);

      if (response.success) {
        setBatchList(response.data.filter((e) => e.value !== "all"));
      } else {
        openNotification("danger", response.error);
      }
    } catch (error) {
      console.log("getBatchOptionData error :", error.message);
      openNotification("danger", error.message);
    } finally {
      setBatchLoading(false);
    }
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
  const ImportStudentData = async (adminStatus) => {
    try {
      setImportLoading(true);
      let apiData = {
        batchId: selectImportData.batch.value,
        excelFile: selectImportData.file,
      };
      if (adminStatus) {
        apiData = { ...apiData, collegeId: selectImportData.college.value };
      }
      const response = await axiosInstance.post(`user/students-bulk`, apiData);
      if (response.success) {
        openNotification("success", response.message);
        setIsOpen(false);
        setError("");
      } else {
        openNotification("danger", response.message);
      }
      setSelectImportData({
        file: null,
        batch: null,
        college: null,
      });
    } catch (error) {
      console.log("onFormSubmit error: ", error);
      openNotification("danger", error.message);
    } finally {
      setImportLoading(false);
    }
  };
  const onHandleBox = async () => {
    try {
      if (!selectImportData?.file?.name) {
        setError("Please Select file.");
      }
      if (
        userData.authority.toString() === SUPERADMIN &&
        !selectImportData?.college?.value
      ) {
        setError("Please Select College Name.");
      }
      if (!selectImportData?.batch?.value) {
        setError("Please Select Batch Name.");
      }

      if (selectImportData?.batch?.value && selectImportData?.file) {
        setError("");
        if (
          userData.authority.toString() === SUPERADMIN &&
          selectImportData?.college?.value
        ) {
          await ImportStudentData("admin");
        } else {
          await ImportStudentData();
        }
      }
    } catch (error) {
      console.log("onHandleBox error :", error);
    }
  };
  return (
    <>
   
      <Card className="mt-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between ">
          <h3
            className={`font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Students Details
          </h3>
          <div className="w-full md:w-auto flex justify-between md:justify-end gap-x-4 mt-2 md:mt-0">
            <Button
              size="sm"
              variant="twoTone"
              className={`border border-${themeColor}-${primaryColorLevel}`}
              icon={<BiImport />}
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Import Data
            </Button>

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
            setAllCollegeList={setAllCollegeList}
            setAllBatchList={setBatchList}
            refreshFlag={!IsOpen}
          />
        </div>
      </Card>

      <StudentForm
        isOpen={addFlag}
        handleCloseClick={handleAddNewStudentCloseClick}
        setData={setStudentData}
        studentData={studentData}
      />
      <Dialog
        isOpen={IsOpen}
        style={{
          content: {
            marginTop: 250,
          },
        }}
        contentClassName="pb-0 px-0"
        onClose={() => {
          setIsOpen(false);
          setError("");
          setSelectImportData({
            file: null,
            batch: null,
            college: null,
          });
        }}
        onRequestClose={() => {
          setIsOpen(false);
          setError("");
          setSelectImportData({
            file: null,
            batch: null,
            college: null,
          });
        }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Import Data
          </h5>
          <div className="col-span-1 gap-4 mb-4">
            {userData.authority.toString() === SUPERADMIN && (
              <>
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  Select College Name
                </div>
                <div className="col-span-2">
                  <Select
                    isSearchable={true}
                    className="w-[100%] md:mb-0 mb-4 sm:mb-0"
                    placeholder="Colleges"
                    options={allCollegeList}
                    value={selectImportData.college}
                    onChange={(item) => {
                      setSelectImportData({
                        ...selectImportData,
                        college: item,
                      });
                      getBatchOptionData(item.value);
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Select Batch Name
            </div>
            <div className="col-span-2">
              <Select
                isSearchable={true}
                className="w-[100%] md:mb-0 mb-4 sm:mb-0"
                placeholder="Batches"
                options={batchList}
                loading={batchLoading}
                value={selectImportData.batch}
                onChange={(item) => {
                  setSelectImportData({ ...selectImportData, batch: item });
                }}
              />
            </div>
          </div>
          <div className="col-span-1 gap-4 mb-2">
            <div className="col-span-2">
              {selectImportData?.file ? (
                <>
                  <div
                    className={`flex justify-between items-center text-base gap-2 p-3 bg-${themeColor}-100 rounded-lg font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                  >
                    <div className="flex gap-3 justify-between items-center">
                      <FaFileAlt size={20} />

                      {selectImportData?.file?.name}
                    </div>
                    <div
                      onClick={() => {
                        setSelectImportData({
                          ...selectImportData,
                          file: null,
                        });
                      }}
                    >
                      <IoMdCloseCircle size={20} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Upload
                    showList={false}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    beforeUpload={beforeUpload}
                    onChange={async (file) => {
                      setSelectImportData({
                        ...selectImportData,
                        file: file[0],
                      });
                    }}
                  >
                    <Button
                      size="sm"
                      variant="twoTone"
                      icon={<HiOutlineCloudUpload size={20} />}
                    >
                      Upload CSV file
                    </Button>
                  </Upload>
                </>
              )}
            </div>
          </div>
          {DisplayError(error)}
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setIsOpen(false);
              setError("");
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={onHandleBox} loading={importLoading}>
            Submit
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default Students;
