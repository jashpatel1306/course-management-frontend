/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Countdown } from "./components/Countdown";
import Intro from "./components/Intro";
import { Quiz } from "./components/Quiz";
import openNotification from "views/common/notification";
import axiosInstance from "apiServices/axiosInstance";
import { Spinner } from "components/ui";
import { Result } from "./components/Result";
const QuizMainContent = () => {
  const { quizId, assessmentId } = useParams();
  console.log("assessmentId : ", assessmentId);
  // const [displayView, setDisplayView] = useState("quiz");
  const [displayView, setDisplayView] = useState("intro");
  const themeColor = useSelector((state) => state?.theme?.themeColor);

  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [apiFlag, setApiFlag] = useState(false);
  const [results, setResults] = useState({
    correctAnswers: 3,
    wrongAnswers: 4,
    secondsUsed: 10
  });
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`student/quiz/${quizId}`);

      if (response?.success) {
        setQuizData({
          _id: response.data?._id,
          quizId: response.data?._id,
          instruction: response.data?.description,
          title: response.data?.title,
          totalQuestions: response.data?.questions?.length,
          questionIds: response.data?.questions,
          totalTime: response.data?.time,
          totalMarks: response.data?.totalMarks
        });
        setQuestions(response.data.questions);

        setIsLoading(false);
      } else {
        openNotification("danger", response.message?.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-quiz error:", error);
      openNotification("danger", error.message?.message);
      setIsLoading(false);
    }
  };
  const ErollQuizData = async () => {
    try {
      const response = await axiosInstance.post(
        `student/quiz/enroll/${assessmentId}/${quizId}`
      );

      if (response.success) {
        setDisplayView("quiz");
        setQuizData({
          ...quizData,
          trackingId: response?.data?._id,
          userId: response?.data?.userId,
          quizId: response?.data?.quizId,
        });
        setIsLoading(false);
      } else {
        openNotification(
          "danger",
          response.message?.message || response.message
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-course error:", error);
      openNotification("danger", error.message?.message || error.message);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setIsLoading(true);

      fetchData();
    }
  }, [apiFlag]);

  useEffect(() => {
    setApiFlag(true);
  }, []);
  console.log("displayView: ", displayView);
  return (
    <>
      <main
        className={`h-viewport flex flex-col w-full overflow-hidden bg-${themeColor}-100 relative`}
      >
        {isLoading ? (
          <>
            <div className="h-full flex justify-center items-center">
              <Spinner size="3.25rem" />
            </div>
          </>
        ) : (
          <>
            <AnimatePresence mode="wait">
              {
                {
                  intro: (
                    <Intro
                      quizData={quizData}
                      onGetStartedClick={() => {
                        setDisplayView("countdown");
                      }}
                    />
                  ),
                  countdown: (
                    <Countdown
                      quizData={quizData}
                      onGoClick={() => {
                        ErollQuizData();
                        // setDisplayView("quiz");
                      }}
                    />
                  ),
                  quiz: (
                    <Quiz
                      quizData={quizData}
                      questions={questions}
                      setResults={setResults}
                      results={results}
                      setDisplayView={setDisplayView}
                    />
                  ),
                  result: (
                    <Result
                      quizData={quizData}
                      totalQuestions={questions?.length}
                      results={results}
                    />
                  )
                }[displayView]
              }
            </AnimatePresence>
          </>
        )}
      </main>
    </>
  );
};

export default QuizMainContent;
