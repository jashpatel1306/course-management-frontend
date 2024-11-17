import React, { useEffect, useState } from "react";
import { Input, Button, Switcher, Drawer, Select } from "components/ui";
import axiosInstance from "apiServices/axiosInstance";
import * as Yup from "yup";
import openNotification from "views/common/notification";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";
import { FormNumericInput } from "components/shared";
import { SUPERADMIN } from "constants/roles.constant";
import CreatableSelect from "react-select/creatable";

function InstructorForm(props) {
  const { handleCloseClick, instructorData, isOpen } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);
  const instructorValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    collegeId: Yup.string().required("College Id is required"),
    skills: Yup.array().required("Skills is required"),
    location: Yup.string().required("Location is required"),
    experienceInYears: Yup.number()
      .required("Experience In Years is required")
      .positive("Must be a positive number"),
    active: Yup.boolean(),
    courses: Yup.array()
      .of(Yup.object())
      .nullable()
      .default([])
      .required("At least one course ID is required"),
  });
  const [loading, setLoading] = useState(false);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeList, setCollegeList] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesList, setCoursesList] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    collegeId:
      userData?.authority.toString() === SUPERADMIN ? null : userData.collegeId,
    skills: [],
    courses: [],
    location: "",
    experienceInYears: "",
    active: true,
  });
  const [errorData, setErrorData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    location: "",
    collegeId: "",
    experienceInYears: "",
  });
  const resetErrorData = () => {
    setErrorData({
      name: "",
      email: "",
      phone: "",
      skills: "",
      location: "",
      collegeId: "",
      experienceInYears: "",
    });
  };
  const getCoursesOptionData = async (collegeId = "") => {
    try {
      setCoursesLoading(true);
      const response = await axiosInstance.get(
        `user/college-wise-instructor-courses-options/${collegeId}`
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
  const resetFormData = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      collegeId:
        userData?.authority.toString() === SUPERADMIN
          ? null
          : userData.collegeId,
      skills: [],
      courses: [],
      location: "",
      experienceInYears: "",
      active: true,
    });
  };
  useEffect(() => {
    if (isOpen) {
      if (userData?.authority.toString() === SUPERADMIN) {
        getCollegeOptionData();
      } else {
        if (userData.collegeId) {
          getCoursesOptionData(userData.collegeId);
        }
      }
    }
  }, [isOpen]);
  useEffect(() => {
    if (instructorData?._id) {
      setFormData({
        name: instructorData?.name ? instructorData?.name : "",
        email: instructorData?.email ? instructorData?.email : "",
        phone: instructorData?.phone ? instructorData?.phone : "",
        skills: instructorData?.skills ? instructorData?.skills : null,
        collegeId:
          userData?.authority.toString() === SUPERADMIN
            ? instructorData?.collegeId
              ? instructorData?.collegeId
              : ""
            : userData.collegeId,

        location: instructorData?.location ? instructorData?.location : "",
        experienceInYears: instructorData?.experienceInYears
          ? instructorData?.experienceInYears
          : "",
        courses:
          instructorData && instructorData?.courses?.length
            ? coursesList.filter((courses) =>
                instructorData?.courses.includes(courses.value)
              )
            : [],
        active:
          instructorData?.active !== undefined ? instructorData?.active : true,
      });
    }
  }, [instructorData]);
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

  const addNewInstructorMethod = async (value) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`user/instructor`, value);
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
  const editInstructorMethod = async (value, instructorId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `user/instructor/${instructorId}`,
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
      instructorValidationSchema.validateSync(formData, { abortEarly: false });
      return {
        name: "",
        email: "",
        phone: "",
        skills: "",
        location: "",
        experienceInYears: "",
        courses: "",
      };
    } catch (error) {
      const errorObject = getErrorMessages(error);
      if (Object.keys(errorObject)?.length === 0) {
        return {
          name: "",
          email: "",
          phone: "",
          skills: "",
          location: "",
          collegeId: "",
          experienceInYears: "",
          courses: "",
        };
      } else {
        return {
          ...errorData,
          status: true,
          name: errorObject.name ? errorObject.name : "",
          email: errorObject.email ? errorObject.email : "",
          skills: errorObject.skills ? errorObject.skills : "",
          phone: errorObject.phone ? errorObject.phone : "",
          location: errorObject.location ? errorObject.location : "",
          experienceInYears: errorObject.experienceInYears
            ? errorObject.experienceInYears
            : "",
          courses: errorObject.courses ? errorObject.courses : "",

          collegeId: errorObject.collegeId ? errorObject.collegeId : "",
        };
      }
    }
  };
  const SubmitHandle = async () => {
    const errorObject = formValidation();
    if (!errorObject.status) {
      resetErrorData();
      if (instructorData?._id) {
        const newFormData = {
          ...formData,
          courses: formData?.courses?.map((info) => info.value),
        };
        await editInstructorMethod(newFormData, instructorData?._id);
      } else {
        await addNewInstructorMethod({
          ...formData,
          courses: formData?.courses?.map((info) => info.value),
        });
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
            {instructorData ? "Update Instructor" : "Add New Instructor"}
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
              {!instructorData?._id && (
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
              {instructorData ? "Update" : "Submit"}
            </Button>
          </div>
        }
        headerClass="items-start bg-gray-100 dark:bg-gray-700"
        footerClass="border-t-2 p-3"
      >
        <div className="text-sm">
          {/* Name */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Name
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter Instructor Name"
                className={errorData.name && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  });
                }}
                value={formData?.name}
              />
            </div>
            {DisplayError(errorData.name)}
          </div>
          {/* Email */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Email
            </div>
            <div className="col-span-2">
              <Input
                type="email"
                placeholder="Please Enter Instructor Email"
                className={errorData.email && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    email: e.target.value.trim(),
                  });
                }}
                value={formData?.email}
              />
            </div>
            {DisplayError(errorData.email)}
          </div>
          {/* Phone */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Phone
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter Phone Number"
                className={errorData.phone && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  });
                }}
                value={formData?.phone}
              />
            </div>
            {DisplayError(errorData.phone)}
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

          {/* Skills */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              skills
            </div>
            <div className="col-span-2">
              <Select
                isClearable
                isMulti
                placeholder="Select Department"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    skills: e.map((e) => {
                      return {
                        label: e.label,
                        value: e.value,
                      };
                    }),
                  });
                }}
                value={formData.skills}
                componentAs={CreatableSelect}
                className={errorData.skills && "select-error"}
              />
            </div>
            {DisplayError(errorData.skills)}
          </div>

          {/* Location */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Location
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter Instructor Location"
                className={errorData.location && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    location: e.target.value,
                  });
                }}
                value={formData?.location}
              />
            </div>
            {DisplayError(errorData.location)}
          </div>
          {/* Experience In Years */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Experience In Years
            </div>
            <div className="col-span-2">
              <FormNumericInput
                placeholder="Enter Passout Year"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    experienceInYears: e.target.value,
                  });
                }}
                value={formData?.experienceInYears}
                className={errorData.experienceInYears && "select-error"}
              />
            </div>
            {DisplayError(errorData.experienceInYears)}
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
                placeholder="Please Select Courses"
                className={errorData?.courses && "select-error"}
                loading={coursesLoading}
                onChange={(value) => {
                  setFormData({
                    ...formData,
                    courses: value,
                  });
                }}
                value={formData?.courses}
                options={coursesList}
              />
            </div>
            {DisplayError(errorData.courses)}
          </div>
          {/* Active */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Active
            </div>
            <div className="col-span-2">
              <Switcher
                checked={formData?.active}
                onChange={(val) => {
                  setFormData({
                    ...formData,
                    active: !val,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default InstructorForm;
