import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaQuestionCircle,
  FaRegClock,
  FaUserFriends,
  FaCalendarAlt,
} from "react-icons/fa";
import { Button, Card, Dialog, Select } from "components/ui";
import { useNavigate } from "react-router-dom";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import DisplayError from "views/common/displayError";
const AssessmentCard = ({ variant = "full", assessmentData,batchList, setApiFlag }) => {
  const navigate = useNavigate();

  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  const cardClasses = ` border-2 border-${themeColor}-${primaryColorLevel} text-${themeColor}-${primaryColorLevel} rounded-xl shadow-lg ${
    variant === "full" ? "w-full" : "w-56"
  }`;
  const [IsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectObject, setSelectObject] = useState();
  const [formData, setFormData] = useState();
  const [error, setError] = useState();

  const updateAssessment = async (apiData) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.put(
        `user/assessment/${apiData.assessmentId}`,
        apiData
      );
      if (response?.success && response?.data?._id) {
        openNotification("success", response.message);
        console.log("response: ", response.data._id);
        setApiFlag(true);
        setIsOpen(false);
        setError("");
      } else {
        openNotification("danger", response.message);
      }
      setFormData({
        title: "",
        expiresAt: "",
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
      if (!formData?.length) {
        setError("Please Select Batches.");
      }

      if (formData?.length) {
        setError("");
        const apiData = {
          assessmentId: selectObject._id,
          title: selectObject.title,
          description: selectObject.description,
          totalMarks: selectObject.totalMarks,
          expiresAt: selectObject.expiresAt,
          batches: formData.map((info) => info._id),
        };

        console.log("formData : ", apiData);

        updateAssessment(apiData);
        // ;
      }
    } catch (error) {
      console.log("");
    }
  };
  return (
    <>
      <Card className={cardClasses}>
        <div
          className={`flex flex-col ${
            variant === "full" ? "md:flex-row md:justify-between" : ""
          }`}
        >
          <div className={`${variant === "full" ? "" : "mb-4"}`}>
            <div className="text-lg font-extrabold mb-2">
              {assessmentData?.title}
            </div>
            <div
              className={`flex flex-col md:flex-row gap-3 justify-between items-center`}
            >
              <div
                className={`${
                  variant === "full"
                    ? "flex flex-row gap-6 items-center"
                    : "flex flex-col mb-4 gap-y-2 "
                } `}
              >
                <div className="flex gap-4 items-center">
                  <div
                    className={`bg-white p-2 rounded-full shadow-md border-2 border-${themeColor}-${primaryColorLevel}`}
                  >
                    <FaQuestionCircle
                      className={`text-xl text-${themeColor}-${primaryColorLevel}`}
                    />
                  </div>
                  <span className="text-base font-semibold">
                    {assessmentData?.totalQuestions} Questions
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  <div
                    className={`bg-white p-2 rounded-full shadow-md border-2 border-${themeColor}-${primaryColorLevel}`}
                  >
                    <FaRegClock
                      className={`text-xl text-${themeColor}-${primaryColorLevel}`}
                    />
                  </div>
                  <span className="text-base font-semibold">
                    {assessmentData?.totalMarks} Marks
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  <div
                    className={`bg-white p-2 rounded-full shadow-md border-2 border-${themeColor}-${primaryColorLevel}`}
                  >
                    <FaCalendarAlt
                      className={`text-xl text-${themeColor}-${primaryColorLevel}`}
                    />
                  </div>
                  <span className="text-base font-semibold">
                    {assessmentData?.expiresAt &&
                      new Date(assessmentData?.expiresAt).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  <div
                    className={`bg-white p-2 rounded-full shadow-md border-2 border-${themeColor}-${primaryColorLevel}`}
                  >
                    <FaUserFriends
                      className={`text-xl text-${themeColor}-${primaryColorLevel}`}
                    />
                  </div>
                  <span className="text-base font-semibold">
                    {assessmentData?.batches?.length} Batches
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`mt-4 md:mt-0 items-center gap-3  ${
              variant === "full"
                ? "flex flex-col justify-center"
                : "flex justify-center md:justify-start"
            }`}
          >
            <Button
              size="sm"
              block={variant !== "full"}
              variant="solid"
              className=" md:w-auto py-2 rounded-lg font-semibold shadow-md mb-2 md:mb-0"
              onClick={() => {
                setSelectObject(assessmentData);
                setFormData(
                  batchList?.length
                    ? batchList.filter((info) =>
                        assessmentData.batches.includes(info.value)
                      )
                    : null
                );
                setIsOpen(true);
              }}
            >
              Assign
            </Button>
            <Button
              size="sm"
              block={variant !== "full"}
              className="md:w-auto py-2 rounded-lg font-semibold shadow-md"
              onClick={() => {
                navigate(`/app/admin/assessment/form/${assessmentData._id}`, {
                  state: assessmentData,
                });
              }}
            >
              View
            </Button>
          </div>
        </div>
      </Card>

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
          setFormData();
        }}
        // onRequestClose={() => {
        //   setIsOpen(false);
        //   setError("");
        //   setFormData();
        // }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Assign Batches Details
          </h5>

          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Batches
            </div>
            <div className="col-span-2">
              <Select
                isMulti
                placeholder="Select Batches"
                // loading={batchLoading}
                onChange={(value) => {
                  setFormData(value);
                }}
                value={formData}
                options={batchList}
                className={error && "select-error"}
              />
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
          <Button variant="solid" onClick={onHandleBox} loading={isLoading}>
            Update
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default AssessmentCard;
