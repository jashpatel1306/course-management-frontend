import React from "react";
import { Button, FormContainer } from "components/ui";
import FormDesription from "./formDesription";
import FormRow from "./formRow";
import { Field, Form, Formik } from "formik";

import * as Yup from "yup";
import useEncryption from "common/useEncryption";
import axiosInstance from "apiServices/axiosInstance";
import { useSelector } from "react-redux";
import openNotification from "views/common/notification";
import { PasswordInput } from "components/shared";
import useAuth from "utils/hooks/useAuth";

const validationSchema = Yup.object().shape({
  password: Yup.string().required("Password Required"),
  newPassword: Yup.string()
    .required("Enter your new password")
    .min(8, "Password must be 8 characters long")
    // .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    // .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), null],
    "Password not match"
  ),
});

const Password = () => {
  const { signOut } = useAuth();
  const onFormSubmit = async (values, setSubmitting) => {
    try {
      let infoData = {
        oldPassword: values.password,
        newPassword: values.newPassword,
      };

      const response = await axiosInstance.post(
        `user/reset-password`,
        infoData
      );
      if (response.status) {
        setSubmitting(false);
        openNotification("success", response.message);
        signOut();
      } else {
        setSubmitting(false);

        openNotification(
          "danger",
          response.message ? response.message : response
        );
      }
    } catch (error) {
      console.log("onFormSubmit error: ", error);
      openNotification("danger", error.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          password: "",
          newPassword: "",
          confirmNewPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          setTimeout(() => {
            onFormSubmit(values, setSubmitting);
          }, 1000);
        }}
      >
        {({ values, touched, errors, isSubmitting, resetForm }) => {
          const validatorProps = { touched, errors };
          return (
            <Form>
              <FormContainer>
                <FormDesription
                  title="Password"
                  desc="Enter your current & new password to reset your password"
                />
                <FormRow
                  name="password"
                  label="Current Password"
                  {...validatorProps}
                >
                  <Field
                    type="password"
                    autoComplete="off"
                    // suffix={passwordVisible}
                    name="password"
                    placeholder="Current Password"
                    component={PasswordInput}
                  />
                </FormRow>
                <FormRow
                  name="newPassword"
                  label="New Password"
                  {...validatorProps}
                >
                  <Field
                    type="password"
                    autoComplete="off"
                    name="newPassword"
                    // suffix={passwordVisible}
                    placeholder="New Password"
                    component={PasswordInput}
                  />
                </FormRow>
                <FormRow
                  name="confirmNewPassword"
                  label="Confirm Password"
                  {...validatorProps}
                >
                  <Field
                    type="password"
                    autoComplete="off"
                    name="confirmNewPassword"
                    // suffix={passwordVisible}
                    placeholder="Confirm Password"
                    component={PasswordInput}
                  />
                </FormRow>
                <div className="mt-4 ltr:text-right">
                  <Button
                    className="ltr:mr-2 rtl:ml-2"
                    type="button"
                    onClick={resetForm}
                  >
                    Reset
                  </Button>
                  <Button variant="solid" loading={isSubmitting} type="submit">
                    {isSubmitting ? "Updating" : "Update Password"}
                  </Button>
                </div>
              </FormContainer>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Password;
