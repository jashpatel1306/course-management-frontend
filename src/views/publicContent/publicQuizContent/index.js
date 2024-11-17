import { Button, Card, Dialog, Input, Switcher } from "components/ui";
import React, { useState } from "react";

import { useSelector } from "react-redux";
import { HiPlusCircle } from "react-icons/hi";
import openNotification from "views/common/notification";
import axiosInstance from "apiServices/axiosInstance";
import DisplayError from "views/common/displayError";
import { useNavigate } from "react-router-dom";
import QuizList from "./components/quizList";
import { FormNumericInput } from "components/shared";
import { MdDelete } from "react-icons/md";
const QuizContent = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [IsOpen, setIsOpen] = useState(false);
  const [apiFlag, setApiFlag] = useState(false);
  const [sectionData, setSectionData] = useState();
  const [formData, setFormData] = useState({
    title: "",
    description: [""],
    time: null,
    isPublish: false
  });
  const [error, setError] = useState("");
  const CreateQuiz = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`user/public-quiz`, formData);
      if (response?.success && response?.data?._id) {
        openNotification("success", response.message);
        setSectionData(response.data);
        setIsOpen(false);
        setApiFlag(true);
        navigate(`/app/admin/public-content/quiz-form/${response.data._id}`);
        setError("");
      } else {
        openNotification("danger", response.message);
      }
      setFormData({
        ...formData,
        title: "",
        description: [],
        time: null,
        isPublish: false
      });
    } catch (error) {
      console.log("onFormSubmit error: ", error);
      openNotification("danger", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const onHandleQuizBox = async () => {
    try {
      if (!formData?.description.length) {
        setError("Please Enter At Least One Instruction");
      }
      if (!formData?.time) {
        setError("Please Enter At Quiz Time In Minutes");
      }
      if (!formData?.title) {
        setError("Please Enter Quiz Title.");
      }
      if (formData?.title && formData?.time && formData?.description.length) {
        CreateQuiz();
        setError("");
        // setIsOpen(false);
        setFormData({
          ...formData,
          title: "",
          description: [""],
          quizId: null,
          time: null,
          isPublish: false
        });
      }
    } catch (error) {
      console.log("onHandleQuizBox error :", error);
    }
  };

  return (
    <>
      <Card>
        <div className="flex items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Public Quiz Contents
          </div>
          <div>
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                setIsOpen(true);
                //
              }}
            >
              Add New Content
            </Button>
          </div>
        </div>
      </Card>
      <div>
        <QuizList />
      </div>
      <Dialog
        isOpen={IsOpen}
        contentClassName="pb-0 px-0"
        onClose={() => {
          setIsOpen(false);
          setError("");
          setFormData({
            ...formData,
            title: "",
            description: [""],
            quizId: null
          });
        }}
        onRequestClose={() => {
          setIsOpen(false);
          setError("");
          setFormData({
            ...formData,
            title: "",
            description: [""],
            quizId: null
          });
        }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Quiz Details
          </h5>
          <div className="max-h-96 overflow-y-auto hidden-scroll">
            {/* Quiz Name  */}
            <div className="col-span-1 gap-4 mb-4">
              <div
                className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
              >
                Quiz Title
              </div>
              <div className="col-span-2">
                <Input
                  type="text"
                  placeholder="Please Enter Quiz Name"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value
                    });
                  }}
                  value={formData?.title}
                />
              </div>
            </div>
            {/* Quiz Time  */}
            <div className="col-span-1 gap-4 mb-4">
              <div
                className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
              >
                Quiz Time (Minutes)
              </div>
              <div className="col-span-2">
                <FormNumericInput
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-"]?.includes(evt.key) &&
                    evt.preventDefault()
                  }
                  placeholder="Please Enter Quiz Time"
                  className="capitalize"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      time: e.target.value
                    });
                  }}
                  value={formData?.time}
                />
              </div>
            </div>

            {/* Quiz Publish Status */}
            <div className="col-span-1 gap-4 mb-4">
              <div
                className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
              >
                Quiz Publish Status
              </div>
              <div className="col-span-2">
                <Switcher
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      isPublish: !e
                    });
                  }}
                  checked={formData?.isPublish}
                />
              </div>
            </div>
            {DisplayError(error)}
          </div>
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setIsOpen(false);
              setError("");
              setFormData({
                ...formData,
                title: "",
                description: [],
                quizId: null
              });
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={onHandleQuizBox} loading={isLoading}>
            Update
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default QuizContent;
