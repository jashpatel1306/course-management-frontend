import { FormNumericInput } from "components/shared";
import { Button, Card, Input, InputGroup, Radio } from "components/ui";
import Addon from "components/ui/InputGroup/Addon";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { HiOutlineTrash, HiPlus } from "react-icons/hi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
// import './customQuillStyles.css'; // Assuming your styles are in this file

function QuestionForm() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([{}, {}, {}, {}]);
  const [activeAnswerIndex, setActiveAnswerIndex] = useState(null);
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const handleAnswerFocus = (index) => {
    setActiveAnswerIndex(index);
  };

  const handleAnswerChange = (value, index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const questionModules = {
    toolbar: [["bold", "italic", "image", "code"]],
  };
  const answerModules = {
    toolbar: [["bold", "italic", "code"]],
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
                  onChange={(e) => {
                    // setFormData({
                    //   ...formData,
                    //   batchNumber: e.target.value,
                    // });
                  }}
                  //   value={formData?.batchNumber}
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
        {answers.map((answer, index) => (
          <div key={index} className="mb-6">
            <div className="flex gap-2 items-start mb-2">
              <Radio type="radio" name="answer" className="mt-2" />
              <div className="ml-2 w-full">
                {activeAnswerIndex === index ? (
                  <ReactQuill
                    value={answer}
                    onChange={(value) => handleAnswerChange(value, index)}
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
                    onFocus={() => handleAnswerFocus(index)}
                  ></textarea>
                )}
              </div>
              <Button
                shape="circle"
                // color="red-700"
                className="mt-2 border-2 border-gray-300 text-gray-400"
                // variant="solid"
                size="sm"
                icon={<HiOutlineTrash />}
                onClick={() => {
                  // setSelectObject(item);
                  // setDeleteIsOpen(true);
                }}
              />
            </div>
            <div className="flex justify-end w-full">
              <div className="w-11/12">
                {/* <Input
                className="h-12"
                placeholder="Explain why this is or isn't the best answer..."
                textArea
              /> */}
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                  rows="2"
                  placeholder="Explain why this is or isn't the best answer..."
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
          >
            <span>Answer</span>
          </Button>
        </div>
        <div className="flex justify-end">
          <Button variant="solid">Save</Button>
        </div>
      </Card>
    </>
  );
}

export default QuestionForm;
