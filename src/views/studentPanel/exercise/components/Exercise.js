/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Input, Spinner } from "components/ui";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import { useParams } from "react-router-dom";
import { FaQuestionCircle } from "react-icons/fa";
import Logo from "components/template/Logo";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";

export const Exercise = (props) => {
  const { questions, exerciseData, setResults, setDisplayView, results } =
    props;
  const mode = useSelector((state) => state.theme.mode);

  const { exerciseId } = useParams();
  const [questionData, setQuestionData] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  const [isQusLoading, setIsQusLoading] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [exerciseFinished, setExerciseFinished] = useState(false);
  const [nextButton, setNextButton] = useState(false);
  const [fillAnswer, setFillAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [questionStatus, setQuestionStatus] = useState([]);
  const numberOfQuestions = questions.length;

  const fetchQuestionData = async (questionId) => {
    try {
      setIsQusLoading(true);
      const response = await axiosInstance.get(
        `student/exercise-question/${questionId}`
      );
      if (response.success) {
        const findStatus = questionStatus.find(
          (info) => info.questionId === questionId
        );
        if (findStatus && findStatus?.questionId && findStatus?.answer) {
          setFillAnswer(findStatus.answer);
        } else {
          setFillAnswer("");
        }
        setQuestionData(response.data);
        setIsQusLoading(false);
      } else {
        openNotification("danger", response.message);
        setIsQusLoading(false);
      }
    } catch (error) {
      console.log("Update Exercise Question Data error:", error);
      openNotification("danger", error.message);
      setIsQusLoading(false);
    }
  };
  const UpdateExerciseQuestionData = async (questionId, answerId) => {
    try {
      const response = await axiosInstance.put(
        `student/exercise/update/${exerciseId}`,
        {
          questionId,
          answerId,
          trackingId: exerciseData.trackingId,
          isSubmit: activeQuestion + 1 >= questions.length ? true : false
        }
      );
      if (response.success) {
        setFillAnswer("");
        setNextButton(false);
        if (activeQuestion + 1 >= questions.length) {
          //Exercise finished!
          setResults({
            ...results
          });

          // playExerciseEnd();

          setExerciseFinished(true);
          return;
        }
        setQuestionStatus(response?.data?.result);
        // Set next question
        setActiveQuestion((prev) => prev + 1);
        // setIsLoading(false);
      } else {
        openNotification("danger", response.message);
        setSelectedAnswerIndex(-1);
        setFillAnswer("");

        // setIsLoading(false);
        setNextButton(false);
      }
    } catch (error) {
      console.log("Update Exercise Question Data error:", error);
      openNotification("danger", error.message);
      // setIsLoading(false);
    }
  };
  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch (_) {
      return false;
    }
  };
  const handleNextQuestion = async () => {
    if (fillAnswer && isValidUrl(fillAnswer)) {
      setErrorMessage("");
      await UpdateExerciseQuestionData(questionData._id, fillAnswer);
    } else {
      if (!isValidUrl(fillAnswer)) {
        setErrorMessage("Please Enter a Valid URL.");
      } else {
        setErrorMessage("Please Enter URL");
      }
    }
  };
  const handleBackQuestion = async () => {
    setActiveQuestion((prev) => prev - 1);
  };
  const handleSkipQuestion = async () => {
    setActiveQuestion((prev) => prev + 1);
  };

  if (exerciseFinished) {
    setDisplayView("result");
  }

  useEffect(() => {
    fetchQuestionData(questions[activeQuestion]);
  }, [activeQuestion]);
  useEffect(() => {
    if (fillAnswer) {
      setNextButton(true);
    }
    if (selectedAnswerIndex !== -1) {
      setNextButton(true);
    }
  }, [fillAnswer, selectedAnswerIndex]);

  return (
    <>
      <motion.div
        key={"countdown"}
        variants={{
          initial: {
            background: "#666769",
            clipPath: "circle(0% at 50% 50%)"
          },
          animate: {
            background: "#ffffff",
            clipPath: "circle(100% at 50% 50%)"
          }
        }}
        className="w-full h-full flex justify-center relative"
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
      >
        <>
          <div className="w-full">
            {/* exercise hearder */}
            <div className="h-[90px] flex justify-between items-center px-6 bg-gray-600 text-white p-2 py-3">
              <div className="flex items-center gap-4">
                <Logo mode={mode} className="hidden md:block" />
                <div className="font-bold text-sm md:text-lg ">
                  {exerciseData?.title}
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex gap-2 items-center border-2 p-1 rounded-xl px-4">
                  <span className="text-sm md:text-lg">
                    <FaQuestionCircle size={18} />
                  </span>
                  <span className="text-sm md:text-lg">Question</span>
                  <span className="text-sm md:text-lg">:</span>
                  <span className="text-sm md:text-lg">
                    {" "}
                    {activeQuestion + 1} / {numberOfQuestions}
                  </span>
                </div>
              </div>
            </div>

            {/* exercise main content */}

            <div className="flex h-[calc(100vh-160px)] flex-col md:flex-row">
              <div className="w-full md:max-w-[260px] overflow-y-scroll hidden-scroll py-8 border-r border-gray-500">
                <div className="flex flex-col items-center space-y-4">
                  <h2 className="text-lg font-bold">{exerciseData?.title}</h2>
                  <div className="grid grid-cols-10 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {questions.map((item, index) => {
                      const findStatus = questionStatus.some(
                        (info) => info.questionId === item
                      );
                      return (
                        <>
                          <div
                            key={item}
                            className={`w-8 h-8 flex items-center justify-center border rounded-full cursor-pointer ${
                              activeQuestion === index
                                ? "bg-gray-500 text-white"
                                : findStatus
                                ? "bg-green-500 text-white"
                                : "border-gray-300"
                            }`}
                            onClick={() => {
                              setActiveQuestion(index);
                            }}
                          >
                            {index + 1}
                          </div>
                        </>
                      );
                    })}
                  </div>
                  <div className="mt-4  gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-white border border-gray-300 rounded-full"></div>
                      <span className="text-sm">Unanswered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Answered</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-[70%] overflow-y-scroll hidden-scroll p-8">
                {isQusLoading ? (
                  <>
                    <div className="flex justify-center items-center">
                      <Spinner className="mr-4" color="grzy-900" size="40px" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <p className="px-4 p-1 capitalize rounded-lg border-2 border-gray-600 text-base font-semibold">
                          Question : Exercise
                        </p>
                        {/* <Button
                          size="xs"
                          shape="circle"
                          icon={<FaInfo />}
                          className="border-2 border-gray-600"
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        /> */}
                      </div>

                      <p className="px-4 p-1 capitalize rounded-lg border-2 border-gray-600 text-base font-semibold">
                        {`${questionData?.marks}  Marks`}
                      </p>
                    </div>
                    <div className=" pt-2 pb-8">
                      <div className="mt-2 rounded-xl border-2 border-gray-600 px-7 py-4 w-full mb-4 ">
                        <h4 className="text-gray-700 font-semibold text-lg select-none">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: questionData?.question
                            }}
                          ></span>
                        </h4>
                      </div>
                      <div className="mt-2 rounded-xl border-2 border-gray-600 px-7 py-2 w-full mb-4 ">
                        <h2 class="text-lg font-bold text-gray-800 mb-2">
                          Coding Task Instructions (Using CodeSandbox)
                        </h2>
                        <ol class="list-decimal pl-6 space-y-1 text-gray-700 font-medium leading-relaxed">
                          <li>
                            <span class="font-semibold text-gray-900">
                              Go to:
                            </span>
                            👉
                            <a
                              href="https://codesandbox.io"
                              target="_blank"
                              class="text-blue-600 hover:underline font-semibold"
                              rel="noreferrer"
                            >
                              https://codesandbox.io
                            </a>
                          </li>
                          <li>
                            <span class="font-semibold text-gray-900">
                              Create a Sandbox:
                            </span>
                            Click on <em>"Create Sandbox"</em> or{" "}
                            <em>"New Sandbox"</em>.
                          </li>
                          <li>
                            <span class="font-semibold text-gray-900">
                              Select Environment:
                            </span>
                            Choose the appropriate environment based on the
                            question requirements (e.g., HTML, React, Node.js).
                          </li>
                          <li>
                            <span class="font-semibold text-gray-900">
                              Write and Test:
                            </span>
                            Write your code in the editor and test it using the
                            live preview.
                          </li>
                          <li>
                            <span class="font-semibold text-gray-900">
                              Share the Project:
                            </span>
                            Click on the <em>"Share"</em> button located at the
                            top-right of the page.
                          </li>
                          <li>
                            <span class="font-semibold text-gray-900">
                              Copy Link:
                            </span>
                            Copy the generated shareable link.
                          </li>
                          <li>
                            <span class="font-semibold text-gray-900">
                              Submit the Link:
                            </span>
                            Paste the copied link into the answer box provided
                            under the question.
                          </li>
                          <li>
                            <span class="font-semibold text-gray-900">
                              Click Submit:
                            </span>
                            Hit <strong>"Submit"</strong> to proceed to the next
                            question.
                          </li>
                        </ol>
                      </div>
                      <Input
                        placeholder="Wrtie Your Public Link Here"
                        value={fillAnswer}
                        className="focus:ring-gray-600 focus-within:ring-gray-600 focus-within:border-gray-600 focus:border-gray-600 mt-2 rounded-xl border-2 border-gray-600 "
                        onChange={(e) => {
                          console.log("e.target.valu: ", e.target.value);
                          setFillAnswer(e.target.value);
                        }}
                      />
                      {DisplayError(errorMessage)}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* exercise footer */}
            <div className="h-[70px] w-full flex justify-between items-center px-6 bg-gray-200 text-white p-2 py-3">
              <div className="flex gap-4">
                {activeQuestion + 1 >= questions.length ? (
                  <></>
                ) : (
                  <Button
                    variant="solid"
                    color="gray-600"
                    disabled={activeQuestion + 1 >= questions.length}
                    className="max-w-48 md:w-48"
                    onClick={handleSkipQuestion}
                    // loading={isLoading}
                  >
                    Skip
                  </Button>
                )}
              </div>

              <div className="flex gap-4 items-center text-lg">
                {activeQuestion >= questions.length ? (
                  <></>
                ) : (
                  <Button
                    variant="solid"
                    color="gray-600"
                    className="max-w-48 md:w-48"
                    onClick={handleBackQuestion}
                    // loading={isLoading}
                  >
                    Back
                  </Button>
                )}
                <Button
                  variant="solid"
                  color="gray-600"
                  disabled={!nextButton}
                  className="max-w-48 md:w-48"
                  onClick={handleNextQuestion}
                  // loading={isLoading}
                >
                  {activeQuestion + 1 >= questions.length
                    ? "Submit Test"
                    : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </>
      </motion.div>
      {/* <Dialog
        isOpen={dialogIsOpen}
        bodyOpenClassName="overflow-hidden"
        onClose={() => {
          setIsOpen(false);
        }}
        onRequestClose={() => {
          setIsOpen(false);
        }}
      >
          <h2 class="text-lg font-bold text-gray-800 mb-4">
            How to Share a Public CodeSandbox Project
          </h2>
          <ol class="list-decimal pl-6 space-y-4 text-gray-700 font-medium leading-relaxed">
            <li>
              <span class="font-semibold text-gray-900">Open CodeSandbox:</span>{" "}
              Go to 👉
              <a
                href="https://codesandbox.io"
                target="_blank"
                class="text-blue-600 hover:underline font-semibold"
                rel="noreferrer"
              >
                https://codesandbox.io
              </a>
              . Log in with Google, GitHub, or email if you’re not already
              signed in.
            </li>
            <li>
              <span class="font-semibold text-gray-900">
                Create a New Sandbox:
              </span>{" "}
              Click <em>“Create Sandbox”</em> or the <em>“+ New Sandbox”</em>{" "}
              button on the dashboard. In the template list, scroll down or
              search.
            </li>
            <li>
              <span class="font-semibold text-gray-900">
                Preview Your Project:
              </span>{" "}
              Click the “Preview” panel on the right or bottom to see your live
              project.
            </li>
            <li>
              <span class="font-semibold text-gray-900">
                Make the Project Public:
              </span>{" "}
              Click the “Share” button in the top-right. Under Visibility,
              change it to <strong>Public</strong>. If prompted, confirm the
              change.
            </li>
            <li>
              <span class="font-semibold text-gray-900">
                Copy the Public Link:
              </span>{" "}
              In the Share popup, copy the URL (e.g.,
              <code class="bg-gray-100 text-sm px-1 rounded text-gray-800">
                https://codesandbox.io/s/html-tailwind-demo-xyz
              </code>
              ). You can now share this link with anyone.
            </li>
          </ol>
        
      </Dialog> */}
    </>
  );
};
