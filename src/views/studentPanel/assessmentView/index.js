/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import axiosInstance from "apiServices/axiosInstance";
import { Button, Card, Spinner } from "components/ui";
import { useEffect, useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import openNotification from "views/common/notification";

const AssessmentView = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [isLoading, setIsLoading] = useState(true);
  const [apiFlag, setApiFlag] = useState(false);
  const [assessmentData, setAssessmentData] = useState();
  const [totalTime, setTotalTime] = useState(0);
  const fetchAssessmentData = async () => {
    try {
      const response = await axiosInstance.get(
        `student/assessment/${assessmentId}`
      );
      if (response.success) {
        setAssessmentData(response.data);
        const timeArr = response.data?.content?.map((info) => info.data.time);
        setTotalTime(timeArr.reduce((a, b) => a + b, 0));
        setIsLoading(false);
      } else {
        openNotification("danger", response.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-course error:", error);
      openNotification("danger", error.message);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setIsLoading(true);

      fetchAssessmentData();
    }
  }, [apiFlag]);

  useEffect(() => {
    setApiFlag(true);
  }, []);
  console.log("assessmentData: ");
  return (
    <>
      {isLoading ? (
        <>
          <Spinner className="mr-4" size="40px" />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center gap-2 ">
            {" "}
            <div className="flex gap-2 items-center">
              <div className="text-xl font-semibold text-center mr-4">
                <Button
                  className={`back-button px-1 font-bold text-${themeColor}-${primaryColorLevel} border-2 border-${themeColor}-${primaryColorLevel} dark:text-white`}
                  size="sm"
                  icon={<HiArrowNarrowLeft size={30} />}
                  onClick={async () => {
                    navigate("/app/student/assessment");
                  }}
                />
              </div>
              <div
                className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
              >
                {assessmentData?.title}
              </div>
            </div>
          </div>
          <Card className="mt-4">
            <div className="mb-8 flex justify-between items-center  text-lg font-bold">
              <p
                className={`text-${themeColor}-${primaryColorLevel} bg-${themeColor}-50 p-2 px-4 rounded-md`}
              >
                Total Questions : {assessmentData?.totalQuestions}
              </p>
              <div className="flex gap-4">
                <p
                  className={`text-${themeColor}-${primaryColorLevel} bg-${themeColor}-50 p-2 px-4 rounded-md`}
                >
                  Total Marks : {assessmentData?.totalMarks}
                </p>
                <p
                  className={`text-${themeColor}-${primaryColorLevel} bg-${themeColor}-50 p-2 px-4 rounded-md`}
                >
                  Total Time : {totalTime} min
                </p>
              </div>
            </div>
            <div>
              {assessmentData?.content.map((info) => {
                const content = info.data;
                const trackingQuizData =
                  assessmentData?.trackingQuizData?.filter(
                    (data) => data.quizId === content._id
                  );
                if (info.type === "quiz") {
                  return (
                    <div
                      key={content?._id}
                      className={`mb-4 text-base font-medium rounded-lg mt-2 ${
                        trackingQuizData?.length
                          ? "bg-blue-100 border-2 border-blue-500"
                          : "border-2 border-blue-500"
                      } flex p-4 px-6 items-center justify-between`}
                    >
                      <div>
                        <h3>{content.title}</h3>
                        <div className="flex gap-4 mt-2 text-lg">
                          <p>TotalMarks : {content.totalMarks}</p>
                          <p>TotalQuestions : {content.questionsLength}</p>
                          <p>TotalTime : {content.time} min</p>
                        </div>
                      </div>
                      <div>
                        {trackingQuizData?.length ? (
                          <>
                            <Button
                              variant="solid"
                              onClick={() => {
                                navigate('/app/student/quiz-attempts');
                              }}
                            >
                              Result
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="twoTone"
                            onClick={() => {
                              const url = `${
                                window.location.href.split("app")[0]
                              }app/student/${assessmentData?._id}/quiz/${
                                content?._id
                              }`;
                              window.open(url, "_blank");
                            }}
                            className="border border-blue-500"
                          >
                            Quiz Start
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </Card>
        </>
      )}
      <div className="text-lg text-gray-800 mb-2"></div>
    </>
  );
};
export default AssessmentView;
