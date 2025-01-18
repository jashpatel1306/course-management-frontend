import React, { useState } from "react";
import { Avatar, Card } from "components/ui";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TopList = ({ data, title, type }) => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const navigate = useNavigate();

  const [lists] = useState(data ? data : []);

  return (
    <Card>
      <div className="mb-2">
        <h3 className={`text-${themeColor}-${primaryColorLevel}`}>{title}</h3>
      </div>
      {lists.map((info, index) => {
        return (
          <>
            <div
              className={`p-2 hover:bg-${themeColor}-200 rounded-xl cursor-pointer`}
              key={index}
              onClick={() => {
                if (info.url) {
                  navigate(info.url);
                }
              }}
            >
              <div className=" flex items-center  overflow-hidden">
                {/* */}
                {info?.avatar ? (
                  <Avatar
                    className={`border-${themeColor}-${primaryColorLevel} mr-4 border-2 dark:bg-${themeColor}-${primaryColorLevel}`}
                    size={50}
                    src={
                      info.avatar
                        ? info.avatar
                        : "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
                    }
                    shape="circle"
                  />
                ) : (
                  <Avatar
                    className={`border-${themeColor}-${primaryColorLevel} font-semibold text-${themeColor}-${primaryColorLevel} mr-4 border-2 dark:bg-${themeColor}-${primaryColorLevel} bg-indigo-100`}
                    size={50}
                    shape="circle"
                  >
                    {info.name
                      .split(" ") // Split the phrase by spaces
                      .map((word) => word[0]?.toUpperCase()) // Get the first letter of each word and make it uppercase
                      .slice(0, 4)
                      .join("")}
                  </Avatar>
                )}
                <div className="flex flex-col justify-between items-start">
                  <h5
                    className={`font-bold leading-none text-${themeColor}-${primaryColorLevel} mr-2 capitalize`}
                  >
                    {info.name}
                  </h5>
                  {type === "assessments" && (
                    <>
                      <span
                        className={`mt-2 leading-none text-${themeColor}-${primaryColorLevel} mr-2 capitalize`}
                      >
                        {new Date(info.dueDate).toDateString()}
                      </span>
                    </>
                  )}
                </div>
                <hr />
              </div>
            </div>
          </>
        );
      })}
    </Card>
  );
};

export default TopList;
