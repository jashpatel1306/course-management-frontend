import { Card } from "components/ui";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import { useParams } from "react-router-dom";
import StudentList from "./studentList";
import StudentForm from "views/students/components/studentForm";

const BatchDetails = () => {
  const { id } = useParams();
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [addFlag, setAddFlag] = useState(false);

  const [batchData, setBatchData] = useState();
  const [batchLoading, setBatchLoading] = useState(false);
  const [studentData, setStudentData] = useState();

  const [apiFlag, setApiFlag] = useState(false);
  const handleAddNewStudentClick = () => {
    setAddFlag(true);
  };
  const handleAddNewStudentCloseClick = () => {
    setAddFlag(false);
  };
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`user/batch/${id}`);
      if (response.success) {
        setBatchData(response.data);
        setBatchLoading(false);
      } else {
        openNotification("danger", response.message);
        setBatchLoading(false);
      }
    } catch (error) {
      console.log("get-all-batch error:", error);
      openNotification("danger", error.message);
      setBatchLoading(false);
    }
  };
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setBatchLoading(true);
      fetchData();
    }
  }, [apiFlag]);
  useEffect(() => {
    setApiFlag(true);
  }, []);
  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Batch Details
          </div>
        </div>
        {!batchLoading && (
          <>
            <div className={` border-2  text-white rounded-xl py-4`}>
              <div className={`flex gap-x-3 items-center p-2  px-4 `}>
                <div
                  className={`bg-${themeColor}-${primaryColorLevel} text-base font-semibold rounded-full p-1 px-3`}
                >
                  {batchData?.batchNumber}
                </div>

                <div
                  className={`text-${themeColor}-${primaryColorLevel} text-base font-semibold capitalize`}
                >
                  {batchData?.batchName}
                </div>
              </div>
              <div className={`flex justify-between  items-center p-2 px-4`}>
                <div className="flex flex-wrap gap-3">
                  {batchData?.courses.length ? (
                    batchData?.courses?.map((item) => {
                      return (
                        <>
                          <div
                            className={`bg-${themeColor}-${primaryColorLevel} text-base font-semibold rounded p-1 px-3`}
                          >
                            Courses-{item}
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <>
                      <div
                        className={`bg-${themeColor}-${primaryColorLevel} text-base font-semibold rounded p-1 px-3`}
                      >
                        No Courses Added
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {batchData?.instructorIds.length ? (
                    batchData?.instructorIds?.map((item) => {
                      return (
                        <>
                          <div
                            className={`text-${themeColor}-${primaryColorLevel} bg-${themeColor}-100 text-base font-semibold rounded p-1 px-3`}
                          >
                            Instructor-{item}
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <>
                      <div
                        className={`bg-${themeColor}-${primaryColorLevel} text-base font-semibold rounded p-1 px-3`}
                      >
                        No Instructor Added
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
      <Card className="mt-4 p-1">
        <div
          className={`text-xl mb-2 font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
        >
          Students Details
        </div>
        <StudentList
          flag={addFlag}
          parentCloseCallback={handleAddNewStudentCloseClick}
          parentCallback={handleAddNewStudentClick}
          setData={setStudentData}
          batchId={id}
        />
        <StudentForm
          isOpen={addFlag}
          handleCloseClick={handleAddNewStudentCloseClick}
          setData={setStudentData}
          studentData={studentData}
        />
      </Card>
    </>
  );
};

export default BatchDetails;
