import axiosInstance from "apiServices/axiosInstance";
import { Avatar, Button } from "components/ui";
import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import openNotification from "views/common/notification";

const BatchScroller = (props) => {
  const { flag } = props;
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [showScrollButtons, setShowScrollButtons] = useState({
    left: false,
    right: true,
  });
  const [batchData, setBatchData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [apiFlag, setApiFlag] = useState(false);

  const updateButtonVisibility = () => {
    if (containerRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = containerRef.current;
      console.log(
        "scrollWidth, clientWidth, scrollLeft : ",
        scrollWidth,
        clientWidth,
        scrollLeft
      );
      setShowScrollButtons({
        left: scrollLeft > 0,
        right: scrollLeft <= scrollWidth - clientWidth,
      });
    }
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -containerRef.current.clientWidth * 0.8,
        behavior: "smooth",
      });
      // Update button visibility after scrolling
      setTimeout(updateButtonVisibility, 300); // Delay to ensure scroll effect
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.clientWidth * 0.8,
        behavior: "smooth",
      });
      // Update button visibility after scrolling
      setTimeout(updateButtonVisibility, 300); // Delay to ensure scroll effect
    }
  };

  useEffect(() => {
    // Initial visibility check
    updateButtonVisibility();

    // Add event listener for window resize to adjust button visibility
    window.addEventListener("resize", updateButtonVisibility);
    console.log(
      "containerRef.current.clientWidth : ",
      containerRef.current.clientWidth
    );
    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", updateButtonVisibility);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`user/batches-option`);
      console.log("response : ", response);
      if (response.success) {
        response.data.shift();
        setBatchData(response.data);
        setIsLoading(false);
      } else {
        openNotification("danger", response.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-batch error:", error);
      openNotification("danger", error.message);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setIsLoading(true);
      fetchData();
    }
  }, [apiFlag]);
  useEffect(() => {
    setApiFlag(true);
  }, []);
  useEffect(() => {
    if (!flag) {
      setApiFlag(true);
    }
  }, [flag]);

  return (
    <>
      <div className="mt-6 relative rounded-lg">
        {/* Button to scroll left */}
        {showScrollButtons.left && (
          <button
            className={`shadow-2xl absolute left-2 top-1/2 transform -translate-y-1/2 text-${themeColor}-${primaryColorLevel} border-double border-4 border-${themeColor}-${primaryColorLevel} bg-white p-2 rounded-full z-10`}
            onClick={scrollLeft}
          >
            <FaChevronLeft size={15} />
          </button>
        )}

        {/* Batches container */}
        {/* <div ref={containerRef} className="flex gap-4 overflow-x-hidden pb-4"> */}
        <div ref={containerRef} className="flex gap-4 overflow-x-hidden pb-4">
          {/* Batch cards */}
          {!isLoading &&
            batchData?.map((item) => (
              <div
                key={item}
                className={`flex cursor-pointer shadow-lg justify-start gap-x-3 items-center p-2 px-4 border-2 border-${themeColor}-${primaryColorLevel} bg-${themeColor}-100 text-white rounded-xl`}
                onClick={() => {
                  navigate(`/app/admin/batche-details/${item._id}`);
                }}
              >
                <div
                  className={`bg-${themeColor}-${primaryColorLevel} text-base font-semibold rounded-full p-1 px-3`}
                >
                  {item.batchNumber}
                </div>

                <div
                  className={`text-${themeColor}-${primaryColorLevel} text-base font-semibold capitalize`}
                >
                  {item.label}
                </div>
              </div>
            ))}
        </div>

        {/* Button to scroll right */}
        {showScrollButtons.right && (
          <button
            className={`shadow-2xl absolute right-2 top-1/2 transform -translate-y-1/2 text-${themeColor}-${primaryColorLevel} border-double border-4 border-${themeColor}-${primaryColorLevel} bg-white p-2 rounded-full z-10`}
            onClick={scrollRight}
          >
            <FaChevronRight size={15} />
          </button>
        )}
      </div>
      <div className={`flex justify-end mt-2 `}>
        <Button
          size="sm"
          variant="twoTone"
          className={`font-bold border border-${themeColor}-${primaryColorLevel}`}
          onClick={() => {
            navigate(`/app/admin/batches`);
          }}
        >
          View All
        </Button>
      </div>
    </>
  );
};

export default BatchScroller;
