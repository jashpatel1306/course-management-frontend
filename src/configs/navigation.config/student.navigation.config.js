import { ADMIN_PREFIX_PATH } from "constants/route.constant";
import { NAV_ITEM_TYPE_ITEM } from "constants/navigation.constant";
import { STUDENT } from "constants/roles.constant";

const studentNavigationConfig = [
  {
    key: "apps.student.mycourses",
    path: `${ADMIN_PREFIX_PATH}/students`,
    title: "My Courses",
    icon: "student",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [STUDENT],
    subMenu: [],
  },
  {
    key: "apps.assessment",
    path: `${ADMIN_PREFIX_PATH}/assessment`,
    title: "Assessment",
    icon: "assessment",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [STUDENT],
    subMenu: [],
  },
  {
    key: "apps.certificate",
    path: `${ADMIN_PREFIX_PATH}/certificate`,
    title: "Certificate",
    icon: "documentation",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [STUDENT],
    subMenu: [],
  },
];

export default studentNavigationConfig;
