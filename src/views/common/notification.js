import { Notification, toast } from "components/ui";
import React from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";

const openNotification = (type, message) => {
  toast.push(
    <Notification
      type={type}
      duration={type === "success" ? 1000 : 1500}
      title={message}
      customIcon={
        type === "success" ? (
          <AiFillCheckCircle className="text-2xl " color="green" />
        ) : (
          <AiFillCloseCircle className="text-2xl" color="red" />
        )
      }
    />,
    {
      placement: "top-center",
    }
  );
};
export default openNotification;
