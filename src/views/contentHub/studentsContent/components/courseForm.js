import React, { useEffect, useState } from "react";

import { Input, Button, Switcher, Drawer, Upload } from "components/ui";
import axiosInstance from "apiServices/axiosInstance";
import * as Yup from "yup";
import openNotification from "views/common/notification";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";
import { SUPERADMIN } from "constants/roles.constant";
import { FcImageFile } from "react-icons/fc";
import { HiTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function CourseForm(props) {
  const { handleCloseClick, courseData, isOpen, collegeId, setCourseData } =
    props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth.user);

  const addValidationSchema = Yup.object().shape({
    courseName: Yup.string()
      .required("Course name is required")
      .min(3, "Course name must be at least 3 character long"),
    courseDescription: Yup.string()
      .required("Course description is required")
      .min(3, "Course description must be at least 3 character long"),
    coverImage: Yup.mixed(),
  });
  const [loading, setLoading] = useState(false);

  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [formData, setFormData] = useState({
    courseName: "",
    collegeId: "",
    courseDescription: "",
    coverImage: null,
    isPublish: false,
  });
  const resetFormData = () => {
    setFormData({
      courseName: "",
      collegeId: "",
      courseDescription: "",
      coverImage: null,
      isPublish: false,
    });
    setCoverImageUrl("");
  };
  const [errorData, setErrorData] = useState({
    courseName: "",
    collegeId: "",
    courseDescription: "",
    coverImage: "",
    isPublish: false,
  });
  const resetErrorData = () => {
    setErrorData({
      courseName: "",
      collegeId: "",
      courseDescription: "",
      coverImage: "",
      isPublish: false,
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
        isPublish: courseData ? courseData.isPublish : false,
        coverImage: null,
      });
      if (courseData.coverImage) {
        setCoverImageUrl(courseData.coverImage);
      } else {
        setCoverImageUrl("");
      }
    }
  }, [courseData]);
  const addNewCourseMethod = async (value) => {
    try {
      setLoading(true);
      const formData = {
        courseName: value.courseName,
        // collegeId: collegeId ? collegeId : userData.collegeId,
        courseDescription: value.courseDescription,

        isPublish: value.isPublish,
      };
      if (value.coverImage) {
        formData.image = value.coverImage;
      }
      if (userData?.authority.toString() !== SUPERADMIN) {
        formData.collegeId = collegeId ? collegeId : userData.collegeId;
      }
      const response = await axiosInstance.post(`user/course`, formData);
      if (response.success && response.data._id) {
        setLoading(false);
        setCourseData(response.data);
        navigate(
          `/app/admin/content-hub/students/course-forms/${response?.data?._id}`
        );
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
        // collegeId: collegeId ? collegeId : userData.collegeId,
        courseDescription: value.courseDescription,

        isPublish: value.isPublish,
      };
      if (value.coverImage) {
        formData.image = value.coverImage;
      }
      if (userData?.authority.toString() !== SUPERADMIN) {
        formData.collegeId = collegeId ? collegeId : userData.collegeId;
      }
      const response = await axiosInstance.put(
        `user/course/${formData.courseId}`,
        formData
      );
      if (response.success) {
        setLoading(false);
        setCourseData(response.data);
        navigate(
          `/app/admin/content-hub/students/course-forms/${response?.data?._id}`
        );
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
      if (courseData?._id) {
        await editCourseMethod(formData, courseData?._id);
      } else {
        await addNewCourseMethod(formData);
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
              Course Publish Status
            </div>
            <div className="col-span-2">
              <Switcher
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    isPublish: !e,
                  });
                }}
                checked={formData?.isPublish}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default CourseForm;
