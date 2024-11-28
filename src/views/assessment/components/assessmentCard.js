import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import {
  FaQuestionCircle,
  FaRegClock,
  FaUserFriends,
} from "react-icons/fa";
import {
  Button,
  Card,
  DatePicker,
  Dialog,
  Select,
} from "components/ui";
import { useNavigate } from "react-router-dom";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import DisplayError from "views/common/displayError";

const AssessmentCard = ({ variant = "full", assessmentData, setApiFlag }) => {
  const navigate = useNavigate();

  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  const assignAssessmentValidationSchema = Yup.object().shape({
    collegeId: Yup.string().required("College Id is required"),
    batchId: Yup.string().required("Batch Id is required"),
    assessmentId: Yup.string().required("AssessmentId Id is required"),
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date()
      .required("End Date is required")
      .min(Yup.ref("startDate")),
  });
  const cardClasses = ` border-2 border-${themeColor}-${primaryColorLevel} text-${themeColor}-${primaryColorLevel} rounded-xl shadow-lg ${
    variant === "full" ? "w-full" : "w-56"
  }`;
  const { userData } = useSelector((state) => state.auth.user);

  const [batchLoading, setBatchLoading] = useState(false);
  const [batchList, setBatchList] = useState([]);
  const [IsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    collegeId: assessmentData.collegeId,
    batchId: "",
    assessmentId: assessmentData._id,
    startDate: null,
    endDate: null,
  });
  const [errorData, setErrorData] = useState({
    collegeId: "",
    batchId: "",
    assessmentId: "",
    startDate: null,
    endDate: null,
  });
  const resetErrorData = () => {
    setErrorData({
      collegeId: "",
      batchId: "",
      assessmentId: "",
      startDate: null,
      endDate: null,
    });
  };
  const resetFormData = () => {
    setFormData({
      collegeId: assessmentData.collegeId,
      batchId: "",
      assessmentId: assessmentData._id,
      startDate: null,
      endDate: null,
    });
  };
  const getBatchOptionData = async (collegeId = "") => {
    try {
      setBatchLoading(true);
      const response = collegeId
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

  const getErrorMessages = ({ path, message, inner }) => {
    if (inner && inner?.length) {
      return inner.reduce((acc, { path, message }) => {
        acc[path] = message;
        return acc;
      }, {});
    }
    return { [path]: message };
  };
  const formValidation = () => {
    try {
      assignAssessmentValidationSchema.validateSync(formData, {
        abortEarly: false,
      });
      return {
        collegeId: "",
        batchId: "",
        assessmentId: "",
        startDate: null,
        endDate: null,
      };
    } catch (error) {
      const errorObject = getErrorMessages(error);
      if (Object.keys(errorObject)?.length === 0) {
        return {
          courseId: "",
          collegeId: "",
          assessmentId: "",
          batchId: "",
        };
      } else {
        return {
          ...errorData,
          status: true,
          collegeId: errorObject.collegeId ? errorObject.collegeId : "",
          batchId: errorObject.batchId ? errorObject.batchId : "",
          assessmentId: errorObject?.assessmentId
            ? errorObject?.assessmentId
            : "",
          startDate: errorObject?.startDate ? errorObject?.startDate : null,
          endDate: errorObject?.endDate ? errorObject?.endDate : null,
        };
      }
    }
  };
  useEffect(() => {
    if (!IsOpen) {
      setIsOpen(false);
      setFormData();
    }
  }, [IsOpen]);
  const addNewAssignAssessmentBatchMethod = async (value) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `user/assign-batch-assessment`,
        value
      );
      if (response.success) {
        setIsLoading(false);
        resetErrorData();
        resetFormData();
        setApiFlag(true);
        setIsOpen(false);
      } else {
        setIsLoading(false);
        openNotification("danger", response.message);
      }
    } catch (error) {
      openNotification("danger", error.message);
      setIsLoading(false);
    }
  };
  const SubmitHandle = async () => {
    const errorObject = formValidation();
    if (!errorObject.status) {
      resetErrorData();
      await addNewAssignAssessmentBatchMethod(formData);
    } else {
      setErrorData(errorObject);
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
                setFormData({
                  ...formData,
                  collegeId: assessmentData?.collegeId,
                  assessmentId: assessmentData?._id,
                });
                getBatchOptionData(assessmentData.collegeId);
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
        
        contentClassName="pb-0 px-0"
        onClose={() => {
          setIsOpen(false);
        }}
        onRequestClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Assign Assessment
          </h5>
          {/* batchId */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Select Batch
            </div>
            <div className="col-span-2">
              <Select
                placeholder="Please Select Batch"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    batchId: e.value,
                  });
                }}
                loading={batchLoading}
                value={batchList?.find(
                  (info) => info.value === formData?.batchId
                )}
                options={batchList}
                className={errorData.batchId && "select-error"}
              />
            </div>
            {DisplayError(errorData.batchId)}
          </div>
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Select Start Date
            </div>
            <div className="col-span-2">
              <DatePicker
                placeholder="Please Select Start Date of the assessment"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    startDate: new Date(e),
                  });
                }}
                value={formData?.startDate}
              />
            </div>
            {DisplayError(errorData.startDate)}
          </div>
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Select End Date
            </div>
            <div className="col-span-2">
              <DatePicker
                placeholder="Please Select Start Date of the assessment"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    endDate: new Date(e),
                  });
                }}
                minDate={formData?.startDate}
                value={formData?.endDate}
              />
            </div>
            {DisplayError(errorData.endDate)}
          </div>
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>

          <Button variant="solid" onClick={SubmitHandle} loading={isLoading}>
            Save
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default AssessmentCard;
