import { Close, Tick } from "assets/svg";
import parse from "html-react-parser";

// Create the badges as functional components for better readability
const CorrectAnswerBadge = () => (
  <div className="bg-[#56c490] text-white px-3 py-2 flex items-center justify-center space-x-2 rounded-[53px]">
    <Tick />
    <p className="text-xs font-jakarta font-medium">Correct answer</p>
  </div>
);

const WrongAnswerBadge = () => (
  <div className="bg-[#ff6a66] text-white px-3 py-2 flex items-center justify-center space-x-2 rounded-[53px]">
    <Close />
    <p className="text-xs font-jakarta font-medium">Your answer</p>
  </div>
);

export const OptionList = ({
  answers,
  selectedAnswerIndex,
  onAnswerSelected,
  isCorrectAnswer,
  activeQuestion,
}) => {
  // const correctAnswerIndex = answers.findIndex(
  //   (option) => option === activeQuestion.correctAnswer
  // );

  // const renderSelectedOptionBadge = (idx) => {
  //   if (selectedAnswerIndex === -1) {
  //     return null;
  //   }

  //   if (selectedAnswerIndex === idx) {
  //     return (
  //       <div className="absolute top-[50%] -translate-y-1/2 right-2 z-10">
  //         {isCorrectAnswer ? <CorrectAnswerBadge /> : <WrongAnswerBadge />}
  //       </div>
  //     );
  //   }
  // };

  // const renderCorrectBadge = (idx) => {
  //   if (selectedAnswerIndex === -1) {
  //     return null;
  //   }

  //   if (correctAnswerIndex === idx) {
  //     return (
  //       <div className="absolute top-[50%] -translate-y-1/2 right-2 z-10">
  //         <CorrectAnswerBadge />
  //       </div>
  //     );
  //   }
  // };

  return (
    <div className="flex flex-col items-start gap-y-4">
      {answers.map((option, idx) => (
        <div
          key={option._id}
          className={`relative font-jakarta flex items-center space-x-2 rounded-xl border px-6 py-4 w-full cursor-pointer select-none ${
            option._id === selectedAnswerIndex
              ? "border-[#374cb7]"
              : "border-[#c0bbbb]"
          }`}
          onClick={() => {
            // if (selectedAnswerIndex !== -1) {
            //   return;
            // }
            onAnswerSelected(option._id);
          }}
        >
          <div
            className={`w-7 h-7 shrink-0 rounded-full border-[3px] flex items-center justify-center ${
              option._id === selectedAnswerIndex
                ? "border-[#374cb7]"
                : "border-gray-600"
            }`}
          >
            <div
              className={`flex justify-center items-center w-4 h-4 rounded-full bg-white ${
                option._id === selectedAnswerIndex ? "bg-white" : "bg-gray-200"
              }`}
            >
              {String.fromCharCode(65 + idx)}
            </div>
          </div>
          <p className="text-brand-midnight font-normal text-base ml-4">
            {parse(
              option.content
                .replaceAll("<pre", `<code><pre`)
                .replaceAll("</pre>", `</pre></code>`)
            )}
          </p>
          {/* {renderSelectedOptionBadge(idx)}
          {renderCorrectBadge(idx)} */}
        </div>
      ))}
    </div>
  );
};
