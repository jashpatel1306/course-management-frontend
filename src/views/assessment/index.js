import { Button, Card, DatePicker, Dialog, Input } from "components/ui";
import React, { useState } from "react";

import { useSelector } from "react-redux";
import AssessmentCard from "./components/assessmentCard";
import { HiPlusCircle } from "react-icons/hi";
import openNotification from "views/common/notification";
import axiosInstance from "apiServices/axiosInstance";
import DisplayError from "views/common/displayError";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import AssessmentList from "./components/assessmentList";
const Assessment = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [IsOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "Assessments-1",
    expiresAt: new Date(),
  });
  const [error, setError] = useState("");
  const CreateAssessment = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`user/assessment`, formData);
      if (response?.success && response?.data?._id) {
        openNotification("success", response.message);
        console.log("response: ", response.data._id);
        navigate(`/app/admin/assessment/form/${response.data._id}`, {
          state: response.data,
        });
        setIsOpen(false);
        setError("");
      } else {
        openNotification("danger", response.message);
      }
      setFormData({
        title: "",
        expiresAt: "",
      });
    } catch (error) {
      console.log("onFormSubmit error: ", error);
      openNotification("danger", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const onHandleBox = async () => {
    try {
      if (
        !formData.expiresAt &&
        validator.isEmpty(formData.expiresAt?.toString(), {
          ignore_whitespace: true,
        })
      ) {
        setError("Please select a Expire Date.");
      }
      if (!formData?.title) {
        setError("Please Enter Assessment Title.");
      }

      if (formData?.title && formData.expiresAt) {
        setError("");
        console.log("formData : ", formData);
        CreateAssessment(formData);
        // ;
      }
    } catch (error) {
      console.log("");
    }
  };
  return (
    <>
      <Card>
        <div className="flex items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Assessments
          </div>
          <div>
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                setIsOpen(true);
              }}
            >
              Add New Assessment
            </Button>
          </div>
        </div>
      </Card>
      <div>
        <AssessmentList />
      </div>

      <Dialog
        isOpen={IsOpen}
        style={{
          content: {
            marginTop: 250,
          },
        }}
        contentClassName="pb-0 px-0"
        onClose={() => {
          setIsOpen(false);
          setError("");
          setFormData({
            title: "",
            expiresAt: "",
          });
        }}
        onRequestClose={() => {
          setIsOpen(false);
          setError("");
          setFormData({
            title: "",
            expiresAt: "",
          });
        }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Assessment Details
          </h5>
          {/* Assessment Title  */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Assessment Title
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter Assessment Title"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    title: e.target.value.trim(),
                  });
                }}
                value={formData?.title}
              />
            </div>
          </div>
          {/*  Expire Date */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Expire Date
            </div>
            <div className="col-span-2">
              <DatePicker
                placeholder="Please Enter Expire Date"
                onChange={(date) => {
                  if (date) {
                    setFormData({
                      ...formData,
                      expiresAt: new Date(date),
                    });
                  } else {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      expiresAt: "",
                    }));
                  }
                }}
                value={formData.expiresAt ? new Date(formData.expiresAt) : ""}
              />
            </div>
          </div>
          {DisplayError(error)}
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          {/* <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setIsOpen(false);
              setError("");
            }}
          >
            Cancel
          </Button> */}
          <Button variant="solid" onClick={onHandleBox} loading={isLoading}>
            Next
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default Assessment;
