import {
  QUIZ_PREFIX_PATH,
  STUDENT_PREFIX_PATH
} from "constants/route.constant";
import React from "react";

const authRoute = [
  {
    key: "signIn",
    path: `/sign-in`,
    component: React.lazy(() => import("views/auth/SignIn")),
    authority: []
  },
  {
    key: "signUp",
    path: `/sign-up`,
    component: React.lazy(() => import("views/auth/SignUp")),
    authority: []
  },
  {
    key: "forgotPassword",
    path: `/forgot-password`,
    component: React.lazy(() => import("views/auth/ForgotPassword")),
    authority: []
  },
  {
    key: "resetPassword",
    path: `/reset-password/:id`,
    component: React.lazy(() => import("views/auth/ResetPassword")),
    authority: []
  },

  {
    key: "pages.expiredLink",
    path: "/expired-link",
    component: React.lazy(() => import("views/pages/expiredLink")),
    authority: [],
    meta: {
      layout: "blank",
      pageContainerType: "gutterless",
      footer: false
    }
  }
];

export default authRoute;
