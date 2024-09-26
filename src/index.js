import React from "react";

import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import MapScreen from "./pages/MapScreen";
import DoerMessageList from "./pages/Doer/Messaging/DoerMessageList";
import DoerDashboard from "./pages/Doer/DoerDashboard";
import DoerHome from "./pages/Doer/DoerHome";
import DoerProfile from "./pages/Doer/DoerProfile";
import DoerMapScreen from "./pages/Doer/DoerMapScreen";
import PostedJobDoerView from "./pages/Doer/Jobs/PostedJobDoerView";
import DoerPaymentHistory from "./pages/Doer/AvatarMenu/DoerPaymentHistory";
import { createStandaloneToast } from "@chakra-ui/toast";
import { ChakraProvider } from "@chakra-ui/react";
import { StreamChat } from "stream-chat";
import DoerContactForm from "./pages/Doer/AvatarMenu/DoerContactForm";
import DoerPrivacyPolicy from "./pages/Doer/AvatarMenu/DoerPrivacyPolicy";
import DoerUserAgreement from "./pages/Doer/FinishOnboarding/DoerUserAgreement";
import DoerIDVerify from "./pages/Doer/FinishOnboarding/DoerIDVerify";
import DoerInProgressList from "./pages/Doer/JobLists/DoerInProgressList";
import DoerSavedList from "./pages/Doer/JobLists/DoerSavedList";
import DoerInReviewList from "./pages/Doer/JobLists/DoerInReviewList";
import DoerCompletedList from "./pages/Doer/JobLists/DoerCompletedList";
import DoerEmailRegister from "./pages/Register/Doer/DoerEmailRegister";
import UserProfile from "./pages/Doer/UserProfile";
import FunnelSelectedCategory from "./components/FunnelSelectedCategory";
//Needer Components
import NeederPaymentComplete from "./pages/Needer/Jobs/NeederPaymentComplete";
import NeederAccountManager from "./pages/Needer/AvatarMenu/NeederAccountManager";
import NeederContactForm from "./pages/Needer/AvatarMenu/NeederContactForm";
import NeederPaymentHistory from "./pages/Needer/AvatarMenu/NeederPaymentHistory";
import NeederPrivacyPolicy from "./pages/Needer/AvatarMenu/NeederPrivacyPolicy"
import NeederThirdPartySoftware from "./pages/Needer/AvatarMenu/NeederThirdPartySoftware";
import NeederIDVerify from "./pages/Needer/FinishOnboarding/NeederIDVerify";
import NeederTaxAgreement from "./pages/Needer/FinishOnboarding/NeederTaxAgreement";
import NeederUserAgreement from "./pages/Needer/FinishOnboarding/NeederUserAgreement";
import NeederCompletedList from "./pages/Needer/JobLists/NeederCompletedList";
import NeederInProgressList from "./pages/Needer/JobLists/NeederInProgressList";
import NeederInReviewList from "./pages/Needer/JobLists/NeederInReviewList";
import NeederPostedList from "./pages/Needer/JobLists/NeederPostedList";
//didnt import anything from jobs folder
import NeederDoerMessageList from "./pages/Needer/Messaging/NeederMessageList";
import NeederDashboard from "./pages/Needer/NeederDashboard";
import NeederHeader from "./pages/Needer/NeederHeader";
import NeederHome from "./pages/Needer/NeederHome";
import NeederMapScreen from "./pages/Needer/NeederMapScreen";
import NeederMapSelectedJob from "./pages/Needer/NeederMapSelectedJob";
import NeederProfile from "./pages/Needer/NeederProfile";
import NeederMessageList from "./pages/Needer/Messaging/NeederMessageList";
import AddJobStart from "./pages/Needer/Jobs/AddJob/AddJobStart";
import AddJobInfo from "./pages/Needer/Jobs/AddJob/AddJobInfo";
import NeederApplicants from "./pages/Needer/Jobs/NeederApplicants";
import ApplicantProfile from "./pages/Needer/Jobs/Applicants/ApplicantProfile";
import NeederEmailRegister from "./pages/Register/Needer/NeederEmailRegister";
import EditPostedJob from "./pages/Needer/Jobs/EditPostedJob";
import EditJobInfo from "./pages/Needer/Jobs/EditJobInfo";
import NeederAllCategories from "./pages/Needer/NeederAllCategories";
import Test from "./pages/Needer/Test";
import UserProfileNeeder from "./pages/Needer/UserProfileNeeder";
import Homepage from "./pages/Needer/HomePage/Homepage";
import ChatWindow from "./pages/Doer/Messaging/ChatWindow";
import DoerChatHolder from "./pages/Doer/Chat/DoerChatHolder";
import OnboardingOne from "./pages/Register/Needer/OnboardingOne"
import BusinessEmailRegister from "./pages/Register/Needer/BusinessEmailRegister";
import AddBusinessProfileInfo from "./pages/Register/Needer/BusinessOnboarding/AddBusinessProfileInfo";
import AddLogoAbout from "./pages/Register/Needer/BusinessOnboarding/AddLogoAbout";
import DoerMapLoggedOut from "./components/DoerMapLoggedOut";
import DoerMapLoggedOutClusterTest from "./components/DoerMapLoggedOutClusterTest";
import ResetPasswordLoggedOut from "./components/Landing/ResetPasswordLoggedOut";
import DoerListView from "./pages/Doer/MapView/DoerListView";


//Stream Chat
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
} from "stream-chat-react";

import "stream-chat-react/dist/css/v2/index.css";
import DoerAccountManager from "./pages/Doer/AvatarMenu/DoerAccountManager";
import DoerTaxAgreement from "./pages/Doer/FinishOnboarding/DoerTaxAgreement";
import NeederAccountCreation from "./pages/Register/Needer/NeederAccountCreation";
import AddProfileInfo from "./pages/Register/Needer/AddProfileInfo";
import OnboardingNeederUserAgreement from "./pages/Register/Needer/OnboardingNeederUserAgreement"
import OnboardingNeederIDVerify from "./pages/Register/Needer/OnboardingNeederIDVerify";
import NeederNewProfile from "./pages/Needer/NeederNewProfile";
import DoerAccountCreation from "./pages/Register/Doer/DoerAccountCreation";
import DoerAddProfileInfo from "./pages/Register/Doer/DoerAddProfileInfo";
import OnboardingDoerUserAgreement from "./pages/Register/Doer/OnboardingDoerUserAgreement";
import OnboardingDoerTaxAgreement from "./pages/Register/Doer/OnboardingDoerTaxAgreement";
import OnboardingDoerIDVerify from "./pages/Register/Doer/OnboardingDoerIDVerify";
import StripeSetUp from "./pages/Register/Doer/StripeSetUp";
import Landing from "./Landing";
import SelectedCategory from "./components/SelectedCategory";
import DoerSubscriptionComplete from "./pages/Doer/DoerSubscriptionComplete";
import NeederSelectedCategory from "./pages/Needer/NeederSelectedCategory";
import ChatEntry from "./pages/Doer/Chat/ChatEntry";
import NeederChatEntry from "./pages/Needer/Chat/NeederChatEntry";
import JobDetails from "./pages/Needer/HomePage/JobDetails";
import JobDetailsHired from "./pages/Needer/HomePage/JobDetailsHired";
import JobDetailsReadyToPay from "./pages/Needer/HomePage/JobDetailsReadyToPay";
import ChatPlaceholder from "./pages/Needer/Chat/ChatPlaceholder";
import ChatHolder from "./pages/Needer/Chat/ChatHolder";
import DoerSavedJobs from "./pages/Doer/DoerSavedJobs";
import SavedJobDetails from "./pages/Doer/SavedJobDetails";
import DoerListViewLoggedOut from "./components/DoerListViewLoggedOut"
import NeederMapView from "./pages/Needer/MapView/NeederMapView";
import DoerMapView from "./pages/Doer/MapView/DoerMapView";
import TestLanding from "./components/Landing/TestLanding";


import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig"
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";



import posthog from 'posthog-js';
import { PostHogProvider} from 'posthog-js/react'



const { ToastContainer, toast } = createStandaloneToast();

const router = createBrowserRouter([
 

  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Landing",
    element: <Landing />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/MapScreen",
    element: <MapScreen />,
  },

  {
    path: "/DoerHome",
    element: <DoerHome />,
  },
  {
    path: "/DoerDashboard",
    element: <DoerDashboard />,
  },
  {
    path: "/DoerMapScreen",
    element: <DoerMapScreen />,
  },
  {
    path: "/DoerMessageList",
    element: <DoerMessageList />,
  },
  {
    path: "/DoerProfile",
    element: <DoerProfile />,
  },
  {
    path: "/DoerAccountCreation",
    element: <DoerAccountCreation />,
  },
  {
    path: "/PostedJobDoerView",
    element: <PostedJobDoerView />,
  },
  {
    path: "/DoerPaymentHistory",
    element: <DoerPaymentHistory />,
  },
  {
    path: "/DoerContactForm",
    element: <DoerContactForm />,
  },
  {
    path: "/DoerPrivacyPolicy",
    element: <DoerPrivacyPolicy />,
  },
  {
    path: "/DoerAccountManager",
    element: <DoerAccountManager />,
  },
  {
    path: "/DoerUserAgreement",
    element: <DoerUserAgreement />,
  },
  {
    path: "/DoerIDVerify",
    element: <DoerIDVerify />,
  },
  {
    path: "/DoerTaxAgreement",
    element: <DoerTaxAgreement />,
  },
  {
    path: "/DoerInProgressList",
    element: <DoerInProgressList />,
  },
  {
    path: "/DoerSavedList",
    element: <DoerSavedList />,
  },
  {
    path: "/DoerInReviewList",
    element: <DoerInReviewList />,
  },
  {
    path: "/DoerCompletedList",
    element: <DoerCompletedList />,
  },
//now this is the Needer section
  {
    path: "/NeederMapScreen",
    element: <NeederMapScreen />,
  },

  {
    path: "/NeederHome",
    element: <NeederHome />,
  },
  {
    path: "/NeederDashboard",
    element: <NeederDashboard />,
  },
  
  {
    path: "/NeederMessageList",
    element: <NeederMessageList />,
  },
  {
    path: "/NeederProfile",
    element: <NeederProfile />,
  },
  {
    path: "/NeederNewProfile",
    element: <NeederNewProfile />,
  },

  {
    path: "/NeederPaymentHistory",
    element: <NeederPaymentHistory />,
  },
  {
    path: "/NeederContactForm",
    element: <NeederContactForm />,
  },
  {
    path: "/NeederPrivacyPolicy",
    element: <NeederPrivacyPolicy />,
  },
  {
    path: "/NeederAccountManager",
    element: <NeederAccountManager />,
  },
  {
    path: "/NeederUserAgreement",
    element: <NeederUserAgreement />,
  },
  {
    path: "/NeederIDVerify",
    element: <NeederIDVerify />,
  },
  {
    path: "/NeederTaxAgreement",
    element: <NeederTaxAgreement />,
  },
  {
    path: "/NeederInProgressList",
    element: <NeederInProgressList />,
  },
  {
    path: "/NeederPostedList",
    element: <NeederPostedList />,
  },
  {
    path: "/NeederInReviewList",
    element: <NeederInReviewList />,
  },
  {
    path: "/NeederCompletedList",
    element: <NeederCompletedList />,
  },
  {
    path: "/AddJobStart",
    element: <AddJobStart />,
  },
  {
    path: "/AddJobInfo",
    element: <AddJobInfo />,
  },
  {
    path: "/NeederApplicants",
    element: <NeederApplicants />,
  },
  {
    path: "/ApplicantProfile",
    element: <ApplicantProfile />,
  },
  {
    path: "/NeederAccountCreation",
    element: <NeederAccountCreation />,
  },
  {
    path: "/AddProfileInfo",
    element: <AddProfileInfo />,
  },
  {
    path: "/OnboardingNeederUserAgreement",
    element: <OnboardingNeederUserAgreement />,
  },

  {
    path: "/OnboardingNeederIDVerify",
    element: <OnboardingNeederIDVerify />,
  },
  {
    path: "/DoerAddProfileInfo",
    element: <DoerAddProfileInfo />,
  },
  {
    path: "/OnboardingDoerUserAgreement",
    element: <OnboardingDoerUserAgreement />,
  },
  {
    path: "/OnboardingDoerTaxAgreement",
    element: <OnboardingDoerTaxAgreement />,
  },
  {
    path: "/OnboardingDoerIDVerify",
    element: <OnboardingDoerIDVerify />,
  },
  {
    path: "/StripeSetUp",
    element: <StripeSetUp />,
  },
  {
    path: "/NeederPaymentComplete",
    element: <NeederPaymentComplete />,
  },
  {
    path: "/NeederEmailRegister",
    element: <NeederEmailRegister />,
  },
  {
    path: "/DoerEmailRegister",
    element: <DoerEmailRegister />,
  },
  {
    path: "/DoerSubscriptionComplete",
    element: <DoerSubscriptionComplete />,
  },
  {
    path: "/EditPostedJob",
    element: <EditPostedJob />,
  },
  {
    path: "/EditJobInfo",
    element: <EditJobInfo />,
  },
  {
    path: "/SelectedCategory",
    element: <SelectedCategory />,
  },
  {
    path: "/NeederSelectedCategory",
    element: <NeederSelectedCategory />,
  },
  {
    path: "/NeederAllCategories",
    element: <NeederAllCategories />,
  },
  {
    path: "/UserProfile",
    element: <UserProfile />,
  },
  {
    path: "/FunnelSelectedCategory",
    element: <FunnelSelectedCategory />,
  },
  {
    path: "/Test",
    element: <Test />,
  },
  {
    path: "/UserProfileNeeder",
    element: <UserProfileNeeder />,
  },
  {
    path: "/ChatWindow",
    element: <ChatWindow />,
  },

  {
    path: "/ChatEntry",
    element: <ChatEntry/>,
  },
  {
    path: "/NeederChatEntry",
    element: <NeederChatEntry/>,
  },

  {
    path: "/Homepage",
    element: <Homepage/>,
  },

  {
    path: "/JobDetails",
    element: <JobDetails/>,
  },
  {
    path: "/JobDetailsHired",
    element: <JobDetailsHired/>,
  },
  {
    path: "/JobDetailsReadyToPay",
    element: <JobDetailsReadyToPay/>,
  },
  {
    path: "/ChatPlaceholder",
    element: <ChatPlaceholder/>,
  },
  {
    path: "/ChatHolder",
    element: <ChatHolder/>,
  },
  {
    path: "/DoerChatHolder",
    element: <DoerChatHolder/>,
  },
  {
    path: "/OnboardingOne",
    element: <OnboardingOne/>,
  },
  {
    path: "/BusinessEmailRegister",
    element: <BusinessEmailRegister/>,
  },
  {
    path: "/AddBusinessProfileInfo",
    element: <AddBusinessProfileInfo/>,
  },
  {
    path: "/AddLogoAbout",
    element: <AddLogoAbout/>,
  },
  {
    path: "/DoerMapLoggedOut",
    element: <DoerMapLoggedOut/>,
  },
  {
    path: "/DoerSavedJobs",
    element: <DoerSavedJobs/>,
  },
  {
    path: "/SavedJobDetails",
    element: <SavedJobDetails/>,
  },
  {
    path: "/DoerListViewLoggedOut",
    element: <DoerListViewLoggedOut />,
  },
  {
    path: "/DoerMapLoggedOutClusterTest",
    element: <DoerMapLoggedOutClusterTest/>,
  },
  {
    path: "/NeederMapView",
    element: <NeederMapView/>,
  },
  {
    path: "/DoerMapView",
    element: <DoerMapView/>,
  },
  {
    path: "/DoerListView",
    element: <DoerListView/>,
  },
  {
    path: "/ResetPasswordLoggedOut",
    element: <ResetPasswordLoggedOut />,
  },
  {
    path: "/TestLanding",
    element: <TestLanding />,
  },
]);



if (process.env.NODE_ENV === 'production') {
  posthog.init(
    process.env.REACT_APP_POSTHOG_API, {api_host: "https://us.i.posthog.com"}
    
  );
} else {
  console.log("Hi Christian, this is running in development mode")
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <ChakraProvider>
    <PostHogProvider 
      client={posthog}
    >
      <RouterProvider router={router} />
      </PostHogProvider>
    </ChakraProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


