import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/admin";
import Login from "./components/login";
import Form from "./components/form";
import AdminLogin from "./components/adminlogin";
import MainSite from "./components/MainSite";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
import TeamLogin from "./components/teamlogin";
import PPTSubmit from "./components/pptsubmit";
import AdminMailer from "./components/massmailer";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/form" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/mainsite" element={<MainSite />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/teamlogin" element={<TeamLogin />} />
        <Route path="/ppt-submit" element={<PPTSubmit/>} />
        <Route path="/mailler" element={<AdminMailer />} />
      </Routes>
    </>
  );
}

export default App;
