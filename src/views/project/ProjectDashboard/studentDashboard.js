import React, { useEffect, useState } from "react";
import { Card } from "components/ui";
import {
  HiOutlineUserGroup,
  HiOutlineUserAdd,
  HiOutlineUsers
} from "react-icons/hi";
import { useSelector } from "react-redux";
import TopList from "./components/toplist";
import axiosInstance from "apiServices/axiosInstance";
import NumberFormat from "react-number-format";
import TopAssessments from "./components/topAssessments";
import openNotification from "views/common/notification";
const StatisticCard = (props) => {
  const { label, value } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  return (
    <Card className={`mb-3`}>
      <div className="flex justify-between items-center">
        <div
          className={`flex items-center gap-2 
            cursor-pointer
          `}
        >
          {/* <Avatar className={avatarClass} size={avatarSize} icon={icon} /> */}
          <div>
            <h6
              className={`font-bold text-lg text-${themeColor}-${primaryColorLevel} capitalize`}
            >
              {label}
            </h6>
            <h3
              className={`font-bold text-xl text-${themeColor}-${primaryColorLevel}`}
            >
              <NumberFormat
                displayType="text"
                value={value}
                thousandSeparator
              />
            </h3>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ClientDashboard = () => {
  const [apiFlag, setApiFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coursesData, setCoursesData] = useState();
  const [coursesTrackingData, setCoursesTrackingData] = useState();
  const [userAssessmentsData, setUserAssessmentsData] = useState();
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`user/student-dashboard`);
      if (response.success) {
        setCoursesData(
          response.data?.courses.map((item) => {
            return {
              name: item.courseName,
              id: item._id
            };
          })
        );
        setUserAssessmentsData(
          response.data?.assessments.map((item) => {
            return {
              name: item.title,
              id: item._id,
              assessmentId: item.assessmentId,
              dueDate: item.dueDate
            };
          })
        );
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `student/student-wise-courses/dashboard`
      );
      if (response.success) {
        setCoursesTrackingData(response.data);
        setLoading(false);
      } else {
        openNotification("danger", response.message);
        setLoading(false);
      }
    } catch (error) {
      console.log("get-all-course error:", error);
      openNotification("danger", error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      fetchData();
      fetchDashboard();
    }
  }, [apiFlag]);
  useEffect(() => {
    setApiFlag(true);
  }, []);
  return (
    <div>
      {!loading && (
        <div className="flex gap-4">
          <StatisticCard
            icon={<HiOutlineUserGroup />}
            label="Total Course"
            value={coursesTrackingData?.total}
          />
          <StatisticCard
            icon={<HiOutlineUsers />}
            label="On Going Course"
            value={coursesTrackingData?.ongoing}
          />
          <StatisticCard
            icon={<HiOutlineUserAdd />}
            label="Completed Course"
            value={coursesTrackingData?.completed}
          />
        </div>
      )}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 mb-6 gap-4">
          <div className="col-span-1 ">
            {!loading && <TopList data={coursesData} title={"Courses"} />}
          </div>
          <div className="col-span-1 ">
            {!loading && (
              <TopAssessments
                data={userAssessmentsData}
                title={"Assessments"}
                type={"assessments"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
