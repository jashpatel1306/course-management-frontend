import axiosInstance from "apiServices/axiosInstance";
import React, { useEffect, useState } from "react";
import TopList from "./components/toplist";

const StudentDashboard = () => {
  const [apiFlag, setApiFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coursesData, setCoursesData] = useState();
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
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      fetchDashboard();
    }
  }, [apiFlag]);
  useEffect(() => {
    setApiFlag(true);
  }, []);
  return (
    <>
      <div>
        <iframe
          src="https://stackblitz.com/edit/vitejs-vite-wvkngk2z?file=index.html,src%2FApp.jsx&terminal=dev"
          title="W3Schools Free Online Web Tutorials"
          width="100%"
          height="900px"
        ></iframe>

        <div className="grid grid-cols-1 md:grid-cols-4 mb-6 gap-4">
          <div className="col-span-1 ">
            {!loading && <TopList data={coursesData} title={"Courses"} />}
          </div>
          <div className="col-span-1 ">
            {!loading && (
              <TopList
                data={userAssessmentsData}
                title={"Assessments"}
                type={"assessments"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
