import { motion } from "framer-motion"; // Adjust the path as necessary
import { useCountdown } from "utils/hooks/useCountdown";

export const Countdown = ({ onGoClick, quizName }) => {
  const countdown = useCountdown(5);

  return (
    <motion.div
      key={"countdown"}
      variants={{
        initial: {
          background: "#a8abb1",
          clipPath: "circle(0% at 50% 50%)"
        },
        animate: {
          background: "#666769",
          clipPath: "circle(100% at 50% 50%)"
        }
      }}
      className="w-full h-full flex justify-center items-center px-5 py-8"
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center text-white font-bold text-[32px] capitalize">
        <h1>{quizName}</h1>
        <p className="mt-[116px]">Your quiz starts in</p>
        <div className="flex justify-center items-center mt-[38px] rounded-full border-8 border-white w-[196px] h-[196px] bg-transparent">
          {countdown !== 0 ? (
            <span className="text-[118px]">{countdown}</span>
          ) : (
            <span className="text-[88px] cursor-pointer" onClick={onGoClick}>
              GO
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
