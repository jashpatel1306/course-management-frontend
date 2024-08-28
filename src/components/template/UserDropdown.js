import React from "react";
import { Avatar, Dropdown } from "components/ui";
import withHeaderItem from "utils/hoc/withHeaderItem";
import useAuth from "utils/hooks/useAuth";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { HiOutlineLogout, HiOutlineCog } from "react-icons/hi";
import { APP_PREFIX_PATH } from "constants/route.constant";

const dropdownItemList = [
  {
    label: "Account Settings",
    path: `${APP_PREFIX_PATH}/account/profile`,
    icon: <HiOutlineCog />,
  },
];

export const UserDropdown = ({ className }) => {
  const { userData } = useSelector((state) => state.auth.user);

  const { signOut } = useAuth();

  const UserAvatar = (
    <div className={classNames(className, "flex items-center gap-2")}>
      <Avatar
        size={32}
        shape="circle"
        src={
          userData.avatar ||
          "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
        }
      />
      <div className="hidden md:block">
        <div className="text-xs capitalize">
          {userData.authority || "guest"}
        </div>
        <div className="font-bold">{userData.user_name}</div>
      </div>
    </div>
  );

  return (
    <div>
      <Dropdown
        menuStyle={{ minWidth: 240 }}
        renderTitle={UserAvatar}
        placement="bottom-end"
      >
        <Dropdown.Item variant="header">
          <div className="py-2 px-3 flex items-center gap-2">
            <Avatar shape="circle" src={userData.avatar} />
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100">
                {userData.user_name}
              </div>
              <div className="text-xs">{userData.email}</div>
            </div>
          </div>
        </Dropdown.Item>
        <Dropdown.Item variant="divider" />
        {dropdownItemList?.map((item) => (
          <Link
            className="flex gap-2 items-center"
            to={item?.path}
            key={item?.label}
          >
            <Dropdown.Item
              eventKey={item?.label}
              key={item?.label}
              className="mb-1"
            >
              <span className="text-xl opacity-50">{item?.icon}</span>
              <span>{item?.label}</span>
            </Dropdown.Item>
          </Link>
        ))}
        <Dropdown.Item variant="divider" />
        <Dropdown.Item onClick={signOut} eventKey="Sign Out" className="gap-2">
          <span className="text-xl opacity-50">
            <HiOutlineLogout />
          </span>
          <span>Sign Out</span>
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

export default withHeaderItem(UserDropdown);
