/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Countdown } from "./components/Countdown";
import Intro from "./components/Intro";
import { Quiz } from "./components/Quiz";
import openNotification from "views/common/notification";
import axiosInstance from "apiServices/axiosInstance";
import { Spinner } from "components/ui";
import { Result } from "./components/Result";
const QuizMainContent = () => {
  const { quizId } = useParams();
  const [displayView, setDisplayView] = useState("intro");
  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [apiFlag, setApiFlag] = useState(false);
  const [results, setResults] = useState({
    trackingId:"",
    correctAnswers: 0,
    wrongAnswers: 0,
    secondsUsed: 0
  });
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`student/public-quiz/${quizId}`);

      if (response?.success) {
        setQuizData({
          _id: response.data?._id,
          quizId: response.data?.quizId,
          password: response.data?.password,
          startDate: response.data?.startDate,
          endDate: response.data?.endDate,
          specificField: response.data?.specificField,
          instruction: response.data?.instruction,
          title: response.data?.publicLinkName,
          soltStatus: response.data?.soltStatus,
          totalQuestions: response.data?.quizdetails?.totalQuestions,
          // questionIds: response.data?.questionIds,
          totalTime: response.data?.quizdetails?.totalTime,
          totalMarks: response.data?.quizdetails?.totalMarks
        });
        setQuestions(response.data.quizdetails?.questionIds);
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
  return (
    <>
      <main
        className={`h-viewport flex flex-col w-full overflow-hidden  relative`}
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
                      setResults={setResults}
                      results={results}
                      onGetStartedClick={() => {
                        setDisplayView("countdown");
                      }}
                    />
                  ),
                  countdown: (
                    <Countdown
                      quizData={quizData}
                      onGoClick={() => {
                        // ErollQuizData();
                        setDisplayView("quiz");
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
                      setResults={setResults}
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
