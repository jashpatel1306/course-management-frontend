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

const TIME_LIMIT = 60; // 1 minute per question
const quizQuestions = [
  {
    question:
      "What is the process of converting analog signals into digital data called?",
    options: ["Encoding", "Decoding", "Encryption", "Modulation"],
    correctAnswer: "Encoding",
  },
  {
    question: "What is the smallest unit of digital information?",
    options: ["Byte", "Bit", "Megabyte", "Gigabyte"],
    correctAnswer: "Bit",
  },
  {
    question: "Which programming language is used for web development?",
    options: ["PHP", "Ruby", "Swift", "HTML"],
    correctAnswer: "HTML",
  },
  {
    question: "What is the standard file format for images on the web?",
    options: ["PNG", "PDF", "TXT", "DOC"],
    correctAnswer: "PNG",
  },
  {
    question:
      "Which technology is used to track the location of a mobile device?",
    options: ["GPS", "NFC", "Wi-Fi", "Bluetooth"],
    correctAnswer: "GPS",
  },
];
export const Quiz = () => {
  const timerRef = useRef(null);

  const [timePassed, setTimePassed] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [results, setResults] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    secondsUsed: 0,
  });
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

      // Update results
      if (selectedAnswerIndex === -1) {
        setResults((prev) => ({
          ...prev,
          secondsUsed: prev.secondsUsed + TIME_LIMIT,
          wrongAnswers: prev.wrongAnswers + 1,
        }));
      }

      handleNextQuestion();
      // Restart timer
      setTimePassed(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timePassed]);

  const handleNextQuestion = () => {
    // Reset selected answer
    setSelectedAnswerIndex(-1);

    // Check if quiz finished
    if (activeQuestion + 1 >= quizQuestions.length) {
      console.log("Quiz finished!");
      playQuizEnd();
      setQuizFinished(true);
      return;
    }

    // Set next question
    setActiveQuestion((prev) => prev + 1);

    // Reset timer
    setupTimer();
    setTimePassed(0);
  };

  const handleSelectAnswer = (answerIndex) => {
    //  Stop timer
    clearInterval(timerRef.current);
    setSelectedAnswerIndex(answerIndex);

    // Check if answer is correct
    const correctAnswer = quizQuestions[activeQuestion].correctAnswer;
    const selectedAnswer = quizQuestions[activeQuestion].options[answerIndex];

    if (correctAnswer === selectedAnswer) {
      console.log("Correct answer!");
      playCorrectAnswer();
      // Update results
      setResults((prev) => ({
        ...prev,
        secondsUsed: prev.secondsUsed + timePassed,
        correctAnswers: prev.correctAnswers + 1,
      }));

      setIsCorrectAnswer(true);
    } else {
      console.log("Wrong answer!");
      playWrongAnswer();
      // Update results
      setResults((prev) => ({
        ...prev,
        secondsUsed: prev.secondsUsed + timePassed,
        wrongAnswers: prev.wrongAnswers + 1,
      }));
      setIsCorrectAnswer(false);
    }
  };

  const { question, options } = quizQuestions[activeQuestion];
  const numberOfQuestions = quizQuestions.length;

  if (quizFinished) {
    return <Result results={results} totalQuestions={quizQuestions.length} />;
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
              QuizApp
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
              width={80}
              customInfo={
                <div className="text-center">
                  <span>{formatTime(timePassed)}</span>
                </div>
              }
            />
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-brand-light-gray px-7 py-4 w-full mb-8">
         
          <h4 className="text-black font-medium text-lg">
            {question}
          </h4>
        </div>

        <OptionList
          activeQuestion={quizQuestions[activeQuestion]}
          options={options}
          selectedAnswerIndex={selectedAnswerIndex}
          onAnswerSelected={handleSelectAnswer}
          isCorrectAnswer={isCorrectAnswer}
        />

        <div className="mt-auto">
          <Button
            disabled={selectedAnswerIndex === -1}
            block
            onClick={handleNextQuestion}
            variant="solid"
          >
            Next
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
