/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Input, Button, Switcher, Drawer, Select } from "components/ui";
import axiosInstance from "apiServices/axiosInstance";
import * as Yup from "yup";
import openNotification from "views/common/notification";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";
import { SUPERADMIN } from "constants/roles.constant";

const staffPermissionOptions = [
  { value: "dashboard", label: "Dashboard" },
  { value: "students", label: "Students" },
  { value: "Batches", label: "Batches" },
  { value: "ContentHub", label: "ContentHub" },
  { value: "Assessment", label: "Assessment" },
  { value: "Instructors", label: "Instructors" },
  { value: "assessmentResult", label: "Assessment Result" },
  { value: "configuration", label: "Configuration" },
  { value: "publiccontent", label: "Public Content" }
];
const superAdminPermissionOptions = [
  { value: "dashboard", label: "Dashboard" },
  { value: "students", label: "Students" },
  { value: "batches", label: "Batches" },
  { value: "contentHub", label: "ContentHub" },
  { value: "assessment", label: "Assessment" },
  { value: "publiccontent", label: "Public Content" },
  { value: "instructors", label: "Instructors" },
  { value: "assessmentResult", label: "Assessment Result" },
  { value: "colleges", label: "Colleges" },
  { value: "staff", label: "Staff" },
  { value: "policy", label: "Policy" },
  { value: "configuration", label: "General Configuration" }
];
function StaffForm(props) {
  const { handleCloseClick, staffData, isOpen } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);
  const staffValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    // collegeUserId: Yup.string().when([], {
    //   is: (userData) =>
    //     userData?.authority.toString() === SUPERADMIN.toString(),
    //   then: Yup.string().required("College Name is required"),
    //   otherwise: Yup.string().notRequired()
    // }),
    collegeUserId: Yup.string().when("isSuperAdmin", {
      is: false, // When isSuperAdmin is false
      then: Yup.string().required("College Name is required"), // Make it required
      otherwise: Yup.string().notRequired() // Otherwise not required
    }),
    permissions: Yup.array().required("permissions is required"),
    isSuperAdmin: Yup.boolean(),
    active: Yup.boolean()
  });
  const [loading, setLoading] = useState(false);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeList, setCollegeList] = useState([]);
  const [formData, setFormData] = useState({
    staffId: "",
    name: "panthil",
    email: "panthil@gmail.com",
    phone: "8523697410",
    collegeUserId:
      userData?.authority.toString() === SUPERADMIN ? "" : userData.collegeId,
    permissions: [],
    isSuperAdmin: false,
    active: true
  });

  const [errorData, setErrorData] = useState({
    name: "",
    email: "",
    phone: "",
    collegeUserId: "",
    permissions: "",
    active: true
  });

  const resetErrorData = () => {
    setErrorData({
      name: "",
      email: "",
      phone: "",
      collegeUserId: "",
      permissions: ""
    });
  };

  const resetFormData = () => {
    setFormData({
      staffId: "",
      name: "",
      email: "",
      phone: "",
      collegeUserId:
        userData?.authority.toString() === SUPERADMIN
          ? null
          : userData.collegeId,
      isSuperAdmin:
        userData?.authority.toString() === SUPERADMIN ? true : false,
      permissions: [],
      active: true
    });
  };

  useEffect(() => {
    if (isOpen) {
      if (userData.authority.toString() === SUPERADMIN) {
        getCollegeOptionData();
      }
    }
  }, [isOpen, userData.authority, userData.collegeId]);

  useEffect(() => {
    if (staffData?._id) {
      console.log("staffData?.collegeUserId._id: ", staffData?.collegeUserId);
      setFormData({
        staffId: staffData?._id ? staffData?._id : "",
        name: staffData?.name ? staffData?.name : "",
        email: staffData?.email ? staffData?.email : "",
        phone: staffData?.phone ? staffData?.phone : "",
        collegeUserId:
          userData?.authority.toString() === SUPERADMIN
            ? staffData?.collegeUserId
              ? staffData?.collegeUserId
              : ""
            : userData.collegeId,
        isSuperAdmin: staffData?.isSuperAdmin,
        permissions: staffData?.permissions
          ? staffData?.permissions.map((staff) => {
              return { value: staff, label: staff };
            })
          : [],
        active: staffData?.active !== undefined ? staffData?.active : true
      });
    }
  }, [staffData]);

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
  const addNewStaffMethod = async (value) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`user/staff`, value);
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
  const editStaffMethod = async (value, staffId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`user/staff/${staffId}`, value);
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
      staffValidationSchema.validateSync(formData, { abortEarly: false });
      return {
        name: "",
        email: "",
        phone: "",
        collegeUserId: "",
        permissions: ""
      };
    } catch (error) {
      const errorObject = getErrorMessages(error);
      if (Object.keys(errorObject)?.length === 0) {
        return {
          name: "",
          email: "",
          phone: "",
          collegeUserId: "",
          permissions: ""
        };
      } else {
        console.log("errorObject", errorObject);
        return {
          ...errorData,
          status: true,
          name: errorObject.name ? errorObject.name : "",
          email: errorObject.email ? errorObject.email : "",
          phone: errorObject.phone ? errorObject.phone : "",
          collegeUserId: errorObject.collegeUserId
            ? errorObject.collegeUserId
            : "",
          permissions: errorObject.permissions ? errorObject.permissions : ""
        };
      }
    }
  };
  const SubmitHandle = async () => {
    const errorObject = formValidation();
    if (!errorObject.status) {
      resetErrorData();
      if (staffData?._id) {
        const newFormData = { ...formData };
        await editStaffMethod(newFormData, staffData?._id);
      } else {
        await addNewStaffMethod(formData);
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
            {staffData ? "Update Staff" : "Add New Staff"}
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
              {!staffData?._id && (
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
              {staffData ? "Update" : "Submit"}
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
                placeholder="Please Enter Staff Name"
                className={errorData.name && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value
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
                placeholder="Please Enter Staff Email"
                className={errorData.email && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    email: e.target.value.trim()
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
                    phone: e.target.value
                  });
                }}
                value={formData?.phone}
              />
            </div>
            {DisplayError(errorData.phone)}
          </div>
          {userData?.authority.toString() === SUPERADMIN.toString() ? (
            <>
              <div className="col-span-1 gap-4 mb-4">
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  Staff SuperAdmin
                </div>
                <div className="col-span-2">
                  <Switcher
                    checked={formData?.isSuperAdmin}
                    onChange={(val) => {
                      setFormData({
                        ...formData,
                        isSuperAdmin: !val,
                        permissions: [],
                        collegeUserId: ""
                      });
                    }}
                  />
                </div>
              </div>
              {/*  College Name */}
              {!formData?.isSuperAdmin ? (
                <>
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
                            collegeUserId: e.value
                          });
                        }}
                        value={collegeList.find(
                          (info) => info.value === formData?.collegeUserId
                        )}
                        options={collegeList}
                        className={errorData.collegeUserId && "select-error"}
                      />
                    </div>
                    {DisplayError(errorData.collegeUserId)}
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
          {/* Permissions */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Permissions
            </div>
            <div className="col-span-2">
              <Select
                // isClearable
                isMulti
                placeholder="Select Permissions"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    permissions: e.map((e) => {
                      return {
                        label: e.label,
                        value: e.value
                      };
                    })
                  });
                }}
                options={
                  !formData?.isSuperAdmin
                    ? staffPermissionOptions
                    : superAdminPermissionOptions
                }
                value={formData.permissions}
                // componentAs={CreatableSelect}
                className={errorData.permissions && "select-error"}
              />
            </div>
            {DisplayError(errorData.permissions)}
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
                    active: !val
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

export default StaffForm;
