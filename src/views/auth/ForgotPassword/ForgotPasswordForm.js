import React, { useState } from "react";
import { Input, Button, FormItem, FormContainer, Alert } from "components/ui";
import { ActionLink } from "components/shared";
import useTimeOutMessage from "utils/hooks/useTimeOutMessage";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axiosInstance from "apiServices/axiosInstance";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Please enter your email"),
});

const validationOTPSchema = Yup.object().shape({
  otp: Yup.number().required("Please Enter OTP"),
});

const ForgotPasswordForm = (props) => {
  const { disableSubmit = false, className, signInUrl = "/sign-in" } = props;

  const navigate = useNavigate();
  
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState();

  const [message, setMessage] = useTimeOutMessage();

  const onSendMail = async (values, setSubmitting) => {
    setEmail(values?.email?.toLowerCase().trim());
    setSubmitting(true);

    try {
      const resp = await axiosInstance.post("user/forgot-password", values);
      if (resp?.status) {
        setEmailSent(true);
      } else {
        setMessage(resp?.message);
      }
    } catch (errors) {
      setMessage(errors?.response?.data?.message || errors.toString());
    } finally {
      setSubmitting(false);
    }
  };

  const onOTPVerification = async (values, setSubmitting) => {
    setSubmitting(true);
    const otpData = { email: email, otp: values?.otp.toString() };

    try {
      const response = await axiosInstance.post("user/verify-otp", otpData);
      if (response?.status) {
        navigate(`/reset-password/${response?.user_id}`);
      } else {
        setSubmitting(false);
        setMessage(response?.message);
      }
    } catch (err) {
      console.log("onOTPVerification error : ", err);
      setMessage(err?.response?.data?.message || err.toString());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <div className="mb-6">
        {emailSent ? (
          <>
            <h3 className="mb-1">Check your email</h3>
            <p>We have sent a OTP to your email, please enter here</p>
            {message && (
              <Alert className="mb-4" type="danger" showIcon>
                {message}
              </Alert>
            )}
            <Formik
              initialValues={{
                otp: "",
              }}
              validationSchema={validationOTPSchema}
              onSubmit={(values, { setSubmitting }) => {
                if (!disableSubmit) {
                  onOTPVerification(values, setSubmitting);
                } else {
                  setSubmitting(false);
                }
              }}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form className="mt-4">
                  <FormContainer>
                    <div>
                      <FormItem
                        invalid={errors.otp && touched.otp}
                        errorMessage={errors.otp}
                      >
                        <Field
                          type="number"
                          autoComplete="off"
                          name="otp"
                          placeholder="Enter OTP"
                          component={Input}
                        />
                      </FormItem>
                    </div>
                    <Button
                      block
                      loading={isSubmitting}
                      variant="solid"
                      type="submit"
                    >
                      Submit
                    </Button>
                  </FormContainer>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <>
            <h3 className="mb-1">Forgot Password</h3>
            <p>
              Please enter your email address to receive a verification code
            </p>
            {message && (
              <Alert className="mb-4" type="danger" showIcon>
                {message}
              </Alert>
            )}
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                if (!disableSubmit) {
                  onSendMail(values, setSubmitting);
                } else {
                  setSubmitting(false);
                }
              }}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form className="my-4">
                  <FormContainer>
                    <div>
                      <FormItem
                        invalid={errors.email && touched.email}
                        errorMessage={errors.email}
                      >
                        <Field
                          type="email"
                          autoComplete="off"
                          name="email"
                          placeholder="Email"
                          component={Input}
                        />
                      </FormItem>
                    </div>
                    <Button
                      block
                      loading={isSubmitting}
                      variant="solid"
                      type="submit"
                    >
                      {emailSent ? "Resend Email" : "Send Email"}
                    </Button>
                    <div className="mt-4 text-center">
                      <span>Back to </span>
                      <ActionLink to={signInUrl}>Sign in</ActionLink>
                    </div>
                  </FormContainer>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
