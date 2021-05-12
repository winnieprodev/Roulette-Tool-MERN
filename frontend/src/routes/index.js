import { 
  Settings as SettingIcon,
  HelpCircle as TutorialIcon,
  Video as VideoIcon
} from "react-feather";
import {
  faHistory as HistoryIcon,
  faMoneyCheck as MoneyCheckIcon
} from "@fortawesome/free-solid-svg-icons";
// Landing
import Landing from "../pages/landing/Landing";
import Blogs from "../pages/landing/Videos";
import BlogDetail from "../pages/landing/VideoDetail";
import LandingPricing from "../pages/landing/Pricing";
import DefaultSetting from "../pages/landing/DefaultSetting";
import ResetPassword from "../pages/auth/ResetPassword";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
// Pages
import Profile from "../pages/pages/Profile";
import Pricing from "../pages/pages/Pricing";
import History from "../pages/pages/History";
import Videos from "../pages/pages/Videos";
import VideoDetail from "../pages/pages/VideoDetail";
// Dashboards
import DefaultRoulette from "../pages/dashboard/Roulette";
import DefaultBlackJack from "../pages/dashboard/BlackJack";
import DefaultBaccarat from "../pages/dashboard/Baccarat";

// Routes

const landingRoutes = {
  path: "/",
  name: "Landing Pages",
  icon: null,
  ficon: null,
  svg: null,
  img: null,
  children: [
    {
      path: "/",
      name: "Sign In",
      component: SignIn
    },
    {
      path: "/sign-up",
      name: "Sign Up",
      component: SignUp
    },
    {
      path: "/reset-password",
      name: "Reset Password",
      component: ResetPassword
    },
    {
      path: "/landing-pricing",
      name: "Landing-Pricing Page",
      component: LandingPricing
    },
    {
      path: "/blogs",
      name: "Video Blogs Page",
      component: Blogs
    },
    {
      path: "/blogs/:id",
      name: "Video Blog Detail Page",
      component: BlogDetail
    }
  ]
};

const defaultDashboardRoute = {
  path: "/default-setting",
  name: "Default Dashboard Setting Page",
  icon: null,
  ficon: null,
  svg: null,
  img: null,
  component: DefaultSetting,
  children: null
};

const dashboardRouletteRoute = {
  path: "/roulette",
  name: "RouletteDashboard",
  icon: null,
  ficon: null,
  svg: true,
  img: null,
  containsHome: true,
  component: DefaultRoulette,
  children: null
};

const dashboardBlackjackRoute = {
  path: "/blackjack",
  name: "BlackJackDashboard",
  icon: null,
  ficon: null,
  svg: null,
  img: true,
  containsHome: true,
  component: DefaultBlackJack,
  children: null
};

const dashboardBacaratRoute = {
  path: "/baccarat",
  name: "BaccaratDashboard",
  icon: null,
  ficon: null,
  svg: null,
  img: null,
  baca: true,
  containsHome: true,
  component: DefaultBaccarat,
  children: null
};

const gamehistory = {
  path: "/history",
  name: "RouletteGameHistory",
  icon: null,
  ficon: HistoryIcon,
  svg: null,
  img: null,
  component: History,
  children: null
};

const payment = {
  path: "/pricing",
  name: "Pricing",
  icon: null,
  ficon: MoneyCheckIcon,
  svg: null,
  img: null,
  component: Pricing,
  children: null
};

const setting = {
  path: "/settings",
  name: "Settings",
  icon: SettingIcon,
  ficon: null,
  img: null,
  component: Profile,
  children: null
};

const tutorial = {
  path: "/tutorial",
  name: "ContactUs",
  icon: TutorialIcon,
  ficon: null,
  img: null,
  component: null,
  children: null
};

const videos = {
  path: "/videos",
  name: "Videos",
  icon: VideoIcon,
  ficon: null,
  img: null,
  component: Videos,
  children: null
};

const videosDetailRoute = {
  path: "/videos/:id",
  name: "Video Detail Page",
  icon: null,
  ficon: null,
  svg: null,
  img: null,
  component: VideoDetail,
  children: null
};

// Dashboard specific routes
export const dashboard = [
  dashboardRouletteRoute,
  dashboardBlackjackRoute,
  dashboardBacaratRoute,
  gamehistory,
  videos,
  setting,
  tutorial,
  payment,
  videosDetailRoute
];

// Landing specific routes
export const landing = [landingRoutes];

// Default Dashboard setting specific routes
export const defaultdashboard = [defaultDashboardRoute];

// All routes
export default [
  dashboardRouletteRoute,
  dashboardBlackjackRoute,
  dashboardBacaratRoute,
  gamehistory,
  videos,
  setting,
  tutorial,
  payment
];
