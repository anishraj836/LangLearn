import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import UpdateProfilePage from "./pages/UpdateProfilePage.jsx";
import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import useThemeStore from "./store/useThemeStore.jsx";

const App = () => {
  const { theme, setTheme } = useThemeStore();
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated && isOnboarded ? (
            <Layout showSidebar={true}>
              <HomePage />
            </Layout>
            )  : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          } 
        />

        <Route 
          path="/signup" 
          element={
            !isAuthenticated 
              ? <SignUpPage /> 
              : <Navigate to={isOnboarded?"/":"/onboarding"} />
          } 
        />

        <Route 
          path="/login" 
          element={
            !isAuthenticated 
              ? <LoginPage /> 
              : <Navigate to={isOnboarded?"/":"/onboarding"} />
          } 
        />

        <Route 
          path="/friends" 
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <FriendsPage />
              </Layout>
            ) : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          } 
        />

        <Route 
          path="/chat/:id" 
          element={
            isAuthenticated
              ? (<Layout showSidebar={true}><ChatPage /> </Layout>)
              : <Navigate to={isAuthenticated?"/onboarding":"/login"} />
          } 
        />

        <Route 
          path="/update-profile" 
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <UpdateProfilePage />
              </Layout>
            ) : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          } 
        />

        <Route 
          path="/call/:id" 
          element={
            isAuthenticated 
              ? <CallPage /> 
              : <Navigate to="/login" />
          } 
        />

        <Route 
          path="/notifications" 
          element={
            isAuthenticated
              ? (<Layout showSidebar={true}><NotificationsPage /> </Layout>)
              : <Navigate to={isAuthenticated?"/onboarding":"/login"} />
          } 
        />

        <Route 
          path="/onboarding" 
          element={
            isAuthenticated 
              ? (!isOnboarded 
                  ? <OnboardingPage /> 
                  : <Navigate to="/" />) 
              : <Navigate to="/login" />
          } 
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;