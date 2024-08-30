import React from "react";
import ReactQuill from "react-quill";
const Instructors = () => {
  return (
    <>
      <div>
      <iframe
        style={{
          width: "100%",
          height: 500,
          outline: "1px solid #252525",
          border: 0,
          borderRadius: 8,
          marginBottom: 16,
          // zIndex: 100,
        }}
        src="https://codesandbox.io/p/sandbox/panthil-g5wj8f"
      ></iframe>
      </div>

     <div className="">
     <ReactQuill
        // modules={answerModules}
        theme="snow"
        placeholder="Add an answer..."
        className="bg-white h-96"
      />
     </div>
    </>
  );
};

export default Instructors;
