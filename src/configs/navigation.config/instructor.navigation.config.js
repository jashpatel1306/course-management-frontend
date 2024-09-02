import { INSTRUCTOR_PREFIX_PATH } from "constants/route.constant";
import { NAV_ITEM_TYPE_ITEM } from "constants/navigation.constant";
import { INSTRUCTOR } from "constants/roles.constant";

const instructorNavigationConfig = [
  {
    key: "apps.instructor.dashboard",
    path: `${INSTRUCTOR_PREFIX_PATH}/dashboard`,
    title: "Dashboard",
    icon: "dashboard",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [INSTRUCTOR],
    subMenu: [],
  },
  {
    key: "apps.instructor.mycourses",
    path: `${INSTRUCTOR_PREFIX_PATH}/courses`,
    title: "My Courses",
    icon: "student",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [INSTRUCTOR],
    subMenu: [],
  },
  {
    key: "apps.instructor.assessment",
    path: `${INSTRUCTOR_PREFIX_PATH}/assessment`,
    title: "Assessment",
    icon: "assessment",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [INSTRUCTOR],
    subMenu: [],
  },
  // {
  //   key: "instructor.certificate",
  //   path: `${ADMIN_PREFIX_PATH}/certificate`,
  //   title: "Certificate",
  //   icon: "documentation",
  //   type: NAV_ITEM_TYPE_ITEM,
  //   authority: [INSTRUCTOR],
  //   subMenu: [],
  // },
];

export default instructorNavigationConfig;
