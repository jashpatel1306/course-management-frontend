/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  Input,
  Button,
  Checkbox,
  FormItem,
  FormContainer,
} from "components/ui";
import { PasswordInput, ActionLink } from "components/shared";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import useAuth from "utils/hooks/useAuth";
import openNotification from "views/common/notification";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Please enter valid user name")
    .required("Please enter your user name"),
  password: Yup.string().trim().required("Please enter your password"),
  rememberMe: Yup.bool(),
});

const SignInForm = (props) => {
  const {
    disableSubmit = false,
    className,
    forgotPasswordUrl = "/forgot-password",
  } = props;

  const { signIn } = useAuth();

  const onSignIn = async (values, setSubmitting) => {
    const { email, password } = values;
    setSubmitting(true);
    const result = await signIn({ email, password });
    if (result.status) {
      openNotification("success", result.message);
    } else {
      openNotification("danger", result.message);
    }

    setSubmitting(false);
  };

  return (
    <>
      <div className={className}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: true,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            if (!disableSubmit) {
              onSignIn(values, setSubmitting);
            } else {
              setSubmitting(false);
            }
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <FormContainer>
                <FormItem
                  label="Username"
                  invalid={errors.email && touched.email}
                  errorMessage={errors.email}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="email"
                    placeholder="Enter the Username"
                    component={Input}
                  />
                </FormItem>

                <FormItem
                  label="Password"
                  invalid={errors.password && touched.password}
                  errorMessage={errors.password}
                >
                  <Field
                    autoComplete="off"
                    name="password"
                    placeholder="Enter the Password"
                    component={PasswordInput}
                  />
                </FormItem>
                <div className="flex justify-between mb-6">
                  <Field
                    className="mb-0"
                    name="rememberMe"
                    component={Checkbox}
                    children="Remember Me"
                  />
                  <ActionLink to={forgotPasswordUrl}>
                    Forgot Password?
                  </ActionLink>
                </div>
                <Button
                  block
                  loading={isSubmitting}
                  variant="solid"
                  type="submit"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </FormContainer>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default SignInForm;
