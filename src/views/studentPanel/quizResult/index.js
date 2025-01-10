/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import openNotification from "views/common/notification";
import axiosInstance from "apiServices/axiosInstance";
import { Spinner } from "components/ui";
import Logo from "components/template/Logo";
import { useSelector } from "react-redux";
import { MdTimer } from "react-icons/md";
import { formatTime } from "utils/formatTime";
import { FaQuestionCircle } from "react-icons/fa";
import { OptionList } from "../quiz/components/OptionList";

const QuizMainContent = () => {
  const { trackingId } = useParams();
  const mode = useSelector((state) => state.theme.mode);

  const [isLoading, setIsLoading] = useState(true);
  const [apiFlag, setApiFlag] = useState(false);
  const [results, setResults] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axiosInstance.post(
        // `student/quiz-result/${trackingId}`
        `user/quiz-results/677143169885a731f9c7e1a1`
      );

      if (response?.success) {
        setResults(response.data);

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
      fetchData();
    }
  }, [apiFlag]);

  useEffect(() => {
    setApiFlag(true);
  }, []);

  console.log("jash design here results : ", results);

  // const quizResult = results[0]

  // console.log("quizResult", quizResult)

  return (
    <>
      {isLoading ? (
        <>
          <Spinner className="mr-4" size="40px" />
        </>
      ) : (
        <>
          <div className="w-full ">
            {/* quiz hearder */}
            <div>
              <div className="flex justify-between items-center px-4 md:px-6 bg-gray-600 text-white p-2 py-3">
                <div className="flex items-center gap-4">
                  <Logo mode={mode} className="hidden md:block" />
                  <div className="font-bold text-sm md:text-lg ">Quiz Result Summary</div>
                </div>
              </div>
            </div>
            {/* quiz main content */}

            <div className="flex flex-col md:flex-row">
              <div className=" lg:max-h-[80vh] md:overflow-y-scroll hidden-scroll p-4 md:p-8 md:pb-0 border-r border-gray-500">
                <div className="flex flex-col items-center space-y-4">
                  <h2 className="text-lg font-bold">Quiz Results</h2>


                  <div className="md:sticky bg-white w-full p-4 bottom-0 mt-4 flex md:flex-col gap-5 md:gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm"><strong>Total Marks:</strong> {results.totalMarks}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm"><strong>Correct Answers:</strong> {results.correctAnswers}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm"><strong>Wrong Answers:</strong> {results.wrongAnswers}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm"><strong>Total Time:</strong> {results.totalTime} seconds</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm"><strong>Taken Time:</strong> {results.takenTime} seconds</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 max-h-[calc(70vh_-_80px)] md:h-screen lg:max-h-[75vh] overflow-y-scroll mobile-scrollbar mx-auto p-8 ">
                {isLoading ? (
                  <>
                    <div className="flex justify-center items-center">
                      <Spinner className="mr-4" color="grzy-900" size="40px" />
                    </div>
                  </>
                ) : (
                  <>
                    {results?.results?.map((question, index) => (
                      <div key={question._id} className="p-4 border rounded-lg mb-3">
                        <h4 className="font-semibold mb-2">
                          Question {index + 1}:&nbsp;
                          <span
                            dangerouslySetInnerHTML={{ __html: question.question }}
                          ></span>
                        </h4>
                        <ul className="space-y-2">
                          {question.answers?.map((answer) => (
                            <li
                              key={answer._id}
                              className={`p-2 rounded-lg border ${answer.correct ? "border-green-500" : "border-gray-300"
                                }`}
                            >
                              <span
                                dangerouslySetInnerHTML={{ __html: answer.content }}
                              ></span>
                              {answer.correct && <span className="ml-2 text-green-500">(Correct)</span>}
                            </li>
                          ))}
                          {question.answerValue && (
                            <div className="mt-2 p-2 bg-blue-50 border border-blue-300 rounded-lg">
                              <p className="text-blue-500 font-semibold">Your Answer:</p>
                              <span
                                dangerouslySetInnerHTML={{ __html: question.answerValue.content }}
                              ></span>
                              {question.answerValue.correct ? (
                                <span className="ml-2 text-green-500">(Correct)</span>
                              ) : (
                                <span className="ml-2 text-red-500">(Incorrect)</span>
                              )}
                            </div>
                          )}
                        </ul>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default QuizMainContent;
