import React, { useState } from "react";
import SignInForm from "./SignInForm";

import {
  Input,
  Button,
  Checkbox,
  FormItem,
  FormContainer,
  Alert,
} from "components/ui";
import { PasswordInput, ActionLink } from "components/shared";
import useTimeOutMessage from "utils/hooks/useTimeOutMessage";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import useAuth from "utils/hooks/useAuth";

const SignIn = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  // detect wallet
  //   window.onload = async function () {
  //     try {
  //       if (window.ethereum) {
  //         const ethereum = window.ethereum;
  //         if (ethereum.isMetaMask) {
  //           const res = await ethereum.enable();
  //           // console.log(`connected with public key,`, res);
  //           setWalletAddress(res.toString());
  //         } else {
  //           window.open("https://metamask.io/download/");
  //         }
  //       }
  //     } catch (err) {
  //       console.log(err, "err");
  //     }
  //   };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const ethereum = window.ethereum;
        if (ethereum.isMetaMask) {
          const res = await ethereum.enable();
          // console.log(`connected with public key,`, res);
          setWalletAddress(res.toString());
        } else {
          window.open("https://metamask.io/download/");
        }
      }
    } catch (err) {
      console.log(err, "err");
    }

    if (window.ethereum) {
      const ethereum = window.ethereum;
      const res = await ethereum.enable();
      setWalletAddress(res.toString());
    } else {
      // alert("Phantom Wallet not found");
      window.open("https://metamask.io/download/");
    }
  };

  return (
    <>
      <div className="mb-8">
        <h3 className="mb-1">Welcome back!</h3>
        <p>Please enter your credentials to sign in!</p>
      </div>
      <SignInForm disableSubmit={false} />
    </>
  );
};

export default SignIn;
