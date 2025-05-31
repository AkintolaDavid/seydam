import { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatInterface from "./components/ChatInterface";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";
import ReportForm from "./pages/ReportForm";
import GenerationPage from "./pages/GenerationPage";
import LandingPage from "./pages/LandingPage";
import { DarkModeProvider } from "./components/Landing/Darkmode";
import About from "./pages/About";
import ContactUs from "./pages/ContactUsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ReturnsAndRefunds from "./pages/ReturnsAndRefunds";
import TermsAndConditions from "./pages/TermsAndConditions";
import ForgotPassword from "./pages/Forgotpassword";
import ScrollToTop from "./components/scrolltotop/ScrollToTop";

function App() {
  // Initialize sidebar state based on screen size
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [chatHistory, setChatHistory] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  // const token = localStorage.getItem("token");
  // Update sidebar state on window resize
  useEffect(() => {
    const updateSidebar = () => setIsSidebarOpen(window.innerWidth >= 1024);
    window.addEventListener("resize", updateSidebar);

    // Call it immediately to set the correct value on initial render
    updateSidebar();

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", updateSidebar);
  }, []);

  return (
    <DarkModeProvider>
      <ChakraProvider>
        <Router>
          <ScrollToTop/>
          <div className=" flex overflow-hidden ">
            {/* Sidebar */}
            {token && (
              <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                chatHistory={chatHistory}
              />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Conditionally render Header only if token is available */}
              {token && <Header onMenuClick={() => setIsSidebarOpen(true)} />}

              <Routes>
                {/* Login Route */}
                <Route path="*" element={<LandingPage />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login setToken={setToken} />} />

                {/* Sign Up Route */}
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <ChatInterface setChatHistory={setChatHistory} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reportform"
                  element={
                    // <ProtectedRoute>
                    <ReportForm />
                    // </ProtectedRoute>
                  }
                />
                <Route
                  path="/generationPage"
                  element={
                    <ProtectedRoute>
                      <GenerationPage />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect to login if no token */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/contact" element={<ContactUs />} />

                <Route path="/about" element={<About />} />
                <Route
                  path="/terms-and-conditions"
                  element={<TermsAndConditions />}
                />

                <Route path="/refund-policy" element={<ReturnsAndRefunds />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ChakraProvider>
    </DarkModeProvider>
  );
}

export default App;
