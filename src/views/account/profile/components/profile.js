/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Input, Avatar, Upload, Button, FormContainer } from "components/ui";
import FormRow from "./formRow";
import { Field, Form, Formik } from "formik";
import {
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlineUser,
} from "react-icons/hi";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import { setUser } from "store/auth/userSlice";

const validationSchema = Yup.object().shape({
  user_name: Yup.string()
    .min(3, "Too Short!")
    .max(40, "Too Long!")
    .required("User Name Required"),
  email: Yup.string().email("Invalid email").required("Email Required"),
  avatar: Yup.string(),
});

const Profile = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    user_id: "",
    user_name: "",
    email: "",
    avatar: "",
    profile: null,
    active: true,
  });
  const [apiFlag, setApiFlag] = useState(false);

  const onSetFormFile = (form, field, file) => {
    form.setFieldValue(field.name, URL.createObjectURL(file[0]));
  };
  const getUserData = async () => {
    try {
      const response = await axiosInstance.get(`user/profile`);
      if (response.status) {
        //   setDeleteIsOpen(false);
        if (response.data) {
          const temp = response.data;
          setFormData({
            ...formData,
            user_id: temp._id,
            user_name: temp.user_name,
            email: temp.email,
            avatar: temp.avatar,
            active: temp.active,
          });
        }
      } else {
        openNotification(
          "danger",
          response.message ? response.message : "Error In Api Calling"
        );
      }
    } catch (error) {
      console.log("getUserData error:", error);
      openNotification("danger", error.message);
    }
  };
  useEffect(() => {
    if (apiFlag && userData.user_id) {
      getUserData();
      setApiFlag(false);
    }
  }, [apiFlag]);
  useEffect(() => {
    setApiFlag(true);
  }, []);

  const onFormSubmit = async (values, setSubmitting) => {
    try {
      const response = await axiosInstance.put(
        `user/update-user-profile`,
        formData
      );
      if (response.status) {
        const temp = response.data;
        setFormData({
          ...formData,
          user_name: temp.user_name,
          avatar: temp.avatar,
          active: temp.active,
        });
        dispatch(
          setUser({
            avatar: temp.avatar
              ? temp.avatar
              : "https://espo-live.s3.us-west-1.amazonaws.com/content/images/logo/30698015106821034319.webp",
            user_name: temp.user_name ? temp.user_name : "Guest",
            email: temp.email ? temp.email : "demo@gmail.com",
            authority: temp.role ? [temp.role] : ["admin"],
            user_id: temp.user_id ? temp.user_id : 0,
            password: temp.password ? temp.password : "",
          })
        );
        setFormData({ ...formData, profile: null });
        setSubmitting(false);
        openNotification("success", response.message);
      } else {
        setSubmitting(false);
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("onFormSubmit error: ", error);
      openNotification("danger", error.message);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={formData}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        onFormSubmit(values, setSubmitting);
      }}
    >
      {({ values, touched, errors, isSubmitting, resetForm }) => {
        const validatorProps = { touched, errors };
        return (
          <Form>
            <FormContainer>
              <FormRow name="avatar" label="Avatar" {...validatorProps}>
                <Field name="avatar">
                  {({ field, form }) => {
                    return (
                      <Upload
                        className="cursor-pointer"
                        onChange={(files) => {
                          setFormData({
                            ...formData,
                            profile: files[0],
                            avatar: URL.createObjectURL(files[0]),
                          });
                          onSetFormFile(form, field, files);
                        }}
                        // onFileRemove={files => onSetFormFile(form, field, files)}
                        showList={false}
                        uploadLimit={1}
                      >
                        <Avatar
                          className="border-2 border-white dark:border-gray-800 shadow-lg"
                          size={90}
                          shape="circle"
                          icon={<HiOutlineUser />}
                          src={formData?.avatar}
                          // {...avatarProps}
                        />
                      </Upload>
                    );
                  }}
                </Field>
              </FormRow>
              <FormRow name="user_name" label="Name" {...validatorProps}>
                <Field
                  type="text"
                  autoComplete="off"
                  name="user_name"
                  placeholder="Name"
                  component={Input}
                  className="capitalize"
                  onChange={(e) =>
                    setFormData({ ...formData, user_name: e.target.value })
                  }
                  prefix={<HiOutlineUserCircle className="text-xl" />}
                />
              </FormRow>
              <FormRow name="email" label="Email" {...validatorProps}>
                <Field
                  type="email"
                  autoComplete="off"
                  name="email"
                  placeholder="Email"
                  component={Input}
                  disabled={true}
                  prefix={<HiOutlineMail className="text-xl" />}
                />
              </FormRow>

              <div className="mt-4 ltr:text-right">
                <Button variant="solid" loading={isSubmitting} type="submit">
                  {isSubmitting ? "Updating" : "Update"}
                </Button>
              </div>
            </FormContainer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default Profile;
