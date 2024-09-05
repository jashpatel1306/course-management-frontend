import { Button, Card } from "components/ui";
import React from "react";
import { HiArrowNarrowLeft, HiOutlinePencil } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const CourseContentForm = () => {
  const navigate = useNavigate();
  const { course_id } = useParams();
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  return (
    <>
      <div className="flex items-center mb-4">
        <div className="text-xl font-semibold text-center mr-4">
          <Button
            className={`back-button px-1 font-bold text-${themeColor}-${primaryColorLevel} border-2 border-${themeColor}-${primaryColorLevel} dark:text-white`}
            size="sm"
            icon={<HiArrowNarrowLeft size={30} />}
            onClick={async () => {
              navigate("/app/admin/colleges");
            }}
          />
        </div>
        <h4
          className={`text-2xl font-semibold text-${themeColor}-${primaryColorLevel} dark:text-white`}
        >
          Course Content Details
        </h4>
      </div>

      <Card>
        <div className="flex justify-between items-center">
          <div
            className={`text-lg font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Bachelor of Visual Communication (B.V.C)
          </div>
          <Button
            variant="twoTone"
            icon={<HiOutlinePencil />}
            className={`border border-${themeColor}-${primaryColorLevel}`}
            onClick={async () => {
              navigate("/app/student/quiz");
            }}
          >
            <span>Edit</span>
          </Button>
        </div>
      </Card>
    </>
  );
};

export default CourseContentForm;
