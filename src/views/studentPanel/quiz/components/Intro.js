import React from "react";
import { CheckCircle, Doodles } from "assets/svg";
import { Button } from "components/ui";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
const importantToKnow = [
  "In each quiz, you are required to answer 5 questions.",
  "You will have 1 minute for each question. If you fail to complete a question in given time, your answer will be considered incorrect.",
];
const Intro = ({ onGetStartedClick, quizName }) => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  return (
    <div
      className={`px-5 py-8 flex-1 w-full lg:max-w-4xl mx-auto flex flex-col overflow-hidden `}
    >
      <img
        src="/doodles.svg"
        width={343}
        height={413}
        className="absolute -bottom-10 right-0 z-0 object-cover pointer-events-none w-[343px] h-[413px] lg:w-[500px] lg:h-[600px]"
        alt="Doodles Illustration"
      />

      <div className="w-full flex flex-col flex-1 items-center z-10">
        <h1 className="text-brand-cerulean-blue font-bold text-[32px] sm:text-4xl capitalize">
          {quizName}
        </h1>

        <h3 className="text-black font-bold text-2xl mt-[51.55px] sm:text-3xl">
          Things to know before you start:
        </h3>

        <div className="flex flex-col items-start mt-5 sm:mt-10">
          {importantToKnow.map((item, index) => (
            <div
              key={index}
              className="flex justify-start gap-4  items-center "
            >
              <div className={`text-${themeColor}-${primaryColorLevel}`}>
                <FaCheckCircle size={25} />
              </div>
              <div>
                <p className="text-base font-normal sm:text-xl">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        className="w-full z-10"
        variant="solid"
        onClick={onGetStartedClick}
      >
        {`Let's Get Started`}
      </Button>
    </div>
  );
};

export default Intro;
