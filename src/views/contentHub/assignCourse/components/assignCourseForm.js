/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, DatePicker, Drawer, Select } from "components/ui";
import axiosInstance from "apiServices/axiosInstance";
import * as Yup from "yup";
import openNotification from "views/common/notification";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";
import { SUPERADMIN } from "constants/roles.constant";

function AssignCourseForm(props) {
  const { handleCloseClick, assignCourseData, isOpen } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);
  const assignCourseValidationSchema = Yup.object().shape({
    courseId: Yup.string().required("Course Id is required"),
    collegeId: Yup.string().required("College Id is required"),
    batchId: Yup.string().required("Batch Id is required"),
    startTime: Yup.date().required("start Date is required"),

    endTime: Yup.date()
      .required("End Date is required")
      .min(Yup.ref("startTime"))
  });
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchList, setBatchList] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesList, setCoursesList] = useState([]);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeList, setCollegeList] = useState([]);
  const [formData, setFormData] = useState({
    courseId: "",
    collegeId:
      userData?.authority.toString() === SUPERADMIN ? null : userData.collegeId,
    batchId: "",
    startTime: new Date(),
    endTime: new Date()
  });
  const [errorData, setErrorData] = useState({
    courseId: "",
    collegeId: "",
    batchId: "",
    startTime: null,
    endTime: null
  });
  const resetErrorData = () => {
    setErrorData({
      courseId: "",
      collegeId: "",
      batchId: "",
      startTime: null,
      endTime: null
    });
  };
  const resetFormData = () => {
    setFormData({
      courseId: "",
      batchId: "",
      startTime: null,
      endTime: null,
      collegeId:
        userData?.authority.toString() === SUPERADMIN
          ? null
          : userData.collegeId
    });
  };
  useEffect(() => {
    if (isOpen) {
      if (userData.authority.toString() === SUPERADMIN) {
        getCollegeOptionData();
      }
    }
  }, [isOpen]);
  useEffect(() => {
    if (assignCourseData?._id) {
      setFormData({
        courseId: assignCourseData?.courseId ? assignCourseData?.courseId : "",
        batchId: assignCourseData?.batchId ? assignCourseData?.batchId : "",
        startTime: assignCourseData?.startTime
          ? assignCourseData?.startTime
          : null,
        endTime: assignCourseData?.endTime ? assignCourseData?.endTime : null,
        collegeId:
          userData?.authority.toString() === SUPERADMIN
            ? assignCourseData?.collegeId
              ? assignCourseData?.collegeId
              : ""
            : userData.collegeId
      });
    }
  }, [assignCourseData]);
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
  useEffect(() => {
    if (userData.authority.toString() !== SUPERADMIN && userData.collegeId) {
      getBatchOptionData();
      getCoursesOptionData(userData.collegeId);
    } else {
      getCollegeOptionData();
    }
  }, []);
  const getCoursesOptionData = async (collegeId = "") => {
    try {
      setCoursesLoading(true);
      const response = await axiosInstance.get(
        `user/college-wise-courses-options/${collegeId}`
      );
      // const response =
      //   userData.authority.toString() === SUPERADMIN && collegeId
      //     ? await axiosInstance.get(
      //         `admin/college-wise-courses-options/${collegeId}`
      //       )
      //     : await axiosInstance.get(`user/college-wise-courses-options`);

      if (response.success) {
        setCoursesList(response.data.filter((e) => e.value !== "all"));
      } else {
        openNotification("danger", response.error);
      }
    } catch (error) {
      console.log("getCoursesOptionData error :", error.message);
      openNotification("danger", error.message);
    } finally {
      setCoursesLoading(false);
    }
  };
  const addNewAssignCourseMethod = async (value) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`user/assign-course`, value);
      if (response.success) {
        setLoading(false);
        resetErrorData();
        resetFormData();
        handleCloseClick();
      } else {
        setLoading(false);
        openNotification("danger", response.message);
      }
    } catch (error) {
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
      assignCourseValidationSchema.validateSync(formData, {
        abortEarly: false
      });
      return {
        courseId: "",
        collegeId: "",
        batchId: "",
        startTime: null,
        endTime: null
      };
    } catch (error) {
      const errorObject = getErrorMessages(error);
      if (Object.keys(errorObject)?.length === 0) {
        return {
          courseId: "",
          collegeId: "",
          batchId: "",
          startTime: null,
          endTime: null
        };
      } else {
        return {
          ...errorData,
          status: true,
          courseId: errorObject.courseId ? errorObject.courseId : "",
          collegeId: errorObject.collegeId ? errorObject.collegeId : "",
          batchId: errorObject.batchId ? errorObject.batchId : "",
          startTime: errorObject.startTime ? errorObject.startTime : null,
          endTime: errorObject.endTime ? errorObject.endTime : null
        };
      }
    }
  };
  const SubmitHandle = async () => {
    const errorObject = formValidation();
    console.log("errorObject :", errorObject)
    if (!errorObject.status) {
      resetErrorData();
      console.log("Please enter")
      if (assignCourseData?._id) {
        console.log("edit Assign Course")
        // const newFormData = { ...formData };
        // await editAssignCourseMethod(newFormData, assignCourseData?._id);
      } else {
        await addNewAssignCourseMethod(formData);
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
            {assignCourseData
              ? "Update Assign Course"
              : "Add New Assign Course"}
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
              {!assignCourseData?._id && (
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
              {assignCourseData ? "Update" : "Submit"}
            </Button>
          </div>
        }
        headerClass="items-start bg-gray-100 dark:bg-gray-700"
        footerClass="border-t-2 p-3"
      >
        <div className="text-sm">
          {userData?.authority.toString() === SUPERADMIN.toString() ? (
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
                        collegeId: e.value
                      });
                      getBatchOptionData(e.value);
                      getCoursesOptionData(e.value);
                    }}
                    value={collegeList.find(
                      (info) => info.value === formData?.collegeId
                    )}
                    options={collegeList}
                    className={errorData.collegeId && "select-error"}
                  />
                </div>
                {DisplayError(errorData.collegeId)}
              </div>
            </>
          ) : (
            <></>
          )}
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
                loading={batchLoading}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    batchId: e.value
                  });
                }}
                value={batchList?.find(
                  (info) => info.value === formData?.batchId
                )}
                options={batchList}
                className={errorData.batchId && "select-error"}
              />
            </div>
            {DisplayError(errorData.batchId)}
          </div>
          {/* courseId */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Select Courses
            </div>
            <div className="col-span-2">
              <Select
                placeholder="Please Select Courses"
                loading={coursesLoading}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    courseId: e.value
                  });
                }}
                value={coursesList?.find(
                  (info) => info.value === formData?.courseId
                )}
                options={coursesList}
                className={errorData.courseId && "select-error"}
              />
            </div>
            {DisplayError(errorData.courseId)}
          </div>
          {/* startDate */}
          <div className="col-span-1 gap-4 mb-4 hidden">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Start Date & Time
            </div>
            <div className="col-span-2">
              <DatePicker.DateTimepicker
                placeholder="Please Select a Start Date"
                className={errorData.startTime && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    startTime: e
                  });
                }}
                value={formData?.startTime}
              />
            </div>
            {DisplayError(errorData.startTime)}
          </div>
          {/* endDate */}
          <div className="col-span-1 gap-4 mb-4 hidden">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              End Date & Time
            </div>
            <div className="col-span-2">
              <DatePicker.DateTimepicker
                placeholder="Please Select a End Date"
                className={errorData.endTime && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    endTime: e
                  });
                }}
                minDate={formData?.startTime}
                value={formData?.endTime}
              />
            </div>
            {DisplayError(errorData.endTime)}
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default AssignCourseForm;
