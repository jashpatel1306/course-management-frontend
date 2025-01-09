/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import openNotification from "views/common/notification";
import axiosInstance from "apiServices/axiosInstance";
import { Spinner } from "components/ui";
const QuizMainContent = () => {
  const { trackingId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [apiFlag, setApiFlag] = useState(false);
  const [results, setResults] = useState();
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `student/quiz-result/${trackingId}`
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
  return (
    <>
      <h1>Quiz Results</h1>
      {isLoading ? (
        <>
          <Spinner className="mr-4" size="40px" />
        </>
      ) : (
        <>
          <p>Quiz result view</p>
        </>
      )}
    </>
  );
};

export default QuizMainContent;
