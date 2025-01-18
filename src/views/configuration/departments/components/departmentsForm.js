/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { Button, Dialog, Input, Select, Switcher } from "components/ui";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";
import { SUPERADMIN } from "constants/roles.constant";

function DepartmentForm(props) {
  const {  departmentData, IsOpen, setIsOpen } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { authority, collegeId } = useSelector(
    (state) => state.auth.user.userData
  );
  const [collegeList, setCollegeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    college: authority.toString() !== SUPERADMIN ? collegeId : "",
    department: "",
    active: true
  });
  console.log("formData: ", formData);
  const [apiFlag, setApiFlag] = useState(false);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [error, setError] = useState("");

  const resetFormData = () => {
    setFormData({
      college: authority.toString() !== SUPERADMIN ? collegeId : "",
      department: "",
      active: true
    });
    setError("");
  };

  const getCollegeOptionData = async () => {
    try {
      setCollegeLoading(true);
      const response = await axiosInstance.get(`admin/college-option`);

      if (response.success) {
        setCollegeList(response.data);
        // setFormData({
        //   ...formData,
        //   college:
        //     authority.toString() !== SUPERADMIN
        //       ? response.data.find((info) => info.value === collegeId)
        //       : ""
        // });
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
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      if (authority.toString() === SUPERADMIN) {
        getCollegeOptionData();
      }
    }
  }, [apiFlag]);
  useEffect(() => {
    setApiFlag(true);
  }, []);
  useEffect(() => {
    if (departmentData?._id) {
      setFormData({
        college: departmentData?.collegeId
          ? collegeList.find((info) => info.value === departmentData?.collegeId)
          : "",
        department: departmentData?.department
          ? departmentData?.department
          : "",
        active: departmentData?.active ? departmentData?.active : false
      });
    }
  }, [departmentData]);
  const updateDepartmentData = async () => {
    try {
      setLoading(true);
      let apiData = {
        department: formData.department,
        active: formData.active,
        collegeId: formData.college.value || formData.college
      };

      const response = departmentData?._id
        ? await axiosInstance.put(
            `user/department/${departmentData?._id}`,
            apiData
          )
        : await axiosInstance.post(`user/department`, apiData);
      if (response.success) {
        openNotification("success", response.message);
        resetFormData();
        setIsOpen(false);
      } else {
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("onFormSubmit error: ", error);
      openNotification("danger", error.message);
    } finally {
      setLoading(false);
    }
  };
  const onHandleBox = async () => {
    try {
      console.log("formData onHandleBox: ", formData);
      if (!formData?.department) {
        setError("Please Enter Department Name");
      }
      if (authority.toString() === SUPERADMIN && !formData?.college?.value) {
        setError("Please Select College Name.");
      }
      if (authority.toString() === SUPERADMIN) {
        if (formData?.college?.value && formData?.department) {
          setError("");
          await updateDepartmentData();
        }
      } else if (formData?.college && formData?.department) {
        await updateDepartmentData();
      }
    } catch (error) {
      console.log("onHandleBox error :", error);
    }
  };

  return (
    <>
      <Dialog
        isOpen={IsOpen}
        style={{
          content: {
            marginTop: 250
          }
        }}
        contentClassName="pb-0 px-0"
        onClose={() => {
          setIsOpen(false);
          resetFormData();
        }}
        onRequestClose={() => {
          setIsOpen(false);
          resetFormData();
        }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-6 text-${themeColor}-${primaryColorLevel}`}>
            Add Department
          </h5>
          <div className="col-span-1 gap-4 mb-4">
            {authority.toString() === SUPERADMIN && (
              <>
                <div
                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                >
                  Select College Name
                </div>
                <div className="col-span-2">
                  <Select
                    isSearchable={true}
                    className="w-[100%] md:mb-0 mb-4 sm:mb-0"
                    placeholder="Colleges"
                    options={collegeList}
                    loading={collegeLoading}
                    value={formData?.college}
                    onChange={(item) => {
                      setFormData({
                        ...formData,
                        college: item
                      });
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Department Name
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter Department Name"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    department: e.target.value
                  });
                }}
                value={formData?.department}
              />
            </div>
          </div>
          {departmentData?._id ? (
            <>
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
            </>
          ) : (
            <></>
          )}
          {DisplayError(error)}
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setIsOpen(false);
              resetFormData();
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={onHandleBox} loading={loading}>
            Okay
          </Button>
        </div>
      </Dialog>
    </>
  );
}

export default DepartmentForm;
