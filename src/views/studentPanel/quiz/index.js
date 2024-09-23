import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Countdown } from "./components/Countdown";
import Intro from "./components/Intro";
import { Quiz } from "./components/Quiz";
const QuizMainContent = () => {
  const { quizId } = useParams();
  const [displayView, setDisplayView] = useState("intro");
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  return (
    <>
      <main className={`h-viewport flex flex-col w-full overflow-hidden bg-${themeColor}-100`}>
        <AnimatePresence mode="wait">
          {
            {
              intro: (
                <Intro
                 quizName={"quizName quizName"}
                  onGetStartedClick={() => {
                    setDisplayView("countdown");
                  }}
                />
              ),
              countdown: (
                <Countdown
                quizName={"quizName quizName"}

                  onGoClick={() => {
                    setDisplayView("quiz");
                  }}
                />
              ),
              quiz: <Quiz />,
            }[displayView]
          }
        </AnimatePresence>
      </main>
    </>
  );
};

export default QuizMainContent;
