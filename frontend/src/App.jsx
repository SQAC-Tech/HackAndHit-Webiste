import React from "react";
import { Route, Routes } from "react-router";
import Form from "./components/form";
import Homepage from "./components/Homepage"
import AdminDashboard from "./components/admin";
const App = () => {
    return (
        <Routes>
            <Route path='/' element={<Homepage/>} />
            <Route path="/form" element={<Form />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    )
}

export default App;
