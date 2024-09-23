const playSound = (sound) => {
    const audio = new Audio(`/sounds/${sound}`);
    audio.play();
  
    // If page changes, stop playing sound
    const handleBeforeUnload = () => {
      audio.pause();
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  };
  
  export const playCorrectAnswer = () => {
    playSound("correct-answer.mp3");
  };
  
  export const playWrongAnswer = () => {
    playSound("wrong-answer.mp3");
  };
  
  export const playQuizStart = () => {
    playSound("quiz-start.mp3");
  };
  
  export const playQuizEnd = () => {
    playSound("quiz-end.mp3");
  };
  