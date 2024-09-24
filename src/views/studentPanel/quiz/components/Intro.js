import React from "react";
import { Button } from "components/ui";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
const Intro = ({ onGetStartedClick, quizData }) => {
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
        <h1 className={`text-brand-cerulean-blue font-bold text-[32px] sm:text-4xl capitalize text-${themeColor}-${primaryColorLevel}`}>
          {quizData.title}
        </h1>

        <h3 className="text-black font-bold text-2xl mt-[51.55px] sm:text-3xl">
          Things to know before you start:
        </h3>

        <div
          className={`flex flex-col items-start mt-5 sm:mt-10 max-h-[60vh] overflow-y-scroll hidden-scroll border-2 py-4 px-6 rounded-xl  border-${themeColor}-${primaryColorLevel}`}
        >
          {quizData?.description?.map((item, index) => (
            <div
              key={index}
              className="flex justify-start gap-4  items-center mb-3"
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
        Let's Get Started
      </Button>
    </div>
  );
};

export default Intro;
