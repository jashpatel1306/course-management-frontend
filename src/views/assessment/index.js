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
const Assessment = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [IsOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "Assessments-1",
    expire: new Date(),
  });
  const [error, setError] = useState("");
  const onHandleBox = async () => {
    try {
      if (
        !formData.expire &&
        validator.isEmpty(formData.expire?.toString(), {
          ignore_whitespace: true,
        })
      ) {
        setError("Please select a Expire Date.");
      }
      if (!formData?.name) {
        setError("Please Enter Assessment Name.");
      }

      if (formData?.name && formData.expire) {
        setError("");

        navigate(`/app/admin/assessment/form/66cbfee299936cc2fe180f53`);
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

      <Card className="mt-4">
        <div className="flex flex-wrap gap-4  p-4">
          {[...Array(12).keys()]?.map((index) => {
            return (
              <>
                <AssessmentCard variant="full" />
              </>
            );
          })}
        </div>
      </Card>
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
            name: "",
            expire: "",
          });
        }}
        onRequestClose={() => {
          setIsOpen(false);
          setError("");
          setFormData({
            name: "",
            expire: "",
          });
        }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Assessment Details
          </h5>
          {/* Assessment Name  */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Assessment Name
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Please Enter Assessment Name"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value.trim(),
                  });
                }}
                value={formData?.name}
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
                      expire: new Date(date),
                    });
                  } else {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      expire: "",
                    }));
                  }
                }}
                value={formData.expire ? new Date(formData.expire) : ""}
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
