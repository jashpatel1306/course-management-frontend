import { Button, Card, Upload } from "components/ui";
import React, { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import BatchList from "./components/batchList";
import BatchForm from "./components/batchForm";

const Students = () => {
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
            Batches
          </div>
          <div>
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                handleAddNewBatchCloseClick();
                //setSelectObject(item)
                setBatchData();
                setTimeout(() => {
                  handleAddNewBatchClick();
                }, 50);
              }}
            >
              Add New Batches
            </Button>
          </div>
        </div>
      </Card>

      <div className="p-2">
        <BatchList
          flag={addBatchFlag}
          parentCloseCallback={handleAddNewBatchCloseClick}
          parentCallback={handleAddNewBatchClick}
          batchData={batchData}
          setData={setBatchData}
        />
      </div>

      <BatchForm
        isOpen={addBatchFlag}
        handleCloseClick={handleAddNewBatchCloseClick}
        setBatchData={setBatchData}
        batchData={batchData}
      />
    </>
  );
};

export default Students;
