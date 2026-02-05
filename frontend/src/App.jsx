import Homepage from "./components/Homepage";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/admin";
import Login from "./components/login";
import Homepage from "./components/Homepage";
import AdminLogin from "./components/adminlogin";

const App = () => {
return (
    <Routes>
            <Route path="/" element={<Form />} />
            <Route path="/" element={<Homepage />} />
            <Route path="/form" element={<Form />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<AdminLogin />} />
    </Routes>
);
};
export default App;
