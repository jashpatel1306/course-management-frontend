import React from "react";
import { Navigate } from "react-router-dom";
import useAuthority from "utils/hooks/useAuthority";

const AuthorityGuard = (props) => {
  const { userAuthority = [], authority = [], children, key } = props;

  const roleMatched = useAuthority(userAuthority, authority, key);

  return roleMatched ? children : <Navigate to="/access-denied" />;
};

export default AuthorityGuard;
