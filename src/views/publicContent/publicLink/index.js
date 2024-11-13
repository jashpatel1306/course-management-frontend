import { Button, Card } from "components/ui";
import React, { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

import PublicLinkForm from "./components/publicLinkForm";
import PublicLinkList from "./components/publicLinkList";

const PublicLinks = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [addFlag, setAddFlag] = useState(false);
  const [publicLinkData, setPublicLinkData] = useState();
  const [IsOpen, setIsOpen] = useState(false);

  const handleAddNewPublicLinkClick = () => {
    setAddFlag(true);
  };
  const handleAddNewPublicLinkCloseClick = () => {
    setAddFlag(false);
  };

  return (
    <>
      <Card className="mt-4">
        <div className="flex items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Public Links Details
          </div>
          <div className="flex gap-x-4">
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                handleAddNewPublicLinkCloseClick();
                //setSelectObject(item)
                setPublicLinkData();
                setTimeout(() => {
                  handleAddNewPublicLinkClick();
                }, 50);
              }}
            >
              Generate Public Link
            </Button>
          </div>
        </div>
      </Card>
      <Card className="mt-4">
        <PublicLinkList
          flag={addFlag}
          parentCloseCallback={handleAddNewPublicLinkCloseClick}
          parentCallback={handleAddNewPublicLinkClick}
          setData={setPublicLinkData}
          refreshFlag={!IsOpen}
        />
      </Card>
      <PublicLinkForm
        isOpen={addFlag}
        handleCloseClick={handleAddNewPublicLinkCloseClick}
        setData={setPublicLinkData}
        publicLinkData={publicLinkData}
      />
    </>
  );
};

export default PublicLinks;
