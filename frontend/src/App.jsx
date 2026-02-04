import React from "react";
import { Route, Routes } from "react-router";
import Form from "./components/form";
import Homepage from "./components/Homepage"
const App = () => {
    return (
        <Routes>
            <Route path='/' element={<Homepage/>} />
            <Route path="/form" element={<Form />} />
        </Routes>
    )
}

export default App;
