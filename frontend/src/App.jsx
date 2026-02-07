import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/admin";
import Login from "./components/login";
import Form from "./components/form";
import AdminLogin from "./components/adminlogin";
import MainSite from "./components/MainSite";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/home" element={<MainSite />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/mainsite" element={<MainSite />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>

      {/* Footer will appear on all pages */}
      <Footer />
    </>
  );
}

export default App;
