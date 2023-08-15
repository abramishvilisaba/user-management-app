import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm.js";
import LoginForm from "./components/LoginForm.js";
import UserManagement from "./components/UserManagement.js";
import Home from "./components/Home.js";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<RegistrationForm />}> */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="login" element={<LoginForm />} />
                <Route path="user-management" element={<UserManagement />} />
                {/* </Route> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
