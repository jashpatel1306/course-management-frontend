import { Button, Card } from "components/ui";
import React, { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import BatchList from "./batchList";
import BatchForm from "./batchForm";

const BatchDetails = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [addBatchFlag, setAddBatchFlag] = useState(false);
  const [batchData, setBatchData] = useState();

  const handleAddNewBatchClick = () => {
    setAddBatchFlag(true);
  };
  const handleAddNewBatchCloseClick = () => {
    setAddBatchFlag(false);
  };

  return (
    <>
      <Card>
        <div className="flex items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Batche Details
          </div>
        </div>
      </Card>

    </>
  );
};

export default BatchDetails;
