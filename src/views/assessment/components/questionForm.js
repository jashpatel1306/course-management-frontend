import axiosInstance from "apiServices/axiosInstance";
import { FormNumericInput } from "components/shared";
import { Button, Card, Input, InputGroup, Radio } from "components/ui";
import Addon from "components/ui/InputGroup/Addon";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { HiOutlineTrash, HiPlus } from "react-icons/hi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import openNotification from "views/common/notification";
// import './customQuillStyles.css'; // Assuming your styles are in this file
const questionModules = {
  toolbar: [["bold", "italic", "image", "code"]],
};
const answerModules = {
  toolbar: [["bold", "italic", "code"]],
};

function QuestionForm(props) {
  const { quizId, setAddQuestion, questionData,setApiFlag } = props;
  console.log("questionData:  ", questionData);
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [activeAnswerIndex, setActiveAnswerIndex] = useState(null);
  const [question, setQuestion] = useState(
    questionData?.question ? questionData?.question : ""
  );
  const [questionMark, setQuestionMark] = useState(
    questionData?.marks ? questionData?.marks : null
  );
  const [answers, setAnswers] = useState(
    questionData?.answers?.length > 0
      ? questionData?.answers?.map((info) => {
          return {
            content: info.content,
            correct: info.correct,
            reason: info.reason,
          };
        })
      : [
          {
            content: "",
            correct: false,
            reason: "",
          },
        ]
  );
  const [isLoading, setIsLoading] = useState(false);
  const handleAnswerFocus = (index) => {
    setActiveAnswerIndex(index);
  };

  const handleAnswerChange = (key, value, index) => {
    const updatedAnswers = answers.map((answer, i) => {
      if (key === "correct") {
        return { ...answer, correct: i === index };
      }
      return i === index ? { ...answer, [key]: value } : answer;
    });
    setAnswers(updatedAnswers);
  };
  console.log("answers: ", answers);
  const addAnswer = () => {
    setAnswers([...answers, { content: "", correct: false, reason: "" }]);
  };

  const deleteAnswer = (index) => {
    if (answers.length > 1) {
      const updatedAnswers = answers.filter((_, i) => i !== index);
      setAnswers(updatedAnswers);
    } else {
      openNotification("danger", "At least one answer is required.");
    }
  };
  const addUpdateQuestion = async (formData) => {
    try {
      setIsLoading(true);

      // Construct the data to be sent, assuming `formData` contains the question details
      const response = questionData?._id
        ? await axiosInstance.put(
            `user/question/${questionData?._id}`,
            formData
          )
        : await axiosInstance.post(`user/question`, formData);

      if (response?.success && response?.data?._id) {
        openNotification("success", "Question saved successfully!");
        console.log("Question added with ID: ", response.data._id);
        setAddQuestion(false);
        setApiFlag(true);
      } else {
        openNotification(
          "danger",
          response.data.message || "Failed to add question."
        );
      }
    } catch (error) {
      console.log("addQuestion error: ", error);
      openNotification(
        "danger",
        error.message || "An error occurred while adding the question."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleSave = () => {
    try {
      if (!question.trim()) {
        openNotification("danger", "Question cannot be empty.");
        return;
      }

      if (questionMark <= 0) {
        openNotification("danger", "Question mark must be greater than zero.");
        return;
      }

      if (
        answers.length === 0 ||
        answers.some((answer) => !answer.content.trim())
      ) {
        openNotification("danger", "Each answer must have content.");
        return;
      }

      if (!answers.some((answer) => answer.correct)) {
        openNotification("danger", "Please select a correct answer.");
        return;
      }
      const formData = {
        question: question,
        answers: answers,
        marks: questionMark,
        quizId: quizId,
      };
      console.log("formData: ", formData);
      addUpdateQuestion(formData);
    } catch (error) {
      console.log("handleSave Error :", handleSave);
    }
  };
  return (
    <>
      <Card className="mt-4 px-4 border">
        <div className="mb-6">
          <div className="flex justify-between text-gray-700 items-center text-lg font-bold mb-3">
            <div>Question</div>
            <div>
              <InputGroup className="mb-4">
                <FormNumericInput
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-"]?.includes(evt.key) &&
                    evt.preventDefault()
                  }
                  className={"w-16"}
                  //   className={
                  //     errorData.batchNumber ? "select-error w-16" : "w-16"
                  //   }
                  value={questionMark}
                  onChange={(e) => {
                    setQuestionMark(e.target.value);
                  }}
                />
                <Addon>Marks</Addon>
              </InputGroup>
            </div>
          </div>

          <ReactQuill
            value={question}
            onChange={setQuestion}
            modules={questionModules}
            theme="snow"
            placeholder="Add your question here..."
            className="bg-white"
          />
        </div>
        <div>
          <div className="block text-gray-700 text-lg font-bold mb-3">
            Options
          </div>
        </div>
        {answers?.length &&
          answers?.map((answer, index) => (
            <div key={index} className="mb-6">
              <div className="flex gap-2 items-start mb-2">
                <Radio
                  type="radio"
                  name="correct"
                  className="mt-2"
                  onChange={(value) =>
                    handleAnswerChange("correct", true, index)
                  }
                />
                <div className="ml-2 w-full">
                  {activeAnswerIndex === index ? (
                    <ReactQuill
                      value={answer.content}
                      onChange={(value) =>
                        handleAnswerChange("content", value, index)
                      }
                      modules={answerModules}
                      theme="snow"
                      placeholder="Add an answer..."
                      className="bg-white"
                    />
                  ) : (
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                      rows="3"
                      placeholder="Add an answer..."
                      value={answer.content.replace(/<[^>]+>/g, "")}
                      onFocus={() => handleAnswerFocus(index)}
                    ></textarea>
                  )}
                </div>
                <Button
                  shape="circle"
                  className="mt-2 border-2 border-gray-300 text-gray-400"
                  size="sm"
                  icon={<HiOutlineTrash />}
                  onClick={() => deleteAnswer(index)}
                />
              </div>
              <div className="flex justify-end w-full">
                <div className="w-11/12">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                    rows="2"
                    placeholder="Explain why this is or isn't the best answer..."
                    value={answer.reason}
                    onChange={(e) =>
                      handleAnswerChange("reason", e.target.value, index)
                    }
                  ></textarea>
                </div>
              </div>
            </div>
          ))}
        <div className="flex justify-start">
          <Button
            size="md"
            icon={<HiPlus />}
            variant="twoTone"
            className={`mr-2 border border-${themeColor}-${primaryColorLevel}`}
            onClick={addAnswer}
          >
            <span>Answer</span>
          </Button>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="twoTone"
            className={`mr-2 border border-${themeColor}-${primaryColorLevel}`}
            onClick={() => {
              setAddQuestion(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" isLoading={isLoading} onClick={handleSave}>
            Save
          </Button>
        </div>
      </Card>
    </>
  );
}

export default QuestionForm;
