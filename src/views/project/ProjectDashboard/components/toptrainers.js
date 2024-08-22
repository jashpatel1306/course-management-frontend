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
          Top 5 Trainers
        </h3>
      </div>
      {gyms.map((info, index) => {
        return (
          <>
            <div
              className={`p-2 grid grid-cols-4  mb-3 gap-4
              cursor-pointer bg-${themeColor}-50 rounded-lg
            `}
            >
              <div className="col-span-3 ">
                <div className="flex items-center">
                  <p
                    className={`bg-${themeColor}-${primaryColorLevel} py-1 px-3 mr-4 rounded-lg text-xl text-white font-bold`}
                  >
                    {index + 1}
                  </p>
                  <h6
                    className={`font-bold text-lg text-${themeColor}-${primaryColorLevel} capitalize`}
                  >
                    {info.trainer_name}
                  </h6>
                </div>
              </div>
              <div className="col-start-4 flex justify-end ">
                <h3
                  className={`font-bold text-xl text-${themeColor}-${primaryColorLevel}`}
                >
                  <NumberFormat
                    displayType="text"
                    value={info.trainer_rating}
                    thousandSeparator
                  />
                </h3>
              </div>
            </div>
          </>
        );
      })}
    </Card>
  );
};

export default TopTrainer;
