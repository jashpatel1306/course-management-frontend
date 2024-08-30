import axiosInstance from "apiServices/axiosInstance";
import { Button, Card, Dialog, Input } from "components/ui";
import React, { useState } from "react";
import { FaCheckCircle, FaFile, FaPlus } from "react-icons/fa";
import { HiOutlinePencil } from "react-icons/hi";
import { useSelector } from "react-redux";
import openNotification from "views/common/notification";
import DisplayError from "views/common/displayError";
import QuestionsList from "./questionList";
import QuestionForm from "./questionForm";

const QuizCard = (props) => {
  const { assessmentId, quizData, quizIndex,setApiFlag} = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [formData, setFormData] = useState({
    title: "Assessments-1",
    description: "",
    assessmentId: assessmentId,
    quizId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [IsOpen, setIsOpen] = useState(false);
  const [addQuestion, setAddQuestion] = useState(false);
  const [questionData, setQuestionData] = useState();

  const [error, setError] = useState("");
  const UpdateQuiz = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`user/quiz`, formData);
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
        ...formData,
        title: "",
        description: "",
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
      if (!formData?.title) {
        setError("Please Enter Quiz Title.");
      }

      if (formData?.title) {
        UpdateQuiz();
        setApiFlag(true);
        setError("");
        setIsOpen(false);
        setFormData({
          ...formData,
          title: "",
          description: "",
          quizId: null,
        });
      }
    } catch (error) {
      console.log("onHandleQuizBox error :",error);
    }
  };
  return (
    <>
      <Card className="bg-gray-50 border-2 mb-3">
        <div
          className={`flex justify-between items-center text-lg font-semibold gap-2 text-${themeColor}-${primaryColorLevel}`}
        >
          <div className="flex items-center gap-2">
            <FaCheckCircle />

            <div>Quiz {quizIndex} :</div>

            <FaFile />

            <div
              className="flex capitalize gap-4 items-center"
              onClick={() => {
                setFormData({
                  title: quizData.title,
                  description: quizData.description,
                  assessmentId: assessmentId,
                  quizId: quizData._id,
                });
                setIsOpen(true);
              }}
            >
              {quizData.title}
              <div>
                <HiOutlinePencil />
              </div>
            </div>
          </div>
          <div className="flex gap-2 ">
            <div
              className={`flex items-center text-base font-semibold text-${themeColor}-${primaryColorLevel} px-3 p-1 rounded-lg border border-${themeColor}-${primaryColorLevel}`}
            >
              Total Marks : {quizData?.totalMarks || "0"}
            </div>
            <Button
              className="mr-2"
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
              quizId={quizData._id}
              setAddQuestion={setAddQuestion}
              questionData={questionData}
              setApiFlag={setApiFlag}
            />
          ) : (
            <QuestionsList
              quizData={quizData}
              setAddQuestion={setAddQuestion}
              setQuestionData={setQuestionData}
              setApiFlag={setApiFlag}
            />
          )}
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
            ...formData,
            title: "",
            description: "",
            quizId: null,
          });
        }}
        onRequestClose={() => {
          setIsOpen(false);
          setError("");
          setFormData({
            ...formData,
            title: "",
            description: "",
            quizId: null,
          });
        }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Quiz Details
          </h5>
          {/* Assessment Name  */}
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
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Description
            </div>
            <div className="col-span-2">
              <Input
                textArea
                type="text"
                placeholder="Enter a Quiz Description"
                value={formData?.description}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  });
                }}
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
              setFormData({
                ...formData,
                title: "",
                description: "",
                quizId: null,
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

export default QuizCard;
