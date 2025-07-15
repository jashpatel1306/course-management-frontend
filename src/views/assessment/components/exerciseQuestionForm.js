import axiosInstance from "apiServices/axiosInstance";
import { FormNumericInput } from "components/shared";
import { Button, Card, InputGroup } from "components/ui";
import Addon from "components/ui/InputGroup/Addon";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { generateHtml } from "utils/textToHtmlConverter";
import openNotification from "views/common/notification";
// import './customQuillStyles.css'; // Assuming your styles are in this file
const questionModules = {
  toolbar: {
    container: ["bold", "italic", "image", "code"]
    // handlers: {
    //   image: handleImageUpload
    // }
  }
};
function QuestionForm(props) {
  const { exerciseId, setAddQuestion, questionData, setApiFlag } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  const [question, setQuestion] = useState(
    questionData?.questionType?.trim()?.toUpperCase() === "CODE"
      ? generateHtml(questionData?.question)
      : questionData?.question
  );

  const [questionMark, setQuestionMark] = useState(
    questionData?.marks ? questionData?.marks : null
  );
  const cleanForm = () => {
    setQuestion("");
    setQuestionMark(null);
  };
  const [isLoading, setIsLoading] = useState(false);

  const addUpdateQuestion = async (formData) => {
    try {
      setIsLoading(true);

      // Construct the data to be sent, assuming `formData` contains the question details
      const response = questionData?._id
        ? await axiosInstance.put(
            `user/equestion/${questionData?._id}`,
            formData
          )
        : await axiosInstance.post(`user/equestion`, formData);

      if (response?.success && response?.data?._id) {
        openNotification("success", "Question saved successfully!");
        setAddQuestion(false);
        setApiFlag(true);
        cleanForm();
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
      console.log("question: ", question);
      console.log("questionMark: ", questionMark);
      if (!question?.trim()) {
        openNotification("danger", "Question cannot be empty.");
        return;
      }

      if (questionMark <= 0) {
        openNotification("danger", "Question mark must be greater than zero.");
        return;
      }
      const formData = {
        question: question,
        marks: questionMark,
        exerciseId: exerciseId
      };
        addUpdateQuestion(formData);
    } catch (error) {
      console.log("handleSave Error :", error);
    }
  };

  return (
    <>
      <Card className="mt-4 md:px-4 border" bodyClass="p-3 sm:p-[1.25rem]">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between text-gray-700 items-start md:items-center text-lg font-bold mb-5">
            <div>Question</div>
            <div className="flex flex-wrap gap-2">
              <InputGroup className="">
                <FormNumericInput
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-"]?.includes(evt.key) &&
                    evt.preventDefault()
                  }
                  className={"w-16"}
                  value={questionMark}
                  onChange={(e) => {
                    setQuestionMark(e.target.value);
                  }}
                />
                <Addon>Marks</Addon>
              </InputGroup>
            </div>
          </div>
          <div className="h-[200px]">
            <ReactQuill
              value={question}
              onChange={setQuestion}
              modules={questionModules}
              theme="snow"
              placeholder="Add your question here..."
              className="bg-white h-[160px]"
            />
          </div>
        </div>

        <div className="flex justify-between md:justify-end gap-2 mt-4 md:mt-0">
          <Button
            variant="twoTone"
            className={`mr-2 border border-${themeColor}-${primaryColorLevel}`}
            onClick={() => {
              cleanForm();
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
