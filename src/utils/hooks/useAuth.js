import { useSelector, useDispatch } from "react-redux";
import { setUser, userLoggedOut } from "store/auth/userSlice";
import { onSignInSuccess, onSignOutSuccess } from "store/auth/sessionSlice";
import appConfig from "configs/app.config";
import { REDIRECT_URL_KEY } from "constants/app.constant";
import { useNavigate } from "react-router-dom";
import useQuery from "./useQuery";
import axiosInstance from "apiServices/axiosInstance";
import { setThemeColor, setThemeColorLevel } from "store/theme/themeSlice";
import { themeConfig } from "configs/theme.config";

function useAuth() {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const query = useQuery();

    const { token, expired } = useSelector((state) => state.auth.session);
    const onThemeColorChange = (value) => {
        dispatch(setThemeColor(value));
    };

    const onThemeColorLevelChange = (value) => {
        dispatch(setThemeColorLevel(value));
    };
    const signIn = async ({ email, password }) => {
        try {
            const formData = {
                email: email.trim(),
                password: password,
            };
            const response = await axiosInstance.post("user/sign-in", formData);
            if (response.status) {
                const { token, data, collegeId, batchId } = response.data;
                dispatch(onSignInSuccess(token));
                const userData = data;
                if (userData) {
                    dispatch(
                        setUser({
                            avatar: userData.avatar ? userData.avatar : "",
                            email: userData.email
                                ? userData.email
                                : "demo@gmail.com",
                            user_name: userData.user_name
                                ? userData.user_name
                                : "Guest",
                            authority: userData.role
                                ? [userData.role]
                                : ["admin"],
                            user_id: userData._id ? userData._id : 0,
                            password: userData.password
                                ? userData.password
                                : "",
                            permissions: userData.permissions
                                ? userData.permissions
                                : [],
                            collegeId: collegeId ? collegeId : "",
                            batchId: batchId ? batchId : "",
                        })
                    );
                }

                const redirectUrl = query.get(REDIRECT_URL_KEY);
                // if (userData.role === INSTRUCTOR) {
                //   navigate(
                //     redirectUrl
                //       ? redirectUrl
                //       : appConfig.instructorAuthenticatedEntryPath
                //   );
                // } else if (userData.role === STUDENT) {
                //   navigate(
                //     redirectUrl ? redirectUrl : appConfig.studentAuthenticatedEntryPath
                //   );
                // } else {
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                );
                // }
                return response;
            } else {
                return response;
            }
        } catch (errors) {
            console.log("signIn error:", errors);
            return {
                status: false,
                message: errors?.response?.data?.message || errors.toString(),
            };
        }
    };

    const handleSignOut = () => {
        dispatch(onSignOutSuccess());
        dispatch(userLoggedOut());
        onThemeColorChange(themeConfig.themeColor);
        onThemeColorLevelChange(themeConfig.primaryColorLevel);
        navigate(appConfig.unAuthenticatedEntryPath);
    };

    const signOut = async () => {
        handleSignOut();
    };

    const checkAuthenticated = () => {
        if (expired > new Date().getTime()) {
            return true;
        } else {
            handleSignOut();
            return false;
        }
    };

    const getUser = async () => {
        try {
            const response = await axiosInstance.get("user/profile");
            if (response) {
                const { data, collegeId, batchId } = response;
                const userData = data;
                
                dispatch(
                    setUser({
                        avatar: userData.avatar ? userData.avatar : "",
                        email: userData.email
                            ? userData.email
                            : "demo@gmail.com",
                        user_name: userData.user_name
                            ? userData.user_name
                            : "Guest",
                        authority: userData.role ? [userData.role] : ["admin"],
                        user_id: userData._id ? userData._id : 0,
                        password: userData.password ? userData.password : "",
                        permissions: userData.permissions
                            ? userData.permissions
                            : [],
                        collegeId: collegeId ? collegeId : "",
                        batchId: batchId ? batchId : "",
                    })
                );
            }
        } catch (errors) {
            console.log("getUser error:", errors);
            return {
                status: false,
                message: errors?.response?.data?.message || errors.toString(),
            };
        }
    };
    return {
        authenticated: token && signIn && checkAuthenticated(),
        signIn,
        signOut,
        getUser,
    };
}

export default useAuth;
