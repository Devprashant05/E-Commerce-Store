import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";

const App = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0">
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full 
                   bg-[radial-gradient(ellipse_at_top,_rgba(168,85,247,0.3)_0%,_rgba(88,28,135,0.2)_45%,_rgba(0,0,0,0.1)_100%)]"
                    ></div>
                </div>
            </div>
            <div className="relative z-50 pt-20">
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
