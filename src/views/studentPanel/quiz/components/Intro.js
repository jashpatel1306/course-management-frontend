import React from "react";
import { Button } from "components/ui";
import { useSelector } from "react-redux";
import Logo from "components/template/Logo";
const Intro = ({ onGetStartedClick, quizData }) => {
  const mode = useSelector((state) => state.theme.mode);
  console.log("quizData: ", quizData);
  return (
    <div className="flex">
      <div className={`w-[35%]  h-screen bg-white`}>
        <section className="flex flex-col  h-full justify-around items-start text-start px-16  gap-y-8">
          <Logo mode={mode} className="hidden md:block" />
          <div>
            <div className="gap-y-4">
              <h1
                className="text-4xl font-bold"
                aria-label="Welcome to Lala Back-End Developer Hiring Test"
              >
                <span className="flex" aria-hidden="true">
                  Welcome to
                </span>
                <span aria-hidden="true">{quizData?.title}</span>
              </h1>
              <div className="mt-8">
                <div className="flex gap-8 ">
                  <div>
                    <span className="text-base font-semibold text-gray-500">
                      Test duration
                    </span>
                    <span
                      className="block text-gray-800 text-xl"
                      data-automation="test-duration"
                    >
                      {quizData?.time} mins
                    </span>
                  </div>
                  <div>
                    <span className="text-base font-semibold text-gray-500">
                      No. of questions
                    </span>
                    <span className="block text-gray-800 text-xl">
                      {quizData?.totalQuestions} questions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" flex items-center mt-8 text-black text-lg">
            <div className="mt-8 hidden">
              
            </div>
          </div>
        </section>
      </div>
      <div
        className={`w-[65%] h-screen bg-gray-200 overflow-y-scroll custom-scrollbar`}
      >
        <section className=" flex flex-col h-full justify-around items-center text-start pl-16 pr-32 p-6 gap-y-6 ">
          <div></div>
          <div>
            <div className="flex flex-col gap-y-8 mb-8">
              <h2 className="text-4xl font-semibold">Instructions</h2>
              <div className="text-gray-700">
                <ol className="flex flex-col  list-decimal list-inside gap-y-2 text-base pl-[30px]">
                  {quizData?.instruction?.map((instruction, index) => {
                    return (
                      <li key={`${quizData?._id}-${index}`}>{instruction}</li>
                    );
                  })}
                </ol>
              </div>
              <div className="flex gap-x-4">
                <Button
                  variant="solid"
                  className="text-white py-2 px-4 rounded"
                  color="gray-600"
                  onClick={onGetStartedClick}
                >
                  Let's Get Started
                </Button>
              </div>
            </div>
          </div>
          <div></div>
        </section>
      </div>
    </div>
  );
};

export default Intro;
