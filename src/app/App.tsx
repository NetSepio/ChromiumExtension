import * as React from "react";
import { Routes, Route } from "react-router-dom";

// IMPORT PAGES
import WelcomePage from "./OnboardingPages/WelcomePage";
import ImportSecretKey from "./OnboardingPages/OldUser/ImportSecretKey";
import OldUserSignature from "./OnboardingPages/OldUser/OldUserSignature";
import GetSecretKey from "./OnboardingPages/NewUser/GetSecretKey";
import CreatePassword from "./OnboardingPages/NewUser/CreatePassword";
import Signature from "./OnboardingPages/NewUser/Signature";
import SettingsHome from "./DropDown/Settings/SettingsHome";
import ShowSecretKey from "./DropDown/Settings/Options/ShowSecretKey";
import Feedback from "./DropDown/Feedback";
import Profile from "./DropDown/Profile";
import DashboardHome from "./HomePages/Dashboard/DashboardHome";
import WalletHome from "./HomePages/Wallet/WalletHome";
import Logout from "./DropDown/Logout";

export interface IAppProps {}

export default function App(props: IAppProps) {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/popup.html" element={<WelcomePage />} />
      <Route path="/GetSecretKey" element={<GetSecretKey />} />
      <Route path="/ImportSecretKey" element={<ImportSecretKey />} />
      <Route path="/CreatePassword" element={<CreatePassword />} />
      <Route path="/Signature" element={<Signature />} />
      <Route path="/SettingsHome" element={<SettingsHome />} />
      <Route path="/ShowSecretKey" element={<ShowSecretKey />} />
      <Route path="/Feedback" element={<Feedback />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/DashboardHome" element={<DashboardHome />} />
      <Route path="/WalletHome" element={<WalletHome />} />
      <Route path="/Logout" element={<Logout />} />
      <Route path="/OldUserSignature" element={<OldUserSignature />} />
    </Routes>
  );
}
