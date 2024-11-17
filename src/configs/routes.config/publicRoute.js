import React from "react";
import { QUIZ_PREFIX_PATH } from "constants/route.constant";

const appsRoute = [
  {
    key: "apps.publicQuiz",
    path: `${QUIZ_PREFIX_PATH}/:quizId/public`,
    component: React.lazy(() => import("views/publicQuiz")),
    authority: [],
    meta: {
      layout: "blank",
      pageContainerType: "gutterless",
      footer: false
    }
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

export default appsRoute;
