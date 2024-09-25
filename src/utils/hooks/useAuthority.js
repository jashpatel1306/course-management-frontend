import { useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
function hasPermission(permissions, key) {
  return permissions.some(
    (permission) => toCamelCase(permission) === key.split("apps.")[1]
  );
}
function useAuthority(
  userAuthority = [],
  authority = [],
  emptyCheck = false,
  key = ""
) {
  const { userData } = useSelector((state) => state.auth.user);
  const { permissions } = userData;
  const roleMatched = useMemo(() => {
    return authority.some((role) => userAuthority.includes(role));
  }, [authority, userAuthority]);

  if (
    isEmpty(authority) ||
    isEmpty(userAuthority) ||
    typeof authority === "undefined"
  ) {
    return !emptyCheck;
  }
  if (userAuthority[0] === "staff" && key) {
    const staffPermissionStatus = hasPermission(permissions, key);
   
    return staffPermissionStatus;
  } else {
    return roleMatched;
  }
}

export default useAuthority;
