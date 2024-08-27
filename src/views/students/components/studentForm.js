import React, { useEffect, useState } from "react";
import { Input, Button, Switcher, Drawer, Select } from "components/ui";
import axiosInstance from "apiServices/axiosInstance";
import * as Yup from "yup";
import openNotification from "views/common/notification";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";
import { FormNumericInput } from "components/shared";

const departmentList = [
  { label: "Computer Science", value: "cs" },
  { label: "Electrical Engineering", value: "ee" },
  { label: "Mechanical Engineering", value: "me" },
  { label: "Civil Engineering", value: "ce" },
  { label: "Mathematics", value: "math" },
];

const sectionList = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
  { label: "D", value: "D" },
];
const genderList = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const studentValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  collegeUserId: Yup.string().required("College User ID is required"),
  batchId: Yup.string().required("Batch ID is required"),
  rollNo: Yup.string().required("Roll no is required"),
  department: Yup.string().required("Department is required"),
  section: Yup.string().required("Section is required"),
  passoutYear: Yup.number()
    .required("Passout Year is required")
    .positive("Must be a positive number"),
  gender: Yup.string().required("Gender is required"),
  semester: Yup.number()
    .required("Semester is required")
    .positive("Must be a positive number"),
  active: Yup.boolean(),
});

function StudentForm(props) {
  const { handleCloseClick, studentData, isOpen } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchList, setBatchList] = useState([]);

  const [formData, setFormData] = useState({
    studentId: "",
    name: "panthil",
    email: "panthilmalaviya288@gmail.com",
    phone: "+916353980453",
    collegeUserId: userData.collegeId,
    batchId: "",
    rollNo: "R" + Math.floor(Math.random() * 10000),
    department: "",
    section: "",
    passoutYear: "",
    gender: "",
    semester: "",
    active: true,
  });
  const [errorData, setErrorData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    rollNo: "",
    section: "",
    passoutYear: "",
    gender: "",
    semester: "",
  });

  const resetErrorData = () => {
    setErrorData({
      name: "",
      email: "",
      phone: "",
      department: "",
      rollNo: "",
      section: "",
      passoutYear: "",
      gender: "",
      semester: "",
    });
  };

  const resetFormData = () => {
    setFormData({
      studentId: "",
      name: "",
      email: "",
      phone: "",
      collegeUserId: userData.collegeId,
      rollNo: "",
      batchId: "",
      department: "",
      section: "",
      passoutYear: "",
      gender: "",
      semester: "",
      active: true,
    });
  };
  useEffect(() => {
    if (isOpen) {
      getBatchData();
    }
  }, [isOpen]);
  useEffect(() => {
    if (studentData?._id) {
      console.log("studentDatastudentData : ", studentData);
      setFormData({
        studentId: studentData._id ? studentData._id : "",
        name: studentData.name ? studentData.name : "",
        email: studentData.email ? studentData.email : "",
        phone: studentData.phone ? studentData.phone : "",
        rollNo: studentData.rollNo ? studentData.rollNo : "",
        collegeUserId: userData.collegeId,
        batchId: studentData.batchId ? studentData.batchId : "",
        department: studentData.department ? studentData.department : "",
        section: studentData.section ? studentData.section : "",
        passoutYear: studentData.passoutYear ? studentData.passoutYear : "",
        gender: studentData.gender ? studentData.gender : "",
        semester: studentData.semester ? studentData.semester : "",
        active: studentData.active !== undefined ? studentData.active : true,
      });
    }
  }, [studentData]);
  const getBatchData = async () => {
    try {
      setBatchLoading(true);
      const response = await axiosInstance.get(`user/batches-option`);

      if (response.success) {
        setBatchList(response.data.filter((e) => e.value !== "all"));
        setBatchLoading(false);
      } else {
        openNotification("danger", response.error);
        setBatchLoading(false);
      }
    } catch (error) {
      console.log("getBatchsData error :", error.message);
      openNotification("danger", error.message);
      setBatchLoading(false);
    }
  };
  const addNewStudentMethod = async (value) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`user/student`, value);
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

  const editStudentMethod = async (value, studentId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `user/student/${studentId}`,
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
      console.log("formData:  ", formData);
      studentValidationSchema.validateSync(formData, { abortEarly: false });
      return {
        name: "",
        email: "",
        phone: "",
        rollNo: "",
        department: "",
        section: "",
        passoutYear: "",
        gender: "",
        semester: "",
      };
    } catch (error) {
      const errorObject = getErrorMessages(error);
      console.log("errorObject : ", errorObject);
      if (Object.keys(errorObject)?.length === 0) {
        return {
          name: "",
          email: "",
          phone: "",
          department: "",
          rollNo: "",
          section: "",
          passoutYear: "",
          gender: "",
          semester: "",
        };
      } else {
        return {
          ...errorData,
          status: true,
          name: errorObject.name ? errorObject.name : "",
          email: errorObject.email ? errorObject.email : "",
          rollNo: errorObject.rollNo ? errorObject.rollNo : "",
          phone: errorObject.phone ? errorObject.phone : "",
          department: errorObject.department ? errorObject.department : "",
          section: errorObject.section ? errorObject.section : "",
          passoutYear: errorObject.passoutYear ? errorObject.passoutYear : "",
          gender: errorObject.gender ? errorObject.gender : "",
          semester: errorObject.semester ? errorObject.semester : "",
        };
      }
    }
  };

  const SubmitHandle = async () => {
    const errorObject = formValidation();
    if (!errorObject.status) {
      resetErrorData();
      if (studentData?._id) {
        await editStudentMethod(formData, studentData._id);
      } else {
        await addNewStudentMethod(formData);
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
            {studentData ? "Update Student" : "Add New Student"}
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
              {!studentData?._id && (
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
              {studentData ? "Update" : "Submit"}
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
                placeholder="Please Enter Student Name"
                className={errorData.name && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value.trim(),
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
                placeholder="Please Enter Student Email"
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
          {/* Roll No */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Roll No
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter Student Roll No"
                className={errorData.rollNo && "select-error"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    rollNo: e.target.value.trim(),
                  });
                }}
                value={formData?.rollNo}
              />
            </div>
            {DisplayError(errorData.rollNo)}
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
                    phone: e.target.value.trim(),
                  });
                }}
                value={formData?.phone}
              />
            </div>
            {DisplayError(errorData.phone)}
          </div>
          {/* batchId */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Batch
            </div>
            <div className="col-span-2">
              <Select
                placeholder="Select Batch"
                loading={batchLoading}
                onChange={(value) => {
                  setFormData({
                    ...formData,
                    batchId: value.value,
                  });
                }}
                value={batchList.find(
                  (info) => info.value === formData?.batchId
                )}
                options={batchList}
                className={errorData.batchId && "select-error"}
              />
            </div>
            {DisplayError(errorData.batchId)}
          </div>
          {/* Department */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Department {formData?.department}
            </div>
            <div className="col-span-2">
              <Select
                placeholder="Select Department"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    department: e.value,
                  });
                }}
                value={departmentList.find(
                  (info) => info.value === formData?.department
                )}
                options={departmentList}
                className={errorData.department && "select-error"}
              />
            </div>
            {DisplayError(errorData.department)}
          </div>
          {/* Section */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Section
            </div>
            <div className="col-span-2">
              <Select
                placeholder="Select Section"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    section: e.value,
                  });
                }}
                value={sectionList.find(
                  (info) => info.value === formData?.section
                )}
                options={sectionList}
                className={errorData.section && "select-error"}
              />
            </div>
            {DisplayError(errorData.section)}
          </div>
          {/* Passout Year */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Passout Year
            </div>
            <div className="col-span-2">
              <FormNumericInput
                placeholder="Enter Passout Year"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    passoutYear: e.target.value,
                  });
                }}
                value={formData?.passoutYear}
                className={errorData.passoutYear && "select-error"}
              />
            </div>
            {DisplayError(errorData.passoutYear)}
          </div>
          {/* Gender */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Gender
            </div>
            <div className="col-span-2">
              <Select
                placeholder="Select Gender"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    gender: e.value,
                  });
                }}
                value={genderList.find(
                  (info) => info.value === formData?.gender
                )}
                options={genderList}
                className={errorData.gender && "select-error"}
              />
            </div>
            {DisplayError(errorData.gender)}
          </div>
          {/* Semester */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Semester
            </div>
            <div className="col-span-2">
              <FormNumericInput
                placeholder="Enter Semester"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    semester: e.target.value,
                  });
                }}
                value={formData?.semester}
                className={errorData.semester && "select-error"}
              />
            </div>
            {DisplayError(errorData.semester)}
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
                onChange={(checked) => {
                  setFormData({
                    ...formData,
                    active: checked,
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

export default StudentForm;
