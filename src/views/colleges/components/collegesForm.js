import React, { useEffect, useState } from "react";

import { Input, Button, Switcher, Drawer } from "components/ui";
import axiosInstance from "apiServices/axiosInstance";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import * as Yup from "yup";
import openNotification from "views/common/notification";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";
const addvalidationSchema = Yup.object().shape({
  collegeName: Yup.string()
    .min(3, "Too Short!")
    .max(100, "Too Long!")
    .required("College Name Required"),
  shortName: Yup.string()
    .min(2, "Too Short!")
    .max(10, "Too Long!")
    .required("College Short Name Required"),
  collegeNo: Yup.string()
    .min(1, "Too Short!")
    .max(10, "Too Long!")
    .required("College No Required"),
  contactPersonName: Yup.string()
    .min(3, "Too Short!")
    .max(100, "Too Long!")
    .required("Contact Person Name Required"),
  contactPersonNo: Yup.string()
    .min(3, "Too Short!")
    .max(100, "Too Long!")
    .required("Contact Person No Required"),
  email: Yup.string().email("Invalid email").required("Email Required"),
  password: Yup.string()
    .required("Password Required")
    .min(8, "Password must be 8 characters long")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),
});
function CollegeForm(props) {
  const { handleCloseClick, userData, isOpen } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [pwInputType, setPwInputType] = useState("password");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    collegeName: "University of Edinburgh",
    shortName: "Edinburgh",
    collegeNo: "22335599",
    contactPersonName: "Dr. Lucas Thompson",
    contactPersonNo: "+44 131 650 1000",
    email: "lucas.thompson@ed.ac.uk",
    password: "College@123",
    active: true,
  });
  const [errorData, setErrorData] = useState({
    collegeName: "",
    shortName: "",
    collegeNo: "",
    contactPersonName: "",
    contactPersonNo: "",
    email: "",
    password: "",
    active: true,
  });
  const resetErrorData = () => {
    setErrorData({
      collegeName: "",
      shortName: "",
      collegeNo: "",
      contactPersonName: "",
      contactPersonNo: "",
      email: "",
      password: "",
      active: false,
    });
  };
  const resetFormData = () => {
    setFormData({
      collegeName: "",
      shortName: "",
      collegeNo: "",
      contactPersonName: "",
      contactPersonNo: "",
      email: "",
      password: "",
      active: false,
    });
  };
  useEffect(() => {
    if (userData) {
      console.log("userData: ", userData);
      setFormData({
        collegeName: userData ? userData.collegeName : "",
        shortName: userData ? userData.shortName : "",
        collegeNo: userData ? userData.collegeNo : "",
        contactPersonName: userData ? userData.contactPersonName : "",
        contactPersonNo: userData ? userData.contactPersonNo : "",
        email: userData ? userData.email : "",
        password: userData ? userData.password : "",
        active: userData ? userData.active : true,
      });
    }
  }, [userData]);
  const onPasswordVisibleClick = (e) => {
    e.preventDefault();
    setPwInputType(pwInputType === "password" ? "text" : "password");
  };

  const passwordVisible = (
    <span
      className="cursor-pointer font-bold "
      onClick={(e) => onPasswordVisibleClick(e)}
    >
      {pwInputType === "password" ? (
        <HiOutlineEyeOff size={20} />
      ) : (
        <HiOutlineEye size={20} />
      )}
    </span>
  );
  const addNewCollegeMethod = async (value) => {
    try {
      setLoading(true);
      const formData = {
        collegeName: value.collegeName,
        shortName: value.shortName,
        collegeNo: value.collegeNo,
        contactPersonName: value.contactPersonName,
        contactPersonNo: value.contactPersonNo,
        email: value.email,
        password: value.password,
        active: value.active,
      };
      const response = await axiosInstance.post(`admin/college`, formData);
      console.log("response : ", response);
      if (response.success) {
        setLoading(false);
        handleCloseClick();
      } else {
        setLoading(false);
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("addNewCollegeMethod error : ", error);
      openNotification("danger", error.message);
      setLoading(false);
    }
  };
  const editCollegeMethod = async (value, userId) => {
    try {
      setLoading(true);

      const formData = {
        userId: userId,
        collegeName: value.collegeName,
        shortName: value.shortName,
        collegeNo: value.collegeNo,
        contactPersonName: value.contactPersonName,
        contactPersonNo: value.contactPersonNo,
        email: value.email,
        password: value.password,
        active: value.active,
      };
      const response = await axiosInstance.post(`admin/college`, formData);
      if (response.success) {
        setLoading(false);
        handleCloseClick();
      } else {
        setLoading(false);
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("editCollegeMethod error : ", error);
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
      console.log("formData:  ", formData);
      addvalidationSchema.validateSync(formData, { abortEarly: false });
      return {
        collegeName: "",
        shortName: "",
        collegeNo: "",
        contactPersonName: "",
        contactPersonNo: "",
        email: "",
        password: "",
        active: false,
      };
    } catch (error) {
      const errorObject = getErrorMessages(error);
      if (Object.keys(errorObject)?.length === 0) {
        return {
          collegeName: "",
          shortName: "",
          collegeNo: "",
          contactPersonName: "",
          contactPersonNo: "",
          email: "",
          password: "",
          active: false,
        };
      } else {
        return {
          ...errorData,
          status: true,
          collegeName: errorObject.collegeName ? errorObject.collegeName : "",
          shortName: errorObject.shortName ? errorObject.shortName : "",
          collegeNo: errorObject.collegeNo ? errorObject.collegeNo : "",
          contactPersonName: errorObject.contactPersonName
            ? errorObject.contactPersonName
            : "",
          contactPersonNo: errorObject.contactPersonNo
            ? errorObject.contactPersonNo
            : "",
          email: errorObject.email ? errorObject.email : "",
          password: errorObject.password ? errorObject.password : "",
        };
      }
    }
  };
  const SubmitHandle = async () => {
    const errorObject = formValidation();
    console.log("errorObject Data: ", errorObject);
    if (!errorObject.status) {
      resetErrorData();
      if (userData?.userId) {
        console.log("edit");
        await editCollegeMethod(formData, userData?.userId);
      } else {
        console.log("add");
        await addNewCollegeMethod(formData);
      }
    } else {
      setErrorData(errorObject);
      console.log("error : .............");
    }
  };
  return (
    <>
      <Drawer
        title={
          <div
            className={`text-xl font-semibold text-${themeColor}-${primaryColorLevel}`}
          >
            {userData ? "Update Colleges" : "Add New Colleges"}
          </div>
        }
        isOpen={isOpen}
        width={400}
        onClose={() => {
          resetErrorData();
          resetFormData();
          handleCloseClick();
          setPwInputType("password");
        }}
        onRequestClose={() => {
          resetErrorData();
          resetFormData();
          handleCloseClick();
          setPwInputType("password");
        }}
        footer={
          <div className="flex w-full justify-between items-center">
            <div>
              {!userData?._id && (
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
              {userData ? "Update" : "Submit"}
            </Button>
          </div>
        }
        headerClass="items-start bg-gray-100 dark:bg-gray-700"
        footerClass="border-t-2 p-3"
      >
        <div className="text-sm	">
          {/* College Email */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              College Email
            </div>
            <div className="col-span-2">
              <Input
                type="email"
                placeholder="Please Enter College Email"
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
          {/* College Name */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              College Name
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter College Name"
                className={
                  errorData.collegeName
                    ? "select-error capitalize"
                    : "capitalize"
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    collegeName: e.target.value,
                  });
                }}
                value={formData?.collegeName}
              />
            </div>
            {DisplayError(errorData.collegeName)}
          </div>
          {/* College short  Name */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              College Short Name
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter College Short Name"
                className={
                  errorData.shortName ? "select-error capitalize" : "capitalize"
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    shortName: e.target.value,
                  });
                }}
                value={formData?.shortName}
              />
            </div>
            {DisplayError(errorData.shortName)}
          </div>
          {/* College short  Name */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              College No
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter College No"
                className={
                  errorData.collegeNo ? "select-error capitalize" : "capitalize"
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    collegeNo: e.target.value,
                  });
                }}
                value={formData?.collegeNo}
              />
            </div>
            {DisplayError(errorData.collegeNo)}
          </div>
          {/* College Password */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Password
            </div>
            <div className="col-span-2">
              <Input
                type={pwInputType}
                suffix={passwordVisible}
                autoComplete="off"
                placeholder="Please Enter College Password"
                className={errorData.password && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    password: e.target.value.trim(),
                  });
                }}
                value={formData?.password}
              />
            </div>
            {DisplayError(errorData.password)}
          </div>
          {/* College contact  Person name*/}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Contact Person Name
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter Contact Person Name"
                className={
                  errorData.contactPersonName
                    ? "select-error capitalize"
                    : "capitalize"
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    contactPersonName: e.target.value,
                  });
                }}
                value={formData?.contactPersonName}
              />
            </div>
            {DisplayError(errorData.contactPersonName)}
          </div>
          {/* College contact  Person No*/}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Contact Person No
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter Contact Person Name"
                className={
                  errorData.contactPersonNo
                    ? "select-error capitalize"
                    : "capitalize"
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    contactPersonNo: e.target.value,
                  });
                }}
                value={formData?.contactPersonNo}
              />
            </div>
            {DisplayError(errorData.contactPersonNo)}
          </div>
          {/* Colleges Active */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Colleges Status
            </div>
            <div className="col-span-2">
              <Switcher
                onChange={(e) => {
                  console.log("active:  ", !e);
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

export default CollegeForm;
