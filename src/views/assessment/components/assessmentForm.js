import { Button, Card, Dialog, Input, Switcher } from "components/ui";
import React, { useEffect, useRef, useState } from "react";
import { HiArrowNarrowLeft, HiPlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import openNotification from "views/common/notification";
import axiosInstance from "apiServices/axiosInstance";
import DisplayError from "views/common/displayError";
import QuizCard from "./quizCard";
import ExerciseCard from "./exerciseCard";
import { MdDelete } from "react-icons/md";
import { FormNumericInput } from "components/shared";

const AssessmentForm = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [apiFlag, setApiFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [IsOpen, setIsOpen] = useState(false);
  const [sectionData, setSectionData] = useState();
  const [formData, setFormData] = useState({
    title: "",
    description: [],
    assessmentId: assessmentId,
    time: null,
    isPublish: false,
  });
  const [error, setError] = useState("");
  const CreateQuiz = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`user/quiz`, formData);
      if (response?.success && response?.data?._id) {
        openNotification("success", response.message);
        setSectionData(response.data);
        setIsOpen(false);
        setApiFlag(true);
        setError("");
      } else {
        openNotification("danger", response.message);
      }
      setFormData({
        ...formData,
        title: "",
        description: [],
        time: null,
        isPublish: false,
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
          description: [],
          quizId: null,
          time: null,
          isPublish: false,
        });
      }
    } catch (error) {
      console.log("onHandleQuizBox error :", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `user/assessment/${assessmentId}`
      );
      if (response.success) {
        setSectionData(response.data);
        setSessionLoading(false);
      } else {
        openNotification("danger", response.message);
        setSessionLoading(false);
      }
    } catch (error) {
      console.log("get-all-batch error:", error);
      openNotification("danger", error.message);
      setSessionLoading(false);
    }
  };
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setSessionLoading(true);
      fetchData();
    }
  }, [apiFlag]);
  useEffect(() => {
    setApiFlag(true);
  }, []);
  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...formData.description];
    newDescriptions[index] = value;
    setFormData({
      ...formData,
      description: newDescriptions,
    });
  };
  const addDescription = () => {
    setFormData({
      ...formData,
      description: [...formData.description, ""], // Add new empty description
    });
  };
  const removeDescription = (index) => {
    const newDescriptions = formData.description.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      description: newDescriptions,
    });
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
          Assessments Details
        </h4>
      </div>
      {!sessionLoading && sectionData?._id ? (
        <>
          <Card bodyClass="p-3 sm:p-[1.25rem]">
            <div className="flex justify-between items-center ">
              <div
                className={`text-xl mb-2 mx-2 font-semibold text-${themeColor}-${primaryColorLevel}`}
              >
                {sectionData?.title}
              </div>
              {/* <div className="gap-4 mb-2 mx-2 flex">
                <div
                  className={`text-lg font-semibold text-${themeColor}-${primaryColorLevel} px-4 p-1 rounded-lg border border-${themeColor}-${primaryColorLevel}`}
                >
                  Total Questions : {sectionData?.totalQuestions || "0"}
                </div>
                <div
                  className={`text-base font-semibold text-${themeColor}-${primaryColorLevel} px-2 p-1 rounded-lg border border-${themeColor}-${primaryColorLevel}`}
                >
                  Total Marks : {sectionData?.totalMarks || "0"}
                </div>
              </div> */}
            </div>
            <Card className="bg-gray-100 border-2 mt-4" bodyClass="p-3 sm:p-[1.25rem]">
              <div>
                {sectionData?.content?.map((info, index) => {
                  return (
                    <>
                      <div>
                        {info?.type === "quiz" ? (
                          <>
                            <QuizCard
                              assessmentId={sectionData._id}
                              quizData={info?.data}
                              quizIndex={index + 1}
                              setApiFlag={setApiFlag}
                            />
                          </>
                        ) : (
                          <>
                            <ExerciseCard />
                          </>
                        )}
                      </div>
                    </>
                  );
                })}
                {sectionData?.content?.length ? <></> : <></>}
              </div>
              <div
                className={`mt-4 p-2 flex text-${themeColor}-${primaryColorLevel} border-2 border-dashed border-gray-400 rounded-lg  bg-gray-50`}
              >
                <div>
                  <Button
                    size="md"
                    variant="plain"
                    className={`text-${themeColor}-${primaryColorLevel} text-lg hover:bg-${themeColor}-100`}
                    icon={<HiPlusCircle size={20} />}
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    <span>Quiz</span>
                  </Button>
                  <Button
                    size="md"
                    variant="plain"
                    className={`text-${themeColor}-${primaryColorLevel} text-lg hover:bg-${themeColor}-100`}
                    icon={<HiPlusCircle size={20} />}
                    onClick={() => {}}
                  >
                    <span>Coding Exercise</span>
                  </Button>
                </div>
              </div>
            </Card>
          </Card>
        </>
      ) : (
        <></>
      )}
      <Dialog
        isOpen={IsOpen}
        // style={{
        //   content: {
        //     marginTop: 250,
        //   },
        // }}
        contentClassName="pb-0 px-0"
        onClose={() => {
          setIsOpen(false);
          setError("");
          setFormData({
            ...formData,
            title: "",
            description: [],
          });
        }}
        onRequestClose={() => {
          setIsOpen(false);
          setError("");
          setFormData({
            ...formData,
            title: "",
            description:[],
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
                  placeholder="Please Enter Assessment Name"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value,
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
                      time: e.target.value,
                    });
                  }}
                  value={formData?.time}
                />
              </div>
            </div>
            {/* Quiz Instructions */}
            <div className="col-span-1 gap-4 mb-4">
              <div
                className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
              >
                Instructions
              </div>
              <div className="col-span-2">
                {formData?.description?.map((description, index) => (
                  <div className="flex gap-4 col-span-2 mt-2" key={index}>
                    <Input
                      type="text"
                      placeholder={`Enter Quiz Instruction ${index + 1}`}
                      value={description}
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                    />
                    {formData?.description?.length > 1 && (
                      <Button
                        shape="circle"
                        icon={<MdDelete />}
                        onClick={() => removeDescription(index)}
                      />
                    )}
                  </div>
                ))}
                <Button type="button" onClick={addDescription} className="mt-2">
                  Add New Instruction
                </Button>
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
                      isPublish: !e,
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
                description: "",
              });
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={onHandleQuizBox} loading={isLoading}>
            Next
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default AssessmentForm;
