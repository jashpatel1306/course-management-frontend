import { Card } from "components/ui";
import React from "react";
import { useSelector } from "react-redux";
import QuizList from "./components/quizList";
const MyQuizAttempts = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  return (
    <>
      <Card>
        <div className="flex items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            My Quiz Attempts
          </div>
        </div>
      </Card>
      <QuizList />
    </>
  );
};

export default MyQuizAttempts;
