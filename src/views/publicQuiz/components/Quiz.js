/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { OptionList } from "./OptionList";
import { formatTime } from "utils/formatTime";
import { playQuizEnd } from "utils/playSound";
import { Button, Input, Spinner } from "components/ui";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import { useParams } from "react-router-dom";
import { MdTimer } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import Logo from "components/template/Logo";
import { useSelector } from "react-redux";

export const Quiz = (props) => {
  const { questions, quizData, setResults, setDisplayView, results } = props;
  const mode = useSelector((state) => state.theme.mode);

  const { quizId } = useParams();
  const TIME_LIMIT = quizData.totalTime * 60;

  const timerRef = useRef(null);
  const [questionData, setQuestionData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isQusLoading, setIsQusLoading] = useState(true);
  const [timePassed, setTimePassed] = useState(TIME_LIMIT);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [quizFinished, setQuizFinished] = useState(false);
  const [nextButton, setNextButton] = useState(false);
  const [fillAnswer, setFillAnswer] = useState("");
  const [questionStatus, setQuestionStatus] = useState([]);
  const numberOfQuestions = questions.length;
  const setupTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimePassed((prevTimePassed) => {
        // console.log("TIME_LIMIT :", TIME_LIMIT);
        // console.log("prevTimePassed :", prevTimePassed);
        // console.log(
        //   "result :",
        //   prevTimePassed > TIME_LIMIT ? TIME_LIMIT : prevTimePassed - 1
        // );
        if (prevTimePassed > TIME_LIMIT) {
          return TIME_LIMIT;
        } else {
          if (prevTimePassed - 1 > 0) {
            return prevTimePassed - 1;
          } else {
            // playQuizEnd();
            setQuizFinished(true);
            return 0;
          }
        }
      });
    }, 1000);
  };

  const fetchQuestionData = async (questionId) => {
    setSelectedAnswerIndex(-1);
    try {
      setIsQusLoading(true);
      const response = await axiosInstance.get(
        `user/public-question/${questionId}`
      );
      if (response.success) {
        const findStatus = questionStatus.find(
          (info) => info.questionId === questionId
        );
        if (findStatus && findStatus?.questionId && findStatus?.fillAnswer) {
          setFillAnswer(findStatus.fillAnswer);
        }
        if (findStatus && findStatus?.questionId && findStatus?.answerId) {
          setSelectedAnswerIndex(findStatus?.answerId);
        }
        setQuestionData(response.data);
        setIsQusLoading(false);
      } else {
        openNotification("danger", response.message);
        setIsQusLoading(false);
      }
    } catch (error) {
      console.log("Update Quiz Question Data error:", error);
      openNotification("danger", error.message);
      setIsQusLoading(false);
    }
  };
  const UpdateQuizQuestionData = async (questionId, answerId, questionType, goToNextQuestion = true) => {
    try {
      setIsLoading(true);
      // console.log(
      //   "Math.floor(TIME_LIMIT - timePassed / 60): ",
      //   TIME_LIMIT,
      //   timePassed,
      //   Math.floor(TIME_LIMIT - timePassed / 60)
      // );
      const response = await axiosInstance.put(
        `student/quiz/update/${quizId}`,
        {
          questionId,
          answerId,
          time: TIME_LIMIT - timePassed,
          questionType: questionType,
          trackingId: results.trackingId
          // trackingId: "67709b4f0e58c4db70cdb1bd"
        }
      );
      if (response.success) {
        setSelectedAnswerIndex(-1);
        setFillAnswer("");
        setNextButton(false);
        if (goToNextQuestion && activeQuestion + 1 >= questions.length) {
          //Quiz finished!
          setResults({
            ...results,
            correctAnswers: response?.data?.correctAnswers,
            wrongAnswers: response?.data?.wrongAnswers,
            secondsUsed: response?.data?.totalTime
          });

          // playQuizEnd();

          setQuizFinished(true);
          return;
        }
        setQuestionStatus(response?.data?.result);
        // Set next question
        if (goToNextQuestion) {
          setActiveQuestion((prev) => prev + 1);
        }
        setIsLoading(false);
      } else {
        openNotification("danger", response.message);
        setSelectedAnswerIndex(-1);
        setFillAnswer("");

        setIsLoading(false);
        setNextButton(false);
      }
    } catch (error) {
      console.log("Update Quiz Question Data error:", error);
      openNotification("danger", error.message);
      setIsLoading(false);
    }
  };
  const handleNextQuestion = async () => {
    if (questionData.questionType?.toLowerCase() === "fill" && fillAnswer) {
      await UpdateQuizQuestionData(
        questionData._id,
        fillAnswer,
        questionData.questionType
      );
    }
    if (
      questionData.questionType?.toLowerCase() === "mcq" &&
      selectedAnswerIndex
    ) {
      await UpdateQuizQuestionData(
        questionData._id,
        selectedAnswerIndex,
        questionData.questionType
      );
    }
    //
  };

  const handleActiveQuestionChange = async (questionIndex) => {
    if (selectedAnswerIndex !== -1) {
      if (questionData.questionType?.toLowerCase() === "fill" && fillAnswer) {
        await UpdateQuizQuestionData(
          questionData._id,
          fillAnswer,
          questionData.questionType,
          false
        );
      }
      if (
        questionData.questionType?.toLowerCase() === "mcq" &&
        selectedAnswerIndex
      ) {
        await UpdateQuizQuestionData(
          questionData._id,
          selectedAnswerIndex,
          questionData.questionType,
          false
        );
      }
    }
    setActiveQuestion(questionIndex);
  };

  const handleBackQuestion = async () => {
    setActiveQuestion((prev) => prev - 1);
    setSelectedAnswerIndex(-1);
    setNextButton(false);
  };
  const handleSkipQuestion = async () => {
    setActiveQuestion((prev) => prev + 1);
  };

  const handleSelectAnswer = (answerIndex) => {
    //  Stop timer
    // clearInterval(timerRef.current);
    setSelectedAnswerIndex(answerIndex);
  };

  if (quizFinished) {
    setDisplayView("result");
  }

  useEffect(() => {
    if (quizFinished) return;

    setupTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizFinished]);

  useEffect(() => {
    if (quizFinished) return;
    if (timePassed > TIME_LIMIT) {
      setResults((prev) => ({
        ...prev,
        secondsUsed: prev.secondsUsed + TIME_LIMIT,
        wrongAnswers: prev.wrongAnswers + 1
      }));
      setQuizFinished(true);
    }
  }, [timePassed]);
  useEffect(() => {
    fetchQuestionData(questions[activeQuestion]);
  }, [activeQuestion]);
  useEffect(() => {
    console.log("fillAnswer", fillAnswer, selectedAnswerIndex);
    if (fillAnswer) {
      setNextButton(true);
    }
    if (selectedAnswerIndex !== -1) {
      setNextButton(true);
    }
  }, [fillAnswer, selectedAnswerIndex]);

  // const answered = [2]; // Example answered questions

  // const answeredAndMarked = []; // Example answered and marked questions

  // const getStatusClass = (number) => {
  //   if (answeredAndMarked.includes(number)) return "bg-orange-500";
  //   if (answered.includes(number)) return "bg-green-500";
  //   return "border-gray-300";
  // };

  return (
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
        <div className="w-full ">
          {/* quiz hearder */}
          <div>
            <div className="flex justify-between items-center px-4 md:px-6 bg-gray-600 text-white p-2 py-3">
              <div className="flex items-center gap-4">
                <Logo mode={mode} className="hidden md:block" />
                <div className="font-bold text-sm md:text-lg ">
                  {quizData?.title}
                </div>
              </div>

              <div className="flex gap-2 md:gap-4 items-center">
                <div className="flex gap-2 items-center border-2 p-1 rounded-xl px-3 md:px-4">
                  <MdTimer size={20} />
                  <span className="text-sm md:text-xl">
                    {formatTime(timePassed)}
                  </span>
                </div>
                <div className="flex gap-2 items-center border-2 p-1 rounded-xl px-3 md:px-4">
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
          </div>
          {/* quiz main content */}

          <div className="flex flex-col md:flex-row">
            <div className="md:h-[calc(100vh_-_160px)] lg:max-h-[80vh] md:overflow-y-scroll hidden-scroll p-4 md:p-8 md:pb-0 border-r border-gray-500">
              <div className="flex flex-col items-center space-y-4">
                <h2 className="text-lg font-bold">{quizData?.title}</h2>
                {/* <h3 className="text-sm font-medium">Analytical Ability</h3> */}
                {/* Questions */}
                <div className="grid grid-cols-10 md:grid-cols-3 lg:grid-cols-5 gap-2 max-h-[120px] md:max-h-none overflow-y-scroll md:overflow-hidden overflow-x-hidden mobile-scrollbar">
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
                            handleActiveQuestionChange(index);
                          }}
                        >
                          {index + 1}
                        </div>
                      </>
                    );
                  })}
                </div>
                <div className="md:sticky bg-white w-full p-4 bottom-0 mt-4 flex md:flex-col gap-5 md:gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-white border border-gray-300 rounded-full"></div>
                    <span className="text-sm">
                      Unanswered - {questions.length - questionStatus.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      Answered - {questionStatus.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 max-h-[calc(57vh_-_80px)] md:h-screen lg:max-h-[75vh] overflow-y-scroll mobile-scrollbar mx-auto p-8 ">
              {isQusLoading ? (
                <>
                  <div className="flex justify-center items-center">
                    <Spinner className="mr-4" color="grzy-900" size="40px" />
                  </div>
                </>
              ) : (
                <>
                  {questionData?.questionType?.toLowerCase() === "fill" ? (
                    <>
                      <div className="flex justify-between items-center">
                        <p className="px-4 p-1 capitalize rounded-lg border-2 border-gray-600 text-base font-semibold">
                          Question : Fill the Question
                        </p>
                        <p className="px-4 p-1 capitalize rounded-lg border-2 border-gray-600 text-base font-semibold">
                          {`${questionData?.marks}  Marks`}
                        </p>
                      </div>
                      <div className=" pt-2 pb-8">
                        <div className="mt-2 rounded-xl border-2 border-gray-600 px-7 py-4 w-full mb-8 ">
                          <h4 className="text-gray-700 font-semibold text-lg">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: questionData?.question
                              }}
                            ></span>
                          </h4>
                        </div>
                        <Input
                          textArea
                          placeholder="Wrtie Your Answer Here"
                          value={fillAnswer}
                          className="mb-8 focus:ring-gray-600 focus-within:ring-gray-600 focus-within:border-gray-600 focus:border-gray-600 mt-2 rounded-xl border-2 border-gray-600 "
                          onChange={(e) => {
                            setFillAnswer(e.target.value);
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <p className="px-4 p-1 capitalize rounded-lg border-2 border-gray-600 text-sm md:text-base font-semibold">
                          Question : MCQ
                        </p>
                        <p className="px-4 p-1 capitalize rounded-lg border-2 border-gray-600 text-sm md:text-base font-semibold">
                          {questionData?.marks || "0"} Marks
                        </p>
                      </div>
                      <div className=" pt-2 pb-8">
                        <div className="mt-2 rounded-xl border-2 border-gray-600 px-5 md:px-7 py-4 w-full mb-8 ">
                          <h4 className="text-gray-700 font-semibold text-base md:text-lg">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: questionData?.question
                              }}
                            ></span>
                          </h4>
                        </div>

                        <OptionList
                          answers={questionData?.answers}
                          selectedAnswerIndex={selectedAnswerIndex}
                          onAnswerSelected={handleSelectAnswer}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* quiz footer */}
          <div>
            <div className="absolute bottom-0 w-full flex justify-between items-center px-6 bg-gray-200 text-white p-2 py-3">
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
                {activeQuestion === 0 ? (
                  <></>
                ) : (
                  <Button
                    variant="solid"
                    color="gray-600"
                    className="max-w-48 md:w-48"
                    onClick={handleBackQuestion}
                    disabled={activeQuestion <= 0}
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
        </div>
      </>
    </motion.div>
  );
};
