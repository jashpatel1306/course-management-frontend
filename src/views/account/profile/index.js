/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tabs } from "components/ui";
import { AdaptableCard, Container } from "components/shared";
import { useLocation } from "react-router-dom";

const Profile = lazy(() => import("./components/profile"));
const Password = lazy(() => import("./components/password"));

const { TabNav, TabList } = Tabs;

const settingsMenu = {
  profile: { label: "Profile", path: "profile" },
  password: { label: "Password", path: "password" },
};
const ProfileSetting = () => {
  const [currentTab, setCurrentTab] = useState("password");
  const location = useLocation();

  const path = location.pathname?.substring(
    location.pathname.lastIndexOf("/") + 1
  );

  const onTabChange = (val) => {
    setCurrentTab(val);
  };

  useEffect(() => {
    setCurrentTab(path);
  }, []);

  return (
    <Container>
      <AdaptableCard>
        <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
          <TabList>
            {Object.keys(settingsMenu)?.map((key) => (
              <TabNav key={key} value={key}>
                {settingsMenu[key].label}
              </TabNav>
            ))}
          </TabList>
        </Tabs>
        <div className="px-4 py-6">
          <Suspense fallback={<></>}>
            {currentTab === "profile" && <Profile />}
            {currentTab === "password" && <Password />}
          </Suspense>
        </div>
      </AdaptableCard>
    </Container>
  );
};

export default ProfileSetting;
