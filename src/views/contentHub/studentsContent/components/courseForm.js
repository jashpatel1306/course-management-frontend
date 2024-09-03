import React, { useEffect, useState } from "react";

import { Input, Button, Switcher, Drawer, Select, Upload } from "components/ui";
import axiosInstance from "apiServices/axiosInstance";
import * as Yup from "yup";
import openNotification from "views/common/notification";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";
import { SUPERADMIN } from "constants/roles.constant";
import { FcImageFile } from "react-icons/fc";
import { HiTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const addValidationSchema = Yup.object().shape({
  courseName: Yup.string()
    .required("Course name is required")
    .min(3, "Course name must be at least 3 character long"),

  collegeId: Yup.string().required("College Id is required"),
  courseDescription: Yup.string()
    .required("Course description is required")
    .min(3, "Course description must be at least 3 character long"),
  coverImage: Yup.mixed().required("Cover Image Required"),
});
function CourseForm(props) {
  const { handleCloseClick, courseData, isOpen, collegeId } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeList, setCollegeList] = useState([]);
  const [formData, setFormData] = useState({
    courseName: "",
    collegeId: "",
    courseDescription: "",
    coverImage: null,
    active: true,
  });
  const resetFormData = () => {
    setFormData({
      courseName: "",
      collegeId: "",
      courseDescription: "",
      coverImage: null,
      active: true,
    });
  };
  const [errorData, setErrorData] = useState({
    courseName: "",
    collegeId: "",
    courseDescription: "",
    coverImage: "",
    active: true,
  });
  const resetErrorData = () => {
    setErrorData({
      courseName: "",
      collegeId: "",
      courseDescription: "",
      coverImage: "",
      active: true,
    });
  };
  const beforeUpload = (files) => {
    let valid = true;

    const allowedFileType = [
      "image/svg",
      "image/svg+xml",
      "image/png",
      "image/x-citrix-png",
      "image/x-png",
      "image/jpeg",
      "image/x-citrix-jpeg",
      "image/bmp",
      "image/webp",
    ];
    const maxFileSize = 5000000;
    for (let file of files) {
      if (!allowedFileType.includes(file.type)) {
        setErrorData({
          ...errorData,
          coverImage: "Please upload a .jpeg or .png file!",
        });
        valid = false;
      }
      if (file.size >= maxFileSize) {
        setErrorData({
          ...errorData,
          coverImage: "Upload image cannot more then 5MB!",
        });
        valid = false;
      }
    }
    if (valid) {
      setErrorData({ ...errorData, coverImage: "" });
    }
    return valid;
  };
  useEffect(() => {
    if (courseData) {
      setFormData({
        courseName: courseData ? courseData?.courseName : "",
        collegeId: courseData ? courseData?.collegeId : "",
        courseDescription: courseData ? courseData?.courseDescription : "",
        active: courseData ? courseData.active : true,
      });
    }
  }, [courseData]);
  useEffect(() => {
    if (isOpen) {
      if (userData.authority.toString() === SUPERADMIN) {
        getCollegeOptionData();
      }
    }
  }, [isOpen]);
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
  const addNewCourseMethod = async (value) => {
    try {
      setLoading(true);
      const formData = {
        courseName: value.courseName,
        collegeId: collegeId ? collegeId : userData.collegeId,
        courseDescription: value.courseDescription,
        active: value.active,
      };
      const response = await axiosInstance.post(`user/course`, formData);
      if (response.success) {
        setLoading(false);
        handleCloseClick();
        resetFormData();
      } else {
        setLoading(false);
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("addNewCourseMethod error : ", error);
      openNotification("danger", error.message);
      setLoading(false);
    }
  };
  const editCourseMethod = async (value, courseId) => {
    try {
      setLoading(true);

      const formData = {
        courseId: courseId,
        courseName: value.courseName,
        collegeId: collegeId ? collegeId : userData.collegeId,
        courseDescription: value.courseDescription,
        active: value.active,
      };
      const response = await axiosInstance.put(
        `user/course/${formData.courseId}`,
        formData
      );
      if (response.success) {
        setLoading(false);
        handleCloseClick();
        resetFormData();
      } else {
        setLoading(false);
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("editCourseMethod error : ", error);
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
      addValidationSchema.validateSync(formData, { abortEarly: false });
      return {
        courseName: "",
        collegeId: "",
        courseDescription: "",
        coverImage: "",
      };
    } catch (error) {
      const errorObject = getErrorMessages(error);
      console.log("errorObject : ", errorObject);
      if (Object.keys(errorObject)?.length === 0) {
        return {
          courseName: "",
          collegeId: "",
          courseDescription: "",
          coverImage: "",
        };
      } else {
        return {
          ...errorData,
          status: true,
          courseName: errorObject.courseName ? errorObject.courseName : "",
          collegeId: errorObject.collegeId ? errorObject.collegeId : "",
          courseDescription: errorObject.courseDescription
            ? errorObject.courseDescription
            : "",
          coverImage: errorObject.coverImage ? errorObject.coverImage : "",
        };
      }
    }
  };
  const SubmitHandle = async () => {
    const errorObject = formValidation();
    if (!errorObject.status) {
      resetErrorData();
      navigate("/app/admin/content-hub/students/course-forms/1234567890");
      //   if (courseData?.courseId) {
      //     await editCourseMethod(formData, courseData?.courseId);
      //   } else {
      //     await addNewCourseMethod(formData);
      //   }
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
            {courseData ? "Update Course" : "Add New Course"}
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
              {!courseData?.courseId && (
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
              {courseData ? "Update" : "Submit"}
            </Button>
          </div>
        }
        headerClass="items-start bg-gray-100 dark:bg-gray-700"
        footerClass="border-t-2 p-3"
      >
        <div className="text-sm	">
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Cover Image
            </div>

            {coverImageUrl ? (
              <>
                <div className="flex flex-wrap items-center justify-start mb-4">
                  <div className="group relative p-2 rounded flex h-32 ">
                    <img
                      className="h-32 w-full rounded"
                      src={coverImageUrl}
                      alt={coverImageUrl}
                    />
                    <div className="h-32 w-full rounded absolute inset-2 bg-gray-900/[.7] group-hover:flex hidden text-xl items-center justify-center">
                      <span
                        onClick={() => {
                          setFormData({ ...formData, coverImage: null });
                          setCoverImageUrl("");
                        }}
                        className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                      >
                        <HiTrash />
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-full">
                  <Upload
                    draggable
                    showList={false}
                    label="Image"
                    beforeUpload={beforeUpload}
                    onChange={(file) => {
                      setFormData({ ...formData, coverImage: file[0] });
                      setCoverImageUrl(URL.createObjectURL(file[0]));
                    }}
                  >
                    <div className="my-8 text-center">
                      <div className="text-6xl w-full mb-4 flex justify-center">
                        <FcImageFile />
                      </div>
                      <p className="font-semibold">
                        <span className="text-gray-800 dark:text-white">
                          Drop your image here, or{" "}
                        </span>
                        <span
                          className={`font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
                        >
                          browse
                        </span>
                      </p>
                      <p className="mt-1 opacity-60 dark:text-white">
                        Support: jpeg, png,svg
                      </p>
                    </div>
                  </Upload>
                </div>
              </>
            )}
            {DisplayError(errorData.coverImage)}
          </div>
          {userData?.authority.toString() === SUPERADMIN.toString() ? (
            <>
              {/*  College Name */}
              <div className="col-span-1 gap-4 mb-4">
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  College Name
                </div>
                <div className="col-span-2">
                  <Select
                    placeholder="Select College"
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
                    className={errorData.collegeId && "select-error"}
                  />
                </div>
                {DisplayError(errorData.collegeId)}
              </div>
            </>
          ) : (
            <></>
          )}
          {/* Course Name */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Course Name{" "}
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter Course Name"
                className={errorData.courseName && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    courseName: e.target.value,
                  });
                }}
                value={formData?.courseName}
              />
            </div>
            {DisplayError(errorData.courseName)}
          </div>
          {/* Course Description */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Course Description
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                textArea
                placeholder="Please Enter Course Description"
                className={errorData.courseDescription && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    courseDescription: e.target.value,
                  });
                }}
                value={formData?.courseDescription}
              />
            </div>
            {DisplayError(errorData.courseDescription)}
          </div>
          {/* Courses Active */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Course Status
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

export default CourseForm;
