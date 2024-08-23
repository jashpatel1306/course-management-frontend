import React from "react";

import { useSelector } from "react-redux";
import SignInForm from "./signInForm.js";
const SignIn = () => {
 

  return (
    <>
      <div className="mt-2 mb-8">
        <p
          // className={`mb-1 text-xl font-bold text-${themeColor}-${primaryColorLevel}`}
          className={`mb-1 text-xl font-bold `}

        >
          Welcome To LMS
        </p>
        <p>Please enter your credentials to sign in!</p>
      </div>

      <SignInForm disableSubmit={false} />
    </>
  );
};

export default SignIn;
