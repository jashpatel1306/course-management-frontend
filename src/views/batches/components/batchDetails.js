/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card } from "components/ui";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import { useNavigate, useParams } from "react-router-dom";
import StudentList from "./studentList";
import StudentForm from "views/students/components/studentForm";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { SUPERADMIN } from "constants/roles.constant";

const BatchDetails = () => {
  const { id } = useParams();
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { authority } = useSelector((state) => state.auth.user.userData);
  const navigate = useNavigate();
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
      console.log("fetchData-batch error:", error);
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
      {!batchLoading && (
        <>
          <div className="flex items-center mb-4">
            <div className="text-xl font-semibold text-center mr-4">
              <Button
                className={`back-button px-1 font-bold text-${themeColor}-${primaryColorLevel} border-2 border-${themeColor}-${primaryColorLevel} dark:text-white`}
                size="sm"
                icon={<HiArrowNarrowLeft size={30} />}
                onClick={async () => {
                  if (authority.toString() === SUPERADMIN) {
                    navigate(
                      `/app/admin/college-details/${batchData?.collegeId}`
                    );
                  } else {
                    navigate(`/app/admin/batches`);
                  }
                }}
              />
            </div>
            <h4
              className={`text-2xl font-semibold text-${themeColor}-${primaryColorLevel} dark:text-white`}
            >
              Batch Details
            </h4>
          </div>
          <Card>
            <>
              <div className="space-y-4">
                <div className="flex gap-x-4 items-center">
                  <span className="text-base font-semibold text-gray-700 ">
                    Batch Name:
                  </span>
                  <span
                    className={` text-${themeColor}-${primaryColorLevel} text-lg font-semibold`}
                  >
                    {batchData?.batchName}
                  </span>
                </div>

                <div className="flex gap-x-4 items-center">
                  <span className="text-base font-semibold text-gray-700">
                    Courses
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {batchData?.courses.length ? (
                      batchData?.courses?.map((item, index) => (
                        <div
                          key={index}
                          className={`bg-${themeColor}-${primaryColorLevel} text-white text-base font-semibold rounded p-1 px-4 capitalize`}
                        >
                          {item.courseName}
                        </div>
                      ))
                    ) : (
                      <div
                        className={`bg-${themeColor}-${primaryColorLevel} text-white text-base font-semibold rounded p-1 px-4 capitalize`}
                      >
                        No Courses Added
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex  gap-x-4 items-center">
                  <span className="text-base font-semibold text-gray-700">
                    Instructors
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {batchData?.instructorIds.length ? (
                      batchData?.instructorIds?.map((item, index) => (
                        <div
                          key={index}
                          className={`bg-${themeColor}-100 text-${themeColor}-${primaryColorLevel} text-base font-semibold rounded p-1 px-4 capitalize`}
                        >
                          {item?.name}
                        </div>
                      ))
                    ) : (
                      <div
                        className={`bg-${themeColor}-${primaryColorLevel} text-white text-base font-semibold rounded p-1 px-4 capitalize`}
                      >
                        No Instructor Added
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          </Card>
        </>
      )}
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
