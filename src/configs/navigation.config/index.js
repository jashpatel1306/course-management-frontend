import adminNavigationConfig from "./admin.navigation.config";
import studentNavigationConfig from "./student.navigation.config";
import userProfileNavigationConfig from "./userProfile.navigation.config";

const navigationConfig = [
  ...adminNavigationConfig,
  ...userProfileNavigationConfig,
  ...studentNavigationConfig,
];

export default navigationConfig;
