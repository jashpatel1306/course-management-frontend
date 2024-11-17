/* eslint-disable react-hooks/exhaustive-deps */
import axiosInstance from "apiServices/axiosInstance";
import { Button, Card } from "components/ui";
import React, { useEffect, useState } from "react";
import { HiPencil } from "react-icons/hi";
import { useSelector } from "react-redux";
import openNotification from "views/common/notification";
import parse from "html-react-parser";
import { CKEditor } from "ckeditor4-react";
import { AiFillFileAdd } from "react-icons/ai";

const PrivacyPolicy = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    privacy_policy: ``,
  });
  const [isEdit, setIsEdit] = useState(true);
  const [preview, setPreview] = useState(true);
  const [apiFlag, setApiFlag] = useState(false);
  const onFormSubmit = async () => {
    try {
      setLoading(true);
      let infoData = {
        privacy_policy: formData?.privacy_policy,
      };
      const response = await axiosInstance.post(
        `admin/configuration/add/privacy_policy`,
        infoData
      );
      if (response.status) {
        openNotification("success", response.message);
        setIsEdit(!isEdit);
        setPreview(true);
        setLoading(false);
      } else {
        setLoading(false);
        openNotification(
          "danger",
          response.message ? response.message : response
        );
      }
    } catch (error) {
      console.log("onFormSubmit error: ", error);
      setLoading(false);
      openNotification("danger", error.message);
    }
  };
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      // fetchData();
    }
  }, [apiFlag]);
  useEffect(() => {
    if (!isEdit) {
      setApiFlag(true);
    }
  }, [isEdit]);
  useEffect(() => {
    setApiFlag(true);
  }, []);
  return (
    <>
      <div>
        <div className={`rounded-xl`}>
          <Card className="mb-4">
            <div className="flex items-center justify-between">
              <div
                className={`text-xl font-semibold text-${themeColor}-${primaryColorLevel} dark:text-white`}
              >
                Privacy Policy
              </div>
              <div>
                {isEdit ? (
                  <Button
                    size="sm"
                    variant="solid"
                    icon={<HiPencil color={"#fff"} />}
                    onClick={() => {
                      setIsEdit(!isEdit);
                      setPreview(false);
                    }}
                  >
                    EDIT
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="solid"
                    icon={<AiFillFileAdd color={"#fff"} />}
                    onClick={onFormSubmit}
                    loading={loading}
                  >
                    SAVE
                  </Button>
                )}
              </div>
            </div>
          </Card>
          {preview ? (
            <Card>
              <div className="p-2">
                <div className="px-2 flex justify-between items-center">
                  <div
                    className={`text-xl font-semibold text-${themeColor}-${primaryColorLevel} dark:text-white`}
                  >
                    Preview
                  </div>
                  <Button
                    size="sm"
                    variant="twoTone"
                    className={`border border-${themeColor}-${primaryColorLevel} font-bold`}
                    onClick={() => {
                      setPreview(!preview);
                    }}
                    disabled={isEdit}
                  >
                    Editor
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border-2">
                  {parse(
                    formData.privacy_policy
                    // .replaceAll("<br/>", `<p style="height:8px"></p>`)
                    // .replaceAll("<p>&nbsp;</p>", `<p style="height:8px"></p>`)
                    // .replaceAll(
                    //   "<h1>&nbsp;</h1>",
                    //   `<p style="height:8px"></p>`
                    // )
                    // .replaceAll(
                    //   "<h2>&nbsp;</h2>",
                    //   `<p style="height:8px"></p>`
                    // )
                    // .replaceAll(
                    //   "<h3>&nbsp;</h3>",
                    //   `<p style="height:8px"></p>`
                    // )
                    // .replaceAll("<p>&nbsp;</p>", `<p style="height:8px"></p>`)
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="p-2">
                <div className="px-2 flex justify-between items-center">
                  <div
                    className={`text-xl font-semibold text-${themeColor}-${primaryColorLevel} dark:text-white`}
                  >
                    Editor
                  </div>
                  <Button
                    size="sm"
                    variant="twoTone"
                    className={`border border-${themeColor}-${primaryColorLevel} font-bold`}
                    onClick={() => {
                      setPreview(!preview);
                    }}
                  >
                    Preview
                  </Button>
                </div>
                <div className="mt-4 p-2 bg-gray-100 rounded-lg border-2">
                  <CKEditor
                    initData={formData.privacy_policy}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        privacy_policy: e.editor.getData(),
                      });
                    }}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
