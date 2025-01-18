import React from "react";
import SignInForm from "./SignInForm";
const SignIn = () => {
    return (
        <>
            <div className="mt-2 mb-8 text-black">
                <p
                    // className={`mb-1 text-xl font-bold text-${themeColor}-${primaryColorLevel}`}
                    className={`mb-1 text-2xl font-bold `}
                >
                    Welcome
                </p>
                <p className="text-base">Please Log in to admin dashboard</p>
            </div>

            <SignInForm disableSubmit={false} />
        </>
    );
};

export default SignIn;
