import React from "react";
import {
  HiOutlineChartSquareBar,
  HiOutlineUserGroup,
  HiOutlineTrendingUp,
  HiOutlineUserCircle,
  HiOutlineBookOpen,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineColorSwatch,
  HiOutlineChatAlt,
  HiOutlineDesktopComputer,
  HiOutlinePaperAirplane,
  HiOutlineChartPie,
  HiOutlineUserAdd,
  HiOutlineKey,
  HiOutlineBan,
  HiOutlineHand,
  HiOutlineDocumentText,
  HiOutlineTemplate,
  HiOutlineLockClosed,
  HiOutlineDocumentDuplicate,
  HiOutlineViewGridAdd,
  HiOutlineShare,
  HiOutlineVariable,
  HiOutlineCode,
  HiShieldCheck,
  HiUsers,
  HiDatabase,
  HiPhone,
  HiDocumentText
} from "react-icons/hi";
import { MdSubscriptions, MdTransferWithinAStation } from "react-icons/md";
import { CgGym } from "react-icons/cg";
import { AiTwotoneSetting } from "react-icons/ai";
import { PiStudentFill, PiFilesFill } from "react-icons/pi";
import { FaRegQuestionCircle, FaSchool } from "react-icons/fa";
import Assessment from "assets/svg/assessment";
import {
  Clients,
  ContentHub,
  Dashboard,
  DataNoFound,
  Instructors,
  Policy,
  Settings,
  Staff,
  Student,
  Result
} from "assets/svg";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { TbReportAnalytics } from "react-icons/tb";

const navigationIcon = {
  // main navbar icon
  loginRequest: <HiShieldCheck />,
  users: <HiUsers />,
  gym: <CgGym />,
  addUser: <HiUsers />,
  assign: <MdTransferWithinAStation />,
  configuration: <AiTwotoneSetting />,
  libraries: <HiDatabase />,
  subscriptions: <MdSubscriptions />,
  students: <PiStudentFill />,
  contents: <PiFilesFill />,
  college: <FaSchool />,
  dataNoFound: <DataNoFound />,
  clients: <Clients />,
  contentHub: <ContentHub />,
  assessment: <Assessment />,
  dashboard: <Dashboard />,
  instructors: <Instructors />,
  policy: <Policy />,
  settings: <Settings />,
  staff: <Staff />,
  student: <Student />,
  batches: <BiSolidCategoryAlt />,
  attempts: <FaRegQuestionCircle />,
  quiz: (
    <img
      src="/img/others/publicContent.svg"
      alt="quiz"
      className="w-5 h-5 object-contain"
    />
  ),
  result: <Result />,
  report: <TbReportAnalytics />,
  //other icon
  apps: <HiOutlineViewGridAdd />,
  project: <HiOutlineChartSquareBar />,
  crm: <HiOutlineUserGroup />,
  sales: <HiOutlineTrendingUp />,
  crypto: <HiOutlineCurrencyDollar />,
  knowledgeBase: <HiOutlineBookOpen />,
  account: <HiOutlineUserCircle />,
  uiComponents: <HiOutlineTemplate />,
  common: <HiOutlineColorSwatch />,
  feedback: <HiOutlineChatAlt />,
  dataDisplay: <HiOutlineDesktopComputer />,
  forms: <HiOutlineDocumentText />,
  navigation: <HiOutlinePaperAirplane />,
  graph: <HiOutlineChartPie />,
  authentication: <HiOutlineLockClosed />,
  signIn: <HiOutlineShieldCheck />,
  signUp: <HiOutlineUserAdd />,
  forgotPassword: <HiOutlineLockClosed />,
  resetPassword: <HiOutlineKey />,
  pages: <HiOutlineDocumentDuplicate />,
  welcome: <HiOutlineHand />,
  accessDenied: <HiOutlineBan />,
  guide: <HiOutlineBookOpen />,
  documentation: <HiDocumentText />,
  sharedComponentDoc: <HiOutlineShare />,
  utilsDoc: <HiOutlineVariable />,
  changeLog: <HiOutlineCode />,
  contact: <HiPhone />
};

export default navigationIcon;
