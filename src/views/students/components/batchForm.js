import React, { useEffect, useState } from "react";

import { Input, Button, Switcher, Drawer, Select } from "components/ui";
import axiosInstance from "apiServices/axiosInstance";
import * as Yup from "yup";
import openNotification from "views/common/notification";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";
import { FormNumericInput } from "components/shared";
const instructorsList = [
  { label: "Panthil Malaviya", value: "64e4e6f4b8a3d45b68a2c123" },
  { label: "Alice Johnson", value: "64e4e6f4b8a3d45b68a2c124" },
  { label: "Bob Smith", value: "64e4e6f4b8a3d45b68a2c125" },
  { label: "Charlie Brown", value: "64e4e6f4b8a3d45b68a2c126" },
  { label: "Diana Prince", value: "64e4e6f4b8a3d45b68a2c127" },
];
const courseList = [
  { label: "Introduction to Programming", value: "64e4e6f4b8a3d45b68a2c321" },
  { label: "Advanced JavaScript", value: "64e4e6f4b8a3d45b68a2c322" },
  {
    label: "Data Structures and Algorithms",
    value: "64e4e6f4b8a3d45b68a2c323",
  },
  { label: "Web Development with React", value: "64e4e6f4b8a3d45b68a2c324" },
  { label: "Database Design", value: "64e4e6f4b8a3d45b68a2c325" },
];
const addvalidationSchema = Yup.object().shape({
  batchName: Yup.string()
    .required("Batch name is required")
    .min(3, "Batch name must be at least 1 character long"),

  batchNumber: Yup.string().required("Batch number is required"),
  instructorIds: Yup.array()
    .of(Yup.object())
    .nullable()
    .default([])
    .required("At least one instructor ID is required")
    .min(1, "At least one instructor ID is required"),
  courses: Yup.array()
    .of(Yup.object())
    .nullable()
    .default([])
    .required("At least one course ID is required"),
  // .min(1, "At least one course ID is required"),
});
function BatchForm(props) {
  const { handleCloseClick, batchData, isOpen } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    batchName: "",
    batchNumber: "",
    instructorIds: [],
    courses: [],
    active: true,
  });
  const [errorData, setErrorData] = useState({
    batchName: "",
    batchNumber: "",

    instructorIds: "",
    courses: "",
    active: true,
  });
  const resetErrorData = () => {
    setErrorData({
      batchName: "",
      batchNumber: "",

      instructorIds: "",
      courses: "",
      active: false,
    });
  };
  const resetFormData = () => {
    setFormData({
      batchName: "",
      batchNumber: "",
      instructorIds: [],
      courses: [],
      active: false,
    });
  };
  useEffect(() => {
    if (batchData) {
      setFormData({
        batchName: batchData ? batchData?.batchName : "",
        batchNumber: batchData ? batchData?.batchNumber : "",
        instructorIds:
          batchData && batchData?.instructorIds?.length
            ? batchData?.instructorIds
            : [],
        courses:
          batchData && batchData?.courses?.length ? batchData?.courses : [],
        active: batchData ? batchData.active : true,
      });
    }
  }, [batchData]);

  const addNewBatchMethod = async (value) => {
    try {
      setLoading(true);
      const formData = {
        batchName: value.batchName,
        batchNumber: value.batchNumber,
        collegeId: userData.collegeId,
        instructorIds: value.instructorIds.map((info) => info.value),
        courses: value.courses.map((info) => info.value),
        active: value.active,
      };
      const response = await axiosInstance.post(`user/batch`, formData);
      if (response.success) {
        setLoading(false);
        handleCloseClick();
        resetFormData();
      } else {
        setLoading(false);
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("addNewBatchMethod error : ", error);
      openNotification("danger", error.message);
      setLoading(false);
    }
  };
  const editBatchMethod = async (value, batchId) => {
    try {
      setLoading(true);

      const formData = {
        batchId: batchId,
        batchName: value.batchName,
        batchNumber: value.batchNumber,
        collegeId: userData.collegeId,
        instructorIds: value.instructorIds.map((info) => info.value),
        courses: value.courses.map((info) => info.value),
        active: value.active,
      };
      const response = await axiosInstance.post(`user/batch`, formData);
      if (response.success) {
        setLoading(false);
        handleCloseClick();
        resetFormData();
      } else {
        setLoading(false);
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("editBatchMethod error : ", error);
      openNotification("danger", error.message);
      setLoading(false);
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
      addvalidationSchema.validateSync(formData, { abortEarly: false });
      return {
        batchName: "",
        batchNumber: "",
        instructorIds: "",
        courses: "",
      };
    } catch (error) {
      const errorObject = getErrorMessages(error);
      if (Object.keys(errorObject)?.length === 0) {
        return {
          batchName: "",
          batchNumber: "",
          instructorIds: "",
          courses: "",
        };
      } else {
        return {
          ...errorData,
          status: true,
          batchName: errorObject.batchName ? errorObject.batchName : "",
          batchNumber: errorObject.batchNumber ? errorObject.batchNumber : "",
          instructorIds: errorObject.instructorIds
            ? errorObject.instructorIds
            : "",
          courses: errorObject.courses ? errorObject.courses : "",
        };
      }
    }
  };
  const SubmitHandle = async () => {
    const errorObject = formValidation();
    if (!errorObject.status) {
      resetErrorData();
      if (batchData?.batchId) {
        await editBatchMethod(formData, batchData?.batchId);
      } else {
        await addNewBatchMethod(formData);
      }
    } else {
      setErrorData(errorObject);
    }
  };
  return (
    <>
      <Drawer
        title={
          <div
            className={`text-xl font-semibold text-${themeColor}-${primaryColorLevel}`}
          >
            {batchData ? "Update Batches" : "Add New Batches"}
          </div>
        }
        isOpen={isOpen}
        width={400}
        onClose={() => {
          resetErrorData();
          resetFormData();
          handleCloseClick();
        }}
        onRequestClose={() => {
          resetErrorData();
          resetFormData();
          handleCloseClick();
        }}
        footer={
          <div className="flex w-full justify-between items-center">
            <div>
              {!batchData?.batchId && (
                <Button
                  type="reset"
                  onClick={() => {
                    resetErrorData();
                    resetFormData();
                  }}
                  variant="solid"
                  color="red-500"
                >
                  Reset
                </Button>
              )}
            </div>
            <Button
              className="white-spinner"
              variant="solid"
              onClick={SubmitHandle}
              loading={loading}
            >
              {batchData ? "Update" : "Submit"}
            </Button>
          </div>
        }
        headerClass="items-start bg-gray-100 dark:bg-gray-700"
        footerClass="border-t-2 p-3"
      >
        <div className="text-sm	">
          {/* Batch Name */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Batch Name{" "}
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter Batch Name"
                className={errorData.batchName && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    batchName: e.target.value,
                  });
                }}
                value={formData?.batchName}
              />
            </div>
            {DisplayError(errorData.batchName)}
          </div>
          {/* Batch Number */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Batch Number
            </div>
            <div className="col-span-2">
              <FormNumericInput
                onKeyDown={(evt) =>
                  ["e", "E", "+", "-"]?.includes(evt.key) &&
                  evt.preventDefault()
                }
                placeholder="Please Enter Batch Number"
                className={
                  errorData.batchNumber
                    ? "select-error capitalize"
                    : "capitalize"
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    batchNumber: e.target.value,
                  });
                }}
                value={formData?.batchNumber}
              />
            </div>
            {DisplayError(errorData.batchName)}
          </div>

          {/* Select Instructors */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Select Instructors
            </div>
            <div className="col-span-2">
              <Select
                isMulti
                className={errorData?.instructorIds && "select-error"}
                options={instructorsList}
                // loading={trainerloading}
                placeholder="Please Select Instructors"
                value={formData?.instructorIds}
                onChange={(value) => {
                  setFormData({
                    ...formData,
                    instructorIds: value,
                  });
                }}
              />
            </div>
            {DisplayError(errorData.instructorIds)}
          </div>
          {/* Select Courses */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Select Courses
            </div>
            <div className="col-span-2">
              <Select
                isMulti
                className={errorData?.courses && "select-error"}
                options={courseList}
                // loading={trainerloading}
                placeholder="Please Select Courses"
                value={formData?.courses}
                onChange={(value) => {
                  setFormData({
                    ...formData,
                    courses: value,
                  });
                }}
              />
            </div>
            {DisplayError(errorData.courses)}
          </div>

          {/* Batches Active */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Batches Status
            </div>
            <div className="col-span-2">
              <Switcher
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    active: !e,
                  });
                }}
                checked={formData?.active}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default BatchForm;
