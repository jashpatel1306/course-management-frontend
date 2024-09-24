import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { OptionList } from "./OptionList";
import { Result } from "./Result";
import { formatTime } from "utils/formatTime";
import {
  playCorrectAnswer,
  playQuizEnd,
  playWrongAnswer,
} from "utils/playSound";
import { Button, Progress } from "components/ui";
import parse from "html-react-parser";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import { useParams } from "react-router-dom";

export const Quiz = (props) => {
  const TIME_LIMIT = 180; // 1 minute per question
  const { quizId } = useParams();

  const { questions, quizData } = props;
  const timerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [timePassed, setTimePassed] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [quizFinished, setQuizFinished] = useState(true);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [results, setResults] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    secondsUsed: 0,
  });
  const { question, answers, _id } = questions[activeQuestion];
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
        wrongAnswers: prev.wrongAnswers + 1,
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
        { questionId, answerId }
      );
      if (response.success) {
        setSelectedAnswerIndex(-1);
        if (activeQuestion + 1 >= questions.length) {
          console.log("Quiz finished!");
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
    console.log("Question : ", _id);
    console.log("Answer : ", selectedAnswerIndex);
    if (_id && selectedAnswerIndex) {
      await UpdateQuizQuestionData(_id, selectedAnswerIndex);
    }
  };

  const handleSelectAnswer = (answerIndex) => {
    //  Stop timer
    clearInterval(timerRef.current);
    setSelectedAnswerIndex(answerIndex);
  };

  if (quizFinished) {
    return (
      <Result
        results={results}
        totalQuestions={questions.length}
        questions={questions}
        quizData={quizData}
      />
    );
  }

  return (
    <motion.div
      key={"countdown"}
      variants={{
        initial: {
          background: "#FF6A66",
          clipPath: "circle(0% at 50% 50%)",
        },
        animate: {
          background: "#ffffff",
          clipPath: "circle(100% at 50% 50%)",
        },
      }}
      className="w-full h-full flex justify-center p-5"
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col text-black font-bold  text-center w-full">
        <div className="flex justify-between items-center px-6">
          <div>
            <h1 className="font-bold text-2xl text-brand-cerulean-blue">
              {quizData?.title}
            </h1>
          </div>
          <div>
            <h3 className="text-black font-medium text-lg">
              Question {activeQuestion + 1} / {numberOfQuestions}
            </h3>
          </div>
          <div>
            <Progress
              percent={(timePassed / TIME_LIMIT) * 100}
              variant="circle"
              width={60}
              customInfo={
                <div className="text-center">
                  <span>{formatTime(timePassed)}</span>
                </div>
              }
            />
          </div>
        </div>
        <div className="max-h-[80vh] overflow-y-scroll hidden-scroll pt-2 pb-8">
          <div className="mt-2 rounded-2xl border border-brand-light-gray px-7 py-4 w-full mb-8 ">
            <h4 className="text-black font-medium text-lg">
              {parse(
                question
                  .replaceAll("<pre", `<code><pre`)
                  .replaceAll("</pre>", `</pre></code>`)
              )}
            </h4>
          </div>
          <OptionList
            activeQuestion={questions[activeQuestion]}
            answers={answers}
            selectedAnswerIndex={selectedAnswerIndex}
            onAnswerSelected={handleSelectAnswer}
            isCorrectAnswer={isCorrectAnswer}
          />
        </div>

        <div className="absolute bottom-0 w-full flex justify-between bg-gray-100 p-2 px-6">
          <div className="w-full flex justify-end items-center">
            <Button
              disabled={selectedAnswerIndex === -1}
              className="w-48"
              onClick={handleNextQuestion}
              variant="solid"
              loading={isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
