import React from "react";
import { Route, Routes } from "react-router";
import Form from "./components/form";
import Homepage from "./components/Homepage";
import AdminDashboard from "./components/admin";
import Login from "./components/login";
import AdminLogin from "./components/adminlogin";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/form" element={<Form />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<AdminLogin />} />
        </Routes>
    );
};

export default App;
