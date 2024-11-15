import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { OptionList } from "./OptionList";
import { formatTime } from "utils/formatTime";
import { playQuizEnd } from "utils/playSound";
import { Button, Input, Progress, Spinner } from "components/ui";
import parse from "html-react-parser";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import { useParams } from "react-router-dom";
import { MdTimer } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";

export const Quiz = (props) => {
  const { questions, quizData, setResults, setDisplayView } = props;
  const { quizId } = useParams();
  const TIME_LIMIT = quizData.time * 60; // 1 minute per question

  const timerRef = useRef(null);
  const [questionData, setQuestionData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isQusLoading, setIsQusLoading] = useState(true);
  const [timePassed, setTimePassed] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [quizFinished, setQuizFinished] = useState(false);
  console.log("questions:", questions, questions[activeQuestion]);
  const { _id } = questions[activeQuestion];
  const numberOfQuestions = questions.length;
  const setupTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimePassed((prevTimePassed) =>
        prevTimePassed > TIME_LIMIT ? TIME_LIMIT : prevTimePassed + 1
      );
    }, 1000);
  };

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
      // The time limit has been reached for this question
      // So the answerr will be considered wrong

      setResults((prev) => ({
        ...prev,
        secondsUsed: prev.secondsUsed + TIME_LIMIT,
        wrongAnswers: prev.wrongAnswers + 1
      }));

      // handleNextQuestion();
      // Restart timer
      // setTimePassed(0);
      setQuizFinished(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timePassed]);

  const UpdateQuizQuestionData = async (questionId, answerId) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.put(
        `student/quiz/update/${quizId}`,
        { questionId, answerId, time: timePassed }
      );
      if (response.success) {
        setSelectedAnswerIndex(-1);
        if (activeQuestion + 1 >= questions.length) {
          //Quiz finished!
          setResults({
            correctAnswers: response?.data?.correctAnswers,
            wrongAnswers: response?.data?.wrongAnswers,
            secondsUsed: response?.data?.totalTime
          });
          playQuizEnd();
          setQuizFinished(true);
          return;
        }
        // Set next question
        setActiveQuestion((prev) => prev + 1);
        setIsLoading(false);
      } else {
        openNotification("danger", response.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Update Quiz Question Data error:", error);
      openNotification("danger", error.message);
      setIsLoading(false);
    }
  };
  const handleNextQuestion = async () => {
    if (_id && selectedAnswerIndex) {
      await UpdateQuizQuestionData(_id, selectedAnswerIndex);
    }
  };

  const handleSelectAnswer = (answerIndex) => {
    //  Stop timer
    // clearInterval(timerRef.current);
    setSelectedAnswerIndex(answerIndex);
  };

  if (quizFinished) {
    setDisplayView("result");
  }
  const anserarr = [
    { _id: "1", content: "panthil" },
    { _id: "2", content: "panthil" },
    { _id: "3", content: "panthil" },
    {
      _id: "4",
      content: "hidden flex flex-col text-black font-bold  text-center w-full"
    }
  ];
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
            <div className="flex justify-between items-center px-6 bg-gray-600 text-white p-2 py-3">
              <div className="flex gap-4">
                <div className="font-bold text-2xl ">LMS</div>
                <div className="border-r-2"></div>
                <div className="font-bold text-lg ">{quizData?.title}</div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex gap-2 items-center border-2 p-1 rounded-xl px-4">
                  <MdTimer size={25} />
                  <span className="text-xl">{formatTime(timePassed)}</span>
                </div>
                <div className="flex gap-2 items-center border-2 p-1 rounded-xl px-4">
                  <span className="text-lg">
                    <FaQuestionCircle size={18} />
                  </span>
                  <span className="text-lg">Question</span>
                  <span className="text-lg">:</span>
                  <span className="text-lg">
                    {" "}
                    {activeQuestion + 1} / {numberOfQuestions}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* quiz main content */}
          <div className="w-[70%] max-h-[80vh] overflow-y-scroll hidden-scroll mx-auto my-8">
            {isQusLoading ? (
              <>
                <div className="flex justify-center items-center">
                  <Spinner className="mr-4" color="grzy-900" size="40px" />
                </div>
              </>
            ) : (
              <>
                {questionData?.questionType === "fill" ? (
                  <>
                    <div className="flex justify-between items-center">
                      <p className="px-4 p-1 capitalize rounded-lg border-2 border-gray-600 text-base font-semibold">
                        Question : Fill the Question
                      </p>
                      <p className="px-4 p-1 capitalize rounded-lg border-2 border-gray-600 text-base font-semibold">
                        2 Marks
                      </p>
                    </div>
                    <div className=" pt-2 pb-8">
                      <div className="mt-2 rounded-xl border-2 border-gray-600 px-7 py-4 w-full mb-8 ">
                        <h4 className="text-gray-700 font-semibold text-lg">
                          .................. the primary function of a router?
                        </h4>
                      </div>
                      <Input
                        placeholder="Wrtie Your Answer Here"
                        textArea
                        className="mb-8 focus:ring-gray-600 focus-within:ring-gray-600 focus-within:border-gray-600 focus:border-gray-600 mt-2 rounded-xl border-2 border-gray-600 "
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <p className="px-4 p-1 capitalize rounded-lg border-2 border-gray-600 text-base font-semibold">
                        Question : MCQ
                      </p>
                      <p className="px-4 p-1 capitalize rounded-lg border-2 border-gray-600 text-base font-semibold">
                        2 Marks
                      </p>
                    </div>
                    <div className=" pt-2 pb-8">
                      <div className="mt-2 rounded-xl border-2 border-gray-600 px-7 py-4 w-full mb-8 ">
                        <h4 className="text-gray-700 font-semibold text-lg">
                          What is the primary function of a router?
                        </h4>
                      </div>

                      <OptionList
                        answers={anserarr}
                        selectedAnswerIndex={selectedAnswerIndex}
                        onAnswerSelected={handleSelectAnswer}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          {/* quiz footer */}
          <div>
            <div className="absolute bottom-0 w-full flex justify-between items-center px-6 bg-gray-200 text-white p-2 py-3">
              <div className="flex gap-4">
                <div className="flex gap-4 items-center text-lg">
                  {" "}
                  <Button variant="solid" color="gray-600">
                    Submit Test
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 items-center text-lg">
                <Button
                  variant="solid"
                  color="gray-600"
                  disabled={selectedAnswerIndex === -1}
                  className="w-48"
                  onClick={handleNextQuestion}
                  loading={isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    </motion.div>
  );
};
