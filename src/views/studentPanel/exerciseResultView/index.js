/* eslint-disable react-hooks/exhaustive-deps */
import axiosInstance from "apiServices/axiosInstance";
import { FormNumericInput } from "components/shared";
import Logo from "components/template/Logo";
import { Button, InputGroup, Spinner } from "components/ui";
import Addon from "components/ui/InputGroup/Addon";
import { useEffect, useState } from "react";
import { FaLink } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { generateHtml } from "utils/textToHtmlConverter";
import openNotification from "views/common/notification";

const ExerciseMainContent = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const mode = useSelector((state) => state.theme.mode);

  const [isLoading, setIsLoading] = useState(true);
  const [apiFlag, setApiFlag] = useState(false);
  const [results, setResults] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  const [latestResult, setLatestResult] = useState([]);
  const [updateResult, setupdateResult] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axiosInstance.post(
        // `student/exercise-result/${trackingId}`
        `user/exercise-results/${trackingId}`
      );

      if (response?.success) {
        setResults(response.data);

        setLatestResult(response?.data?.result[0]?.results);
        setupdateResult(
          response?.data?.result[0]?.results.map((item) => {
            return {
              questionId: item.questionId,
              assignMasks: item.assignMasks,
              answer: item.answer
            };
          })
        );
        setExerciseData(response.data.exerciseData);

        setIsLoading(false);
      } else {
        openNotification("danger", response.message?.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-exercise error:", error);
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

  console.log("updateResult: ", updateResult);
  const finalAssignMarks = updateResult.reduce(
    (sum, item) => sum + (item.assignMasks || 0),
    0
  );
  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch (_) {
      return false;
    }
  };
  return (
    <>
      {isLoading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <Spinner className="mr-4" size="40px" />
        </div>
      ) : (
        <>
          <div className="w-full h-screen">
            {/* exercise hearder */}
            <div className="">
              <div className="flex justify-between items-center px-4 md:px-6 bg-gray-600 text-white p-2 py-3">
                <div className="flex items-center gap-4">
                  <Logo mode={mode} className="hidden md:block" />
                  <div className="font-bold text-sm md:text-lg ">
                    Exercise Result Summary
                  </div>
                </div>
              </div>
            </div>
            {/* exercise main content */}

            <div className="w-full h-full flex flex-col lg:flex-row">
              <div className="md:max-w-[260px] h-auto lg:h-full lg:max-h-[calc(100vh)] md:overflow-y-scroll hidden-scroll p-4 lg:p-8 md:pb-0 border-r-0 lg:border-r border-gray-500">
                <div className="flex flex-col items-center space-y-4">
                  <h2 className="text-lg font-bold">Exercise Results</h2>

                  <div className="md:sticky bg-white w-full p-4 bottom-0 mt-4 flex flex-wrap md:flex-col gap-x-0 gap-y-2 md:gap-5 lg:gap-2">
                    <>
                      <p className="">
                        <strong>Topic:</strong>
                        &nbsp;
                        {exerciseData?.title}
                      </p>

                      <div className="w-1/2 md:w-auto flex items-center space-x-2">
                        <span className="text-sm">
                          <strong>Total Questions:</strong>
                          &nbsp;
                          {results?.result[0]?.results?.length}
                        </span>
                      </div>

                      <div className="w-1/2 md:w-auto flex items-center space-x-2">
                        <span className="text-sm">
                          <strong>Total Marks:</strong>
                          &nbsp;
                          {results?.result[0]?.totalMarks
                            ? results?.result[0]?.totalMarks
                            : "0"}
                        </span>
                      </div>

                      <div className="w-1/2 md:w-auto flex items-center space-x-2">
                        <span className="text-sm">
                          <strong>Assign Marks:</strong>
                          &nbsp;
                          {finalAssignMarks ? finalAssignMarks : "0"}
                        </span>
                      </div>
                    </>
                  </div>
                </div>
              </div>
              <div className="flex-1 h-full max-h-[calc(100vh)] overflow-scroll mobile-scrollbar mx-auto p-2 lg:p-8 ">
                {isLoading ? (
                  <>
                    <div className="flex justify-center items-center">
                      <Spinner className="mr-4" color="grzy-900" size="40px" />
                    </div>
                  </>
                ) : (
                  <>
                    {latestResult?.map((question, index) => (
                      <div
                        key={question.questionId}
                        className="p-2 md:p-4 border rounded-lg mb-3 text-black bg-white"
                      >
                        <p className=" text-base font-bold mb-2">
                          Question {index + 1} :&nbsp;
                          <span
                            className="!text-sm"
                            dangerouslySetInnerHTML={{
                              __html: generateHtml(question?.question)
                            }}
                          ></span>
                        </p>
                        <ul className="space-y-2">
                          {question?.answer && (
                            <div className="flex gap-4 items-centermt-2 p-4 bg-blue-50 border border-blue-300 rounded-lg">
                              {/* Show link if present */}
                              {isValidUrl(question.answer) && (
                                <div
                                  className="rounded-md flex items-center gap-x-2 bg-[#f9fafb] text-black  border p-2"
                                  onClick={() => {
                                    window.open(question.answer, "_blank");
                                  }}
                                >
                                  <span>Link </span>
                                  <FaLink />
                                </div>
                              )}
                              <InputGroup className="">
                                <FormNumericInput
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"]?.includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  className={"w-16"}
                                  value={updateResult[index]?.assignMasks}
                                  disabled={true}
                                />
                                <Addon>{question.marks} Marks</Addon>
                              </InputGroup>
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

export default ExerciseMainContent;
