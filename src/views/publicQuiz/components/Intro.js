/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Input } from "components/ui";
import { useSelector } from "react-redux";
import { FormNumericInput, PasswordInput } from "components/shared";
import DisplayError from "views/common/displayError";
import { useNavigate } from "react-router-dom";
function isLinkExpired(expirationDate) {
  const now = new Date();
  const expiryDate = new Date(expirationDate);

  return expiryDate < now;
}

const Intro = ({ onGetStartedClick, quizData }) => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const navigate = useNavigate();

  const calculateTimeLeft = () => {
    const difference = +new Date(quizData.startDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    }
    return timeLeft;
  };
  const [step, setStep] = useState("instructions");
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  const [timeCondition, setTimeCondition] = useState(false);
  const [expired, setExpired] = useState(isLinkExpired(quizData.endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      setTimeCondition(calculateTimeLeft().days !== undefined);
    }, 1000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(timer);
  }, []);

  const [password, setPassword] = useState("");
  const [specificField, setSpecificField] = useState();
  const [errorData, setErrorData] = useState({ status: false });

  const handleSubmit = () => {
    let errorStatus = false;
    // if (password) {
    //   setErrorData((prevState) => ({
    //     ...prevState,
    //     status: false,
    //     password: ""
    //   }));
    // } else {
    //   errorStatus = true;
    //   setErrorData((prevState) => ({
    //     ...prevState,
    //     status: true,
    //     password: "Password is requied"
    //   }));
    // }
    if (quizData.specificField.length > 0) {
      quizData.specificField.map((item) => {
        if (specificField && specificField[item.label]) {
          setErrorData((prevState) => ({
            ...prevState,

            [item.label]: ``
          }));
        } else {
          errorStatus = true;
          setErrorData((prevState) => ({
            ...prevState,
            status: true,
            [item.label]: `${item.label} Field is required`
          }));
        }
      });
    }

    if (!errorStatus) {
      console.log("api calling...", specificField, password);
    }
  };
  useEffect(() => {
    if (expired) {
      navigate(`/expired-link`);
    }
  }, [expired]);
  return (
    <>
      {!expired && (
        <>
          <div className="flex">
            <div className={`w-[35%]  h-screen bg-white`}>
              <section className="flex flex-col  h-full justify-around items-start text-start px-16  gap-y-8">
                <div className="flex justify-start text-2xl">LMS</div>
                <div>
                  <div className="gap-y-4">
                    <h1
                      className="text-4xl font-bold"
                      aria-label="Welcome to Lala Back-End Developer Hiring Test"
                    >
                      <span className="flex" aria-hidden="true">
                        Welcome to
                      </span>
                      <span aria-hidden="true">{quizData?.publicLinkName}</span>
                    </h1>
                    <div className="mt-8">
                      <div className="flex gap-8 ">
                        <div>
                          <span className="text-base font-semibold text-gray-500">
                            Test duration
                          </span>
                          <span
                            className="block text-gray-800 text-2xl"
                            data-automation="test-duration"
                          >
                            105 mins
                          </span>
                        </div>
                        <div>
                          <span className="text-base font-semibold text-gray-500">
                            No. of questions
                          </span>
                          <span className="block text-gray-800 text-2xl">
                            4 questions
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center mt-8 text-black text-lg">
                  <div className="mt-8">
                    <div className="flex gap-8 ">
                      <div>
                        <span className="text-base font-semibold text-gray-500">
                          Start Date
                        </span>
                        <span
                          className="block text-gray-800 text-lg"
                          data-automation="test-duration"
                        >
                          10 Nov 2024, 02:12 PM
                        </span>
                      </div>
                      <div>
                        <span className="text-base font-semibold text-gray-500">
                          End Date
                        </span>
                        <span className="block text-gray-800 text-lg">
                          10 Nov 2024, 02:12 PM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div
              className={`w-[65%] h-screen bg-gray-200 overflow-y-scroll custom-scrollbar`}
            >
              {/* awaiting activation */}
              {step === "" ? (
                <section className=" flex flex-col h-full justify-around items-start text-start pl-16 pr-32 p-6 gap-y-6">
                  <div></div>
                  <div>
                    <div className="flex flex-col gap-y-8 mb-8">
                      <div>
                        <div className="text-4xl font-semibold text-black mb-2">
                          Test is awaiting activation. Stay tuned!
                        </div>
                        <div className="text-lg font-medium">
                          Get ready for an exciting quiz! It’s going to be a lot
                          of fun.
                        </div>
                      </div>
                      <div>
                        <div className="w-fit">
                          <div
                            className={`flex justify-around gap-4 border-[2px] rounded-xl border-black p-1`}
                          >
                            <div
                              className={`bg-black items-center flex flex-col p-3 px-6 text-white border-4 border-double border-white rounded-lg `}
                            >
                              <p className="text-center text-3xl mb-2">
                                {timeLeft.days || "00"}
                              </p>
                              <p className="text-lg">Days</p>
                            </div>

                            <div
                              className={`bg-black items-center flex flex-col p-3 px-6 text-white border-4 border-double border-white rounded-lg `}
                            >
                              <p className="text-center text-3xl mb-2">
                                {timeLeft.hours || "00"}
                              </p>
                              <p className="text-lg">Hours</p>
                            </div>
                            <div
                              className={`bg-black items-center flex flex-col p-3 px-6 text-white border-4 border-double border-white rounded-lg `}
                            >
                              <p className="text-center text-3xl mb-2">
                                {timeLeft.minutes || "00"}
                              </p>
                              <p className="text-lg">Minutes</p>
                            </div>
                            <div
                              className={`bg-black items-center flex flex-col p-3 px-6 text-white border-4 border-double border-white rounded-lg `}
                            >
                              <p className="text-center text-3xl mb-2">
                                {timeLeft.seconds || "00"}
                              </p>
                              <p className="text-lg">Seconds</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <div className="flex gap-x-4">
                      <Button
                        variant="solid"
                        className="text-white py-2 px-4 rounded"
                        color="gray-600"
                      >
                        Continue
                      </Button>
                    </div> */}
                    </div>
                  </div>
                  <div></div>
                </section>
              ) : (
                <></>
              )}
              {/* Password */}
              {step === "password" ? (
                <section className=" flex flex-col  h-full justify-around items-start text-start pl-16 pr-32 p-6 gap-y-6">
                  <div></div>
                  <div>
                    <div className="flex flex-col gap-y-8 mb-8">
                      <div>
                        <div className="text-4xl font-semibold text-black mb-2">
                          Password
                        </div>
                        <div className="text-lg font-medium">
                          This content is passowrd protected.To view it please
                          enter your password below :
                        </div>
                      </div>
                      <div className="text-gray-700">
                        <div className="col-span-2">
                          <PasswordInput
                            type="text"
                            placeholder="Please Enter Password"
                            className={errorData.password && "select-error"}
                            onChange={(e) => {
                              setPassword(e.target.value);
                            }}
                            value={password}
                          />
                        </div>
                      </div>
                      <div className="flex gap-x-4">
                        <Button
                          variant="solid"
                          className="text-white py-2 px-4 rounded"
                          color="gray-600"
                          onClick={()=>{
                            setStep("form")
                          }}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </section>
              ) : (
                <></>
              )}
              {/* Instructions */}
              {step === "instructions" ? (
                <section className=" flex flex-col h-full justify-around items-center text-start pl-16 pr-32 p-6 gap-y-6 ">
                  <div></div>
                  <div>
                    <div className="flex flex-col gap-y-8 mb-8">
                      <h2 className="text-4xl font-semibold">Instructions</h2>
                      <div className="text-gray-700">
                        <ol className="flex flex-col  list-decimal list-inside gap-y-2 text-base pl-[30px]">
                          <li className="text-justify">
                            This is a timed test. Please make sure you are not
                            interrupted during the test, as the timer cannot be
                            paused once started.This is a timed test. Please
                            make sure you are not interrupted during the test,
                            as the timer cannot be paused once started.
                          </li>
                          <li>
                            Please ensure you have a stable internet connection.
                          </li>
                          <li>
                            We recommend you to try the sample test for a couple
                            of minutes, before taking the main test.
                          </li>
                          <li>
                            We recommend you to try the sample test for a couple
                            of minutes, before taking the main test.
                          </li>
                          <li>
                            Before taking the test, please go through the FAQs
                            to resolve your queries related to the test or the
                            HackerRank platform.
                          </li>
                          <li>
                            We recommend you to try the sample test for a couple
                            of minutes, before taking the main test.
                          </li>
                          <li>
                            Before taking the test, please go through the FAQs
                            to resolve your queries related to the test or the
                            HackerRank platform.
                          </li>
                        </ol>
                      </div>
                      <div className="flex gap-x-4">
                        <Button
                          variant="solid"
                          className="text-white py-2 px-4 rounded"
                          color="gray-600"
                          onClick={()=>{
                            setStep("password")
                          }}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </section>
              ) : (
                <></>
              )}

              {/* Confirmation Form */}
              {step === "form" ? (
                <section className=" flex flex-col  h-full justify-around items-start text-start pl-16 pr-32 p-6 gap-y-6">
                  <div></div>
                  <div>
                    <div className="flex flex-col gap-y-8 mb-8">
                      <div>
                        <div className="text-4xl font-semibold text-black mb-2">
                          Confirmation Form
                        </div>
                        <div className="text-lg font-medium">
                          Before we start, here is some extra information we
                          need to assess you better.
                        </div>
                      </div>
                      <div>
                        <div className="grid grid-cols-2 gap-4">
                          {quizData.specificField?.map((field, index) => {
                            return (
                              <>
                                {field.type === "number" && (
                                  <div className="col-span-1 mb-4">
                                    <div
                                      className={`font-bold capitalize mb-1 text-gray-${primaryColorLevel}`}
                                    >
                                      {field.label} *
                                    </div>
                                    <div className="col-span-2">
                                      <FormNumericInput
                                        className={
                                          errorData[field.label] &&
                                          "select-error"
                                        }
                                        placeholder={`please enter ${field.label} value`}
                                        onChange={(e) => {
                                          setSpecificField({
                                            ...specificField,
                                            [field.label]: e.target.value
                                          });
                                        }}
                                        value={specificField?.[field.label]}
                                      />
                                    </div>
                                    {DisplayError(errorData[field.label])}
                                  </div>
                                )}
                                {(field.type === "text" ||
                                  field.type === "email") && (
                                  <div className="col-span-1 mb-4">
                                    <div
                                      className={`font-bold capitalize mb-1 text-gray-${primaryColorLevel}`}
                                    >
                                      {field.label} *
                                    </div>
                                    <div className="col-span-2">
                                      <Input
                                        type="text"
                                        className={
                                          errorData[field.label] &&
                                          "select-error"
                                        }
                                        placeholder={`please enter ${field.label} value`}
                                        onChange={(e) => {
                                          setSpecificField({
                                            ...specificField,
                                            [field.label]: e.target.value
                                          });
                                        }}
                                        value={specificField?.[field.label]}
                                      />
                                    </div>
                                    {DisplayError(errorData[field.label])}
                                  </div>
                                )}
                              </>
                            );
                          })}
                        </div>
                        <div className="flex gap-x-4 mt-4">
                          <Button
                            variant="solid"
                            className="text-white py-2 px-4 rounded mt-4"
                            color="gray-600"
                            // onClick={handleSubmit}
                            onClick={onGetStartedClick}
                          >
                            Start Test
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </section>
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Intro;
