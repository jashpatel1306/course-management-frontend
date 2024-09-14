import axiosInstance from "apiServices/axiosInstance";
import openNotification from "./notification";
const FileUpload = async (image, path) => {
  try {
    const response = await axiosInstance.post(`user/upload-file`, {
      image: image,
      path: path,
    });
    if (response.success) {
      openNotification("success", response.message);
      return { status: true, message: response.message, data: response.data };
    } else {
      openNotification("danger", response.message);
      return { status: false, message: response.message };
    }
  } catch (error) {
    console.log("File Upload Error: ", error);
    openNotification("danger", error.message);
    return { status: false, message: error.message };
  }
};
export default FileUpload;
