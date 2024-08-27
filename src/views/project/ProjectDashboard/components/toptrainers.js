import React, { useEffect, useState } from "react";
import { Avatar, Card } from "components/ui";
import NumberFormat from "react-number-format";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TopTrainer = () => {
  const navigate = useNavigate();
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [gyms, setGyms] = useState([
    {
      trainer_name: "Eileen Horton",
      trainer_rating: 4.9,
    },
    {
      trainer_name: "Terrance Moreno",
      trainer_rating: 4.9,
    },
    {
      trainer_name: "Ron Vargas",
      trainer_rating: 4.9,
    },
    {
      trainer_name: "Luke Cook",
      trainer_rating: 4.9,
    },
    {
      trainer_name: "Samantha Phillips",
      trainer_rating: 4.9,
    },
  ]);

  return (
    <Card>
      <div className="mb-2">
        <h3 className={`text-${themeColor}-${primaryColorLevel}`}>
          Top Trainers
        </h3>
      </div>
      {gyms.map((info, index) => {
        return (
          <>
           
            <div
              className={`p-2 hover:bg-${themeColor}-200 rounded-xl cursor-pointer`}
              onClick={() => {}}
            >
              <div className=" flex items-center  overflow-hidden">
                <Avatar
                  className={`border-${themeColor}-${primaryColorLevel} mr-4 border-2 dark:bg-${themeColor}-${primaryColorLevel}`}
                  size={50}
                  src={`/img/avatars/thumb-${index+1}.jpg`}
                  shape="circle"
                />

                <div className="flex justify-between items-center">
                  <h5
                    className={`font-bold leading-none text-${themeColor}-${primaryColorLevel} mr-2`}
                  >
                    {info.trainer_name}
                  </h5>
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

export default TopTrainer;
