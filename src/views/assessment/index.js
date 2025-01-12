import { Button, Card, Dialog, Input, Select } from "components/ui";
import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { HiPlusCircle } from "react-icons/hi";
import openNotification from "views/common/notification";
import axiosInstance from "apiServices/axiosInstance";
import DisplayError from "views/common/displayError";
import { useNavigate } from "react-router-dom";
import AssessmentList from "./components/assessmentList";
import { SUPERADMIN } from "constants/roles.constant";
const Assessment = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [IsOpen, setIsOpen] = useState(false);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeList, setCollegeList] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    collegeId:
      userData?.authority.toString() === SUPERADMIN ? null : userData.collegeId,
  });
  const [error, setError] = useState("");
  const CreateAssessment = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`user/assessment`, formData);
      if (response?.success && response?.data?._id) {
        openNotification("success", response.message);
        navigate(`/app/admin/assessment/form/${response.data._id}`, {
          state: response.data,
        });
        setIsOpen(false);
        setError("");
      } else {
        openNotification("danger", response.message);
      }
      setFormData({
        title: "",
      });
    } catch (error) {
      console.log("onFormSubmit error: ", error);
      openNotification("danger", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const onHandleBox = async () => {
    try {
      if (!formData.collegeId) {
        setError("Please Select a College Name.");
      }
      if (!formData?.title) {
        setError("Please Enter Assessment Title.");
      }

      if (formData?.title && formData.collegeId) {
        setError("");
        CreateAssessment(formData);
      }
    } catch (error) {
      console.log("onHandleBox error :", error);
    }
  };
  const getCollegeOptionData = async () => {
    try {
      setCollegeLoading(true);
      const response = await axiosInstance.get(`admin/college-option`);

      if (response.success) {
        setCollegeList(response.data);
      } else {
        openNotification("danger", response.error);
      }
    } catch (error) {
      console.log("getCollegeOptionData error :", error.message);
      openNotification("danger", error.message);
    } finally {
      setCollegeLoading(false);
    }
  };
  useEffect(() => {
    if (userData.authority.toString() === SUPERADMIN) {
      getCollegeOptionData();
    }
  }, []);
  return (
    <>
      <Card bodyClass="p-3 sm:p-[1.25rem]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Assessments
          </div>
          <div className="w-full md:w-auto">
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                setIsOpen(true);
              }}
              className="w-full md:w-auto"
            >
              Add New Assessment
            </Button>
          </div>
        </div>
      </Card>
      <div>
        <AssessmentList />
      </div>

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
          setFormData({
            title: "",
            collegeId: "",
          });
        }}
        onRequestClose={() => {
          setIsOpen(false);
          setError("");
          setFormData({
            title: "",
            collegeId: "",
          });
        }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Assessment Details
          </h5>
          {/* Assessment Title  */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Assessment Title
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter Assessment Title"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  });
                }}
                value={formData?.title}
              />
            </div>
          </div>
          {userData?.authority.toString() === SUPERADMIN && (
            <>
              {/*  College Name */}
              <div className="col-span-1 gap-4 mb-4">
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  Select College
                </div>
                <div className="col-span-2">
                  <Select
                    placeholder="Please Select College"
                    loading={collegeLoading}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        collegeId: e.value,
                      });
                    }}
                    value={collegeList.find(
                      (info) => info.value === formData?.collegeId
                    )}
                    options={collegeList}
                  />
                </div>
              </div>
            </>
          )}

          {DisplayError(error)}
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setIsOpen(false);
              setFormData({
                title: "",
                collegeId: null,
              });
              setError("");
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={onHandleBox} loading={isLoading}>
            Next
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default Assessment;
