import { Button, Card } from "components/ui";
import React from "react";
import { HiPlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import CourseCard from "./CourseCard";
const StudentsContent = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  return (
    <>
      <Card>
        <div className="flex items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Student Content
          </div>
          <div>
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                // handleAddNewBatchCloseClick();
                // //setSelectObject(item)
                // setBatchData();
                // setTimeout(() => {
                //   handleAddNewBatchClick();
                // }, 50);
              }}
            >
              Add New Content
            </Button>
          </div>
        </div>
      </Card>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 bg-gray-100 mt-4">
          {[...Array(12).keys()].map((item,index) =>{
            return (
              <CourseCard key={item} index={index} />
            );
          })}
          
        </div>
      </div>
    </>
  );
};

export default StudentsContent;
