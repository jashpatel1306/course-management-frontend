import { Button, Card, Dialog, Input } from "components/ui";
import React, { useState } from "react";
import {
  HiArrowNarrowLeft,
  HiOutlinePencil,
  HiPlusCircle,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaFile } from "react-icons/fa6";
import openNotification from "views/common/notification";
import axiosInstance from "apiServices/axiosInstance";
import DisplayError from "views/common/displayError";
import validator from "validator";
const AssessmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [isLoading, setIsLoading] = useState(false);
  const [IsOpen, setIsOpen] = useState(false);
  const [sectionData, setSectionData] = useState({
    name: "",
    assessmentType: "",
  });
  const [formData, setFormData] = useState({
    name: "Assessments-1",
  });
  const [error, setError] = useState("");
  const onHandleBox = async () => {
    try {
      if (!formData?.name) {
        setError("Please Enter Assessment Name.");
      }

      if (formData?.name) {
        setSectionData({ ...sectionData, name: formData.name });
        setError("");
        setIsOpen(false);
        setFormData({ name: "" });
      }
    } catch (error) {
      console.log("");
    }
  };
  return (
    <>
      <div className="flex items-center mb-4">
        <div className="text-xl font-semibold text-center mr-4">
          <Button
            className={`back-button px-1 font-bold text-${themeColor}-${primaryColorLevel} border-2 border-${themeColor}-${primaryColorLevel} dark:text-white`}
            size="sm"
            icon={<HiArrowNarrowLeft size={30} />}
            onClick={async () => {
              navigate("/app/admin/assessment");
            }}
          />
        </div>
        <h4
          className={`text-2xl font-semibold text-${themeColor}-${primaryColorLevel} dark:text-white`}
        >
          {false ? "Update Assessments Details" : "Add Assessments Details"}
        </h4>
      </div>
      <Card>
        <div
          className={`text-xl mb-2 mx-2 font-semibold text-${themeColor}-${primaryColorLevel}`}
        >
          Assessments Name
        </div>
        <Card className="bg-gray-100 border-2">
          <div
            className={`flex items-center text-lg font-semibold gap-2 text-${themeColor}-${primaryColorLevel}`}
          >
            <div className="">Section :</div>
            <div>
              <FaFile />
            </div>
            <div className="flex gap-4 items-center">
              {sectionData?.name || "section name"}
              {/* <Input size="sm" placeholder="Basic usage" /> */}
              <span
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <HiOutlinePencil />
              </span>
            </div>
          </div>
          {sectionData.assessmentType ? (
            <>
              <p>{sectionData.assessmentType}</p>
            </>
          ) : (
            <>
              <div
                className={`mt-4 p-2 flex text-${themeColor}-${primaryColorLevel} border-2 border-dashed border-gray-400 rounded-lg  bg-gray-50`}
              >
                <div>
                  <Button
                    size="md"
                    variant="plain"
                    className={`text-${themeColor}-${primaryColorLevel} text-lg hover:bg-${themeColor}-100`}
                    icon={<HiPlusCircle size={20} />}
                    onClick={()=>{
                      setSectionData({...sectionData,assessmentType:"quiz"})
                    }}
                  >
                    <span>Quiz</span>
                  </Button>
                  <Button
                    size="md"
                    variant="plain"
                    className={`text-${themeColor}-${primaryColorLevel} text-lg hover:bg-${themeColor}-100`}
                    icon={<HiPlusCircle size={20} />}
                    onClick={()=>{
                      setSectionData({...sectionData,assessmentType:"exercise"})
                    }}
                  >
                    <span>Coding Exercise</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
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
            Section Details
          </h5>
          {/* Assessment Name  */}
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Section Name
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

          {DisplayError(error)}
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setIsOpen(false);
              setError("");
              setFormData({ name: "" });
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={onHandleBox} loading={isLoading}>
            Next
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default AssessmentForm;
