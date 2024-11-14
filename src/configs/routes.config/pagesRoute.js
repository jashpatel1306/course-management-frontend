import React from "react";
import { PAGES_PREFIX_PATH } from "constants/route.constant";

const pagesRoute = [
  {
    key: "pages.welcome",
    path: `${PAGES_PREFIX_PATH}/welcome`,
    component: React.lazy(() => import("views/pages/Welcome")),
    authority: []
  },
  {
    key: "pages.accessDenied",
    path: "/access-denied",
    component: React.lazy(() => import("views/pages/AccessDenied")),
    authority: []
  },
  
];

export default pagesRoute;
