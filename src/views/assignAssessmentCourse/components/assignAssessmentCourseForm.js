import React, { useEffect, useState } from "react";
import { Button, DatePicker, Drawer, Select } from "components/ui";
import axiosInstance from "apiServices/axiosInstance";
import * as Yup from "yup";
import openNotification from "views/common/notification";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";
import { SUPERADMIN } from "constants/roles.constant";
import dayjs from "dayjs";
const positionTypeOption = [
  { label: "Preliminary Assessment", value: "pre" },
  { label: "Section-Based Assessment", value: "section" },
  { label: "Grand Test Assessment ", value: "grand" },
];
function AssignCourseForm(props) {
  const {
    handleCloseClick,
    assignCourseData,
    isOpen,
    AssignType = "course",
  } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);
  const assignAssessmentValidationSchema = Yup.object().shape({
    collegeId: Yup.string().required("College Id is required"),
    batchId: Yup.string().required("Batch Id is required"),
    courseId: Yup.string().required("Course Id is required"),
    assessmentId: Yup.string().required("AssessmentId Id is required"),
    positionType: Yup.string().required("Position Type is required"),
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date()
      .required("End Date is required")
      .min(Yup.ref("startDate")),
  });
  const assignAssessmentBatchValidationSchema = Yup.object().shape({
    collegeId: Yup.string().required("College Id is required"),
    batchId: Yup.string().required("Batch Id is required"),
    assessmentId: Yup.string().required("AssessmentId Id is required"),
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date()
      .required("End Date is required")
      .min(Yup.ref("startDate")),
  });

  const [loading, setLoading] = useState(false);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeList, setCollegeList] = useState([]);

  const [batchLoading, setBatchLoading] = useState(false);
  const [batchList, setBatchList] = useState([]);

  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesList, setCoursesList] = useState([]);

  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [sectionsList, setSectionsList] = useState([]);

  const [lecturesLoading, setLecturesLoading] = useState(false);
  const [lecturesList, setLecturesList] = useState([]);

  const [assessmentLoading, setAssessmentsLoading] = useState(false);
  const [assessmentList, setAssessmentsList] = useState([]);

  const [formData, setFormData] = useState({
    collegeId:
      userData?.authority.toString() === SUPERADMIN ? "" : userData.collegeId,
    batchId: "",
    courseId: "",
    sectionId: "",
    lectureId: "",
    assessmentId: "",
    positionType: "",
    startDate: null,
    endDate: null,
  });
  const [errorData, setErrorData] = useState({
    collegeId: "",
    batchId: "",
    courseId: "",
    sectionId: "",
    lectureId: "",
    assessmentId: "",
    positionType: "",
    startDate: null,
    endDate: null,
  });
  const resetErrorData = () => {
    setErrorData({
      collegeId: "",
      batchId: "",
      courseId: "",
      sectionId: "",
      lectureId: "",
      assessmentId: "",
      positionType: "",
      startDate: null,
      endDate: null,
    });
  };
  const resetFormData = () => {
    setFormData({
      collegeId:
        userData?.authority.toString() === SUPERADMIN ? "" : userData.collegeId,
      collegeId: "",
      batchId: "",
      courseId: "",
      sectionId: "",
      lectureId: "",
      assessmentId: "",
      positionType: "",
      startDate: null,
      endDate: null,
    });
  };
  useEffect(() => {
    if (isOpen) {
     
      if (userData.authority[0].toString() === SUPERADMIN) {
        getCollegeOptionData();
      }
    }
    if (
      userData?.authority.toString() === SUPERADMIN ? "" : userData.collegeId
    ) {
      setFormData({ ...formData, collegeId: userData.collegeId });
    }
  }, [isOpen]);
  useEffect(() => {
    if (isOpen) {
      if (assignCourseData?._id) {
        setFormData({
          collegeId:
            userData?.authority.toString() === SUPERADMIN
              ? assignCourseData?.collegeId
                ? assignCourseData?.collegeId
                : ""
              : userData.collegeId,
          courseId: assignCourseData?.courseId?._id
            ? assignCourseData?.courseId?._id
            : "",
          batchId: assignCourseData?.batchId?._id
            ? assignCourseData?.batchId?._id
            : "",
          sectionId: assignCourseData?.sectionId?._id
            ? assignCourseData?.sectionId?._id
            : "",
          lectureId: assignCourseData?.lectureId?._id
            ? assignCourseData?.lectureId?._id
            : "",
          assessmentId: assignCourseData?.assessmentId?._id
            ? assignCourseData?.assessmentId?._id
            : "",
          positionType: assignCourseData?.positionType
            ? assignCourseData?.positionType
            : "",
          startDate: assignCourseData?.startDate
            ? new Date(assignCourseData?.startDate)
            : null,
          endDate: assignCourseData?.endDate
            ? new Date(assignCourseData?.endDate)
            : null,
        });
      }
      if (assignCourseData?.collegeId) {
        getBatchOptionData(assignCourseData?.collegeId);
        getAssessmentOptionData(assignCourseData?.collegeId);
      }
      if (assignCourseData?.batchId?._id) {
        getCoursesOptionData(assignCourseData?.batchId?._id);
      }
      if (assignCourseData?.courseId?._id) {
        getSectionOptionData(assignCourseData?.courseId?._id);
      }
      if (assignCourseData?.sectionId?._id) {
        getLectureOptionData(assignCourseData?.sectionId?._id);
      }
    }
  }, [assignCourseData, isOpen]);
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
  const getCoursesOptionData = async (batchId = "") => {
    try {
      setCoursesLoading(true);
      const response = await axiosInstance.get(
        `user/course-option-by-batch/${batchId}`
      );
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
  const getSectionOptionData = async (courseId = "") => {
    try {
      setSectionsLoading(true);
      const response = await axiosInstance.get(
        `user/courses-wise-section-options/${courseId}`
      );
      if (response.success) {
        setSectionsList(response.data.filter((e) => e.value !== "all"));
      } else {
        openNotification("danger", response.error);
      }
    } catch (error) {
      console.log("getSectionOptionData error :", error.message);
      openNotification("danger", error.message);
    } finally {
      setSectionsLoading(false);
    }
  };
  const getLectureOptionData = async (sectionId = "") => {
    try {
      setLecturesLoading(true);
      const response = await axiosInstance.get(
        `user/section-wise-lecture-options/${sectionId}`
      );
      if (response.success) {
        setLecturesList(response.data.filter((e) => e.value !== "all"));
      } else {
        openNotification("danger", response.error);
      }
    } catch (error) {
      console.log("getLectureOptionData error :", error.message);
      openNotification("danger", error.message);
    } finally {
      setLecturesLoading(false);
    }
  };
  const getAssessmentOptionData = async (collegeId = "") => {
    try {
      setAssessmentsLoading(true);
      const response = await axiosInstance.get(
        `user/assessment-option-by-college/${collegeId}`
      );
      if (response.success) {
        setAssessmentsList(response.data.filter((e) => e.value !== "all"));
      } else {
        openNotification("danger", response.error);
      }
    } catch (error) {
      console.log("getAssessmentOptionData error :", error.message);
      openNotification("danger", error.message);
    } finally {
      setAssessmentsLoading(false);
    }
  };
  const addNewAssignAssessmentCourseMethod = async (value) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `user/assign-course-assessment`,
        value
      );
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
  const editAssignAssessmentCourseMethod = async (
    value,
    assignAssessmentId
  ) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `user/assign-assessment/${assignAssessmentId}`,
        value
      );
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
      if (assignCourseData?.type === "batch") {
        assignAssessmentBatchValidationSchema.validateSync(formData, {
          abortEarly: false,
        });
      } else {
        assignAssessmentValidationSchema.validateSync(formData, {
          abortEarly: false,
        });
      }

      return {
        collegeId: "",
        batchId: "",
        courseId: "",
        sectionId: "",
        lectureId: "",
        assessmentId: "",
        positionType: "",
        startDate: null,
        endDate: null,
      };
    } catch (error) {
      const errorObject = getErrorMessages(error);
      if (Object.keys(errorObject)?.length === 0) {
        return {
          courseId: "",
          collegeId: "",
          batchId: "",
        };
      } else {
        return {
          ...errorData,
          status: true,
          courseId: errorObject.courseId ? errorObject.courseId : "",
          collegeId: errorObject.collegeId ? errorObject.collegeId : "",
          batchId: errorObject.batchId ? errorObject.batchId : "",
          sectionId: errorObject?.sectionId ? errorObject?.sectionId : "",
          lectureId: errorObject?.lectureId ? errorObject?.lectureId : "",
          assessmentId: errorObject?.assessmentId
            ? errorObject?.assessmentId
            : "",
          positionType: errorObject?.positionType
            ? errorObject?.positionType
            : "",
          startDate: errorObject?.startDate ? errorObject?.startDate : null,
          endDate: errorObject?.endDate ? errorObject?.endDate : null,
        };
      }
    }
  };
  const SubmitHandle = async () => {
    const errorObject = formValidation();
   
    if (!errorObject.status) {
      resetErrorData();
      if (assignCourseData?._id) {
        const newFormData = { ...formData };
        await editAssignAssessmentCourseMethod(
          newFormData,
          assignCourseData?._id
        );
      } else {
        await addNewAssignAssessmentCourseMethod(formData);
      }
    } else {
      setErrorData(errorObject);
    }
  };
  useEffect(() => {
    if (userData.authority.toString() !== SUPERADMIN) {
      getBatchOptionData();
      getAssessmentOptionData(userData.collegeId);
    } else {
      getCollegeOptionData();
    }
  }, []);
  return (
    <>
      <Drawer
        title={
          <div
            className={`text-xl font-semibold text-${themeColor}-${primaryColorLevel}`}
          >
            {assignCourseData
              ? "Update Assign Assessment"
              : "Add Assign Assessment"}
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
                        collegeId: e.value,
                      });
                      getBatchOptionData(e.value);

                      getAssessmentOptionData(e.value);
                    }}
                    value={
                      formData?.collegeId &&
                      collegeList.find(
                        (info) => info.value === formData?.collegeId
                      )
                    }
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
                    batchId: e.value,
                  });
                  getCoursesOptionData(e.value);
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
          {/* Assessment */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Select Assessment
            </div>
            <div className="col-span-2">
              <Select
                placeholder="Please Select Assessment"
                loading={assessmentLoading}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    assessmentId: e.value,
                  });
                }}
                value={assessmentList?.find(
                  (info) => info.value === formData?.assessmentId
                )}
                options={assessmentList}
                className={errorData.assessmentId && "select-error"}
              />
            </div>
            {DisplayError(errorData.courseId)}
          </div>
          {assignCourseData?.type === "batch" ? (
            <></>
          ) : (
            <>
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
                        courseId: e.value,
                      });
                      getSectionOptionData(e.value);
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
              {/* positionType */}
              <div className="col-span-1 gap-4 mb-4">
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  Select position of the assessment
                </div>
                <div className="col-span-2">
                  <Select
                    placeholder="Please Select position of the assessment"
                    loading={assessmentLoading}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        positionType: e.value,
                      });
                    }}
                    value={positionTypeOption?.find(
                      (info) => info.value === formData?.positionType
                    )}
                    options={positionTypeOption}
                    className={errorData.positionType && "select-error"}
                  />
                </div>
                {DisplayError(errorData.positionType)}
              </div>
            </>
          )}

          {formData && formData.positionType === "section" ? (
            <>
              {" "}
              {/* sectionId */}
              <div className="col-span-1 gap-4 mb-4">
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  Select Section
                </div>
                <div className="col-span-2">
                  <Select
                    placeholder="Please Select Section"
                    loading={sectionsLoading}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        sectionId: e.value,
                      });
                      getLectureOptionData(e.value);
                    }}
                    value={sectionsList?.find(
                      (info) => info.value === formData?.sectionId
                    )}
                    options={sectionsList}
                    className={errorData.sectionId && "select-error"}
                  />
                </div>
                {DisplayError(errorData.sectionId)}
              </div>
              {/* lectureId */}
              <div className="col-span-1 gap-4 mb-4">
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  Select Lecture
                </div>
                <div className="col-span-2">
                  <Select
                    placeholder="Please Select Lecture"
                    loading={lecturesLoading}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        lectureId: e.value,
                      });
                    }}
                    value={lecturesList?.find(
                      (info) => info.value === formData?.lectureId
                    )}
                    options={lecturesList}
                    className={errorData.lectureId && "select-error"}
                  />
                </div>
                {DisplayError(errorData.lectureId)}
              </div>
            </>
          ) : (
            <></>
          )}
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
      </Drawer>
    </>
  );
}

export default AssignCourseForm;
