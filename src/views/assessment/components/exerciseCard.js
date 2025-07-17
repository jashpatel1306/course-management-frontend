import axiosInstance from "apiServices/axiosInstance";
import { Button, Card, Dialog, Input, Switcher } from "components/ui";
import React, { useState } from "react";
import { FaCheckCircle, FaFile, FaPlus } from "react-icons/fa";
import { HiOutlinePencil } from "react-icons/hi";
import { useSelector } from "react-redux";
import openNotification from "views/common/notification";
import DisplayError from "views/common/displayError";
import QuestionsList from "./exerciseQuestionList";
import QuestionForm from "./exerciseQuestionForm";
import { MdDelete } from "react-icons/md";

const ExerciseCard = (props) => {
  const { assessmentId, exerciseData, exerciseIndex, setApiFlag } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [formData, setFormData] = useState({
    title: "",
    description: [],
    assessmentId: assessmentId,
    isPublish: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [IsOpen, setIsOpen] = useState(false);
  const [addQuestion, setAddQuestion] = useState(false);
  const [questionData, setQuestionData] = useState();

  const [error, setError] = useState("");
  const UpdateExercise = async (apiData) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.put(
        `user/exercise/${apiData.exerciseId}`,
        apiData
      );
      if (response?.success && response?.data?._id) {
        openNotification("success", response.message);
        // setSectionData(response.data);
        setIsOpen(false);
        setApiFlag(true);
        setError("");
      } else {
        openNotification("danger", response.message);
      }
      setFormData({
        ...apiData,
        title: "",
        description: [""],
        isPublish: false
      });
    } catch (error) {
      console.log("onFormSubmit error: ", error);
      openNotification("danger", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const onHandleExerciseBox = async () => {
    try {
      if (!formData?.description?.length) {
        setError("Please Enter At Least One Instruction");
      }
      if (!formData?.title) {
        setError("Please Enter Exercise Title.");
      }
      if (formData?.title && formData?.description?.length) {
        UpdateExercise({
          title: formData?.title,
          description: formData?.description,
          assessmentId: formData?.assessmentId,
          exerciseId: formData?.exerciseId,
          isPublish: formData?.isPublish
        });
        setApiFlag(true);
        setError("");
        setIsOpen(false);
        setFormData({
          ...formData,
          title: "",
          description: [""],
          isPublish: false,
          exerciseId: null
        });
      }
    } catch (error) {
      console.log("onHandleExerciseBox error :", error);
    }
  };
  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...formData.description];
    newDescriptions[index] = value;
    setFormData({
      ...formData,
      description: newDescriptions
    });
  };
  const addDescription = () => {
    setFormData({
      ...formData,
      description: [...formData.description, ""] // Add new empty description
    });
  };
  const removeDescription = (index) => {
    const newDescriptions = formData.description.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      description: newDescriptions
    });
  };
  console.log("formData:,", formData);
  return (
    <>
      <Card className="bg-gray-50 border-2 mb-3" bodyClass="p-3 sm:p-[1.25rem]">
        <div
          className={`flex flex-col lg:flex-row justify-between items-center text-lg font-semibold gap-2 text-${themeColor}-${primaryColorLevel} mb-2`}
        >
          <div className="flex items-center gap-2">
            <FaCheckCircle />

            <div>Exercise {exerciseIndex} :</div>

            <FaFile />

            <div
              className="flex capitalize gap-4 items-center"
              onClick={() => {
                setFormData({
                  title: exerciseData.title,
                  description: exerciseData.description,
                  isPublish: exerciseData.isPublish,
                  assessmentId: assessmentId,
                  exerciseId: exerciseData._id
                });
                setIsOpen(true);
              }}
            >
              {exerciseData.title}
              <div>
                <HiOutlinePencil />
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div
              className={`flex items-center text-base font-semibold text-${themeColor}-${primaryColorLevel} px-3 p-1 rounded-lg border border-${themeColor}-${primaryColorLevel}`}
            >
              Total Marks : {exerciseData?.totalMarks || "0"}
            </div>
            <Button
              className="mr-2"
              size="sm"
              icon={<FaPlus />}
              onClick={() => {
                setAddQuestion(true);
              }}
            >
              <span>Questions</span>
            </Button>
          </div>
        </div>

        <div>
          {addQuestion ? (
            <QuestionForm
              exerciseId={exerciseData._id}
              setAddQuestion={setAddQuestion}
              questionData={questionData}
              setApiFlag={setApiFlag}
            />
          ) : (
            <QuestionsList
              exerciseData={exerciseData}
              setAddQuestion={setAddQuestion}
              setQuestionData={setQuestionData}
              setApiFlag={setApiFlag}
            />
          )}
        </div>
      </Card>
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
            exerciseId: null
          });
        }}
        onRequestClose={() => {
          setIsOpen(false);
          setError("");
          setFormData({
            ...formData,
            title: "",
            description: [""],
            exerciseId: null
          });
        }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Exercise Details
          </h5>
          <div className="max-h-96 overflow-y-auto hidden-scroll">
            {/* Exercise Name  */}
            <div className="col-span-1 gap-4 mb-4">
              <div
                className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
              >
                Exercise Title
              </div>
              <div className="col-span-2">
                <Input
                  type="text"
                  placeholder="Please Enter Exercise Name"
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
            {/* Exercise Instructions */}
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
                      placeholder={`Enter Exercise Instruction ${index + 1}`}
                      value={description}
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                    />
                    {formData.description.length > 1 && (
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
            {/* Exercise Publish Status */}
            <div className="col-span-1 gap-4 mb-4">
              <div
                className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
              >
                Exercise Publish Status
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
                exerciseId: null
              });
            }}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={onHandleExerciseBox}
            loading={isLoading}
          >
            Update
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default ExerciseCard;
