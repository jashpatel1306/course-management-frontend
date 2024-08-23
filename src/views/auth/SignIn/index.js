import React from "react";
import SignInForm from "./signInForm";
import { useSelector } from "react-redux";
const SignIn = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  return (
    <>
      <div className="mt-2 mb-8">
        <p
          className={`mb-1 text-xl font-bold text-${themeColor}-${primaryColorLevel}`}
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
