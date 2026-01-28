// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Directory from "./pages/Directory";
import Events from "./pages/Events";
import Mentorship from "./pages/Mentorship";
import Fundraising from "./pages/Fundraising";
import Newsletter from "./pages/Newsletter";
import AuthPage from "./pages/Auth";
import Payments from "./pages/Payments";
import Announcements from "./pages/Announcement";
import Chatbot from "./pages/Chatbot";
import Setting from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import Achievement from "./pages/Achievement";
import Chat from "./pages/Chat";
import EventDetails from "./pages/EventDetails";
import UserProfile from "./pages/UserProfile";
import Dashboard from "./pages/Dashboard";
import Credits from "./pages/Credits";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Main Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/directory" element={<Directory />} />
          
          {/* Events */}
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          
          {/* Features */}
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/fundraising" element={<Fundraising />} />
          <Route path="/achievement" element={<Achievement />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/announcements" element={<Announcements />} />
          
          {/* Communication */}
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/chat" element={<Chat />} />
          
          {/* User */}
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/credits" element={<Credits />} />
        </Routes>
      </main>
    </>
  );
}
