
import { motion } from "framer-motion";
import DonutChart from "./DonutChart";
import { Button } from "components/ui";

export const Result = (props) => {
  const { results, totalQuestions, quizData } = props;
  const { correctAnswers, wrongAnswers, secondsUsed } = results;
  const TIME_LIMIT = quizData.time * 60; // 1 minute per question

  const handleRetry = () => {
    // Restart quiz
    window.location.reload();
  };

  return (
    <motion.div
      key={"result"}
      variants={{
        initial: {
          background: "#FF6A66",
          clipPath: "circle(0% at 50% 50%)",
        },
        animate: {
          background: "#FF6A66",
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
        <h1 className="font-bold text-2xl text-white">{quizData.title}</h1>

        {/* Result Box */}
        <div className={`mt-6 flex-1 bg-white border border-brand-light-gray rounded-2xl flex flex-col items-center py-7 px-2`}>
         
          <h3 className="text-brand-midnight text-[32px] font-medium leading-9 mt-4">
            Congratulations!
          </h3>
          <p className="text-brand-midnight text-xl font-normal mt-2">
            You scored
          </p>
          <span className="text-brand-midnight font-medium text-[40px]">
            {`${correctAnswers}/${totalQuestions}`}
          </span>
          <p className="text-brand-midnight text-sm font-normal mt-1">
            correct answers
          </p>

          {/* Charts */}
          <div className="flex items-center mt-4 space-x-4">
            <DonutChart
              className="w-36 h-36"
              total={TIME_LIMIT}
              used={secondsUsed}
              type={"time"}
              data={[
                {
                  label: "Time Used",
                  value: secondsUsed,
                  color: "#374CB7",
                },
                {
                  label: "Time Left",
                  value: TIME_LIMIT - secondsUsed,
                  color: "#F0F0F0",
                },
              ]}
            />

            <DonutChart
              className="w-36 h-36"
              type={"questions"}
              total={totalQuestions}
              used={correctAnswers}
              data={[
                {
                  label: "Correct",
                  value: correctAnswers,
                  color: "#56C490",
                },
                {
                  label: "Wrong",
                  value: wrongAnswers,
                  color: "#FF6A66",
                },
              ]}
            />
          </div>
        </div>

        {/* Retry Button */}
        <div className="mt-auto hidden">
          <Button
            intent={"secondary"}
            variant="solid"
            block
            className="mt-6"
            onClick={handleRetry}
          >
            Try Again
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
