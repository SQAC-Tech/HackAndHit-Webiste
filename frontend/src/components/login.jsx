import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:3000/api";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!username || !password) {
            toast.error("Please enter username and password");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `${API_URL}/admin/login`,
                { username, password },
                { withCredentials: true }
            );
            toast.success("Login successful!");
            setTimeout(() => navigate("/admin"), 1000);
        } catch (err) {
            toast.error(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#0B0633] via-[#140A52] to-[#0B0633] flex flex-col items-center justify-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-10 w-[90%] max-w-md border border-orange-500/30 shadow-[0_0_40px_rgba(249,115,22,0.25)]">
                
                <h1 className="text-3xl font-bold text-white text-center mb-2">
                    🔐 Admin Login
                </h1>
                <p className="text-orange-400 text-center mb-8">
                    Hack and Hit Dashboard
                </p>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm text-orange-400 mb-1 block">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-4 rounded-xl bg-black/30 border border-white/20 text-white outline-none focus:border-orange-400"
                            placeholder="Enter username"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-orange-400 mb-1 block">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 rounded-xl bg-black/30 border border-white/20 text-white outline-none focus:border-orange-400"
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full py-4 rounded-full bg-orange-500 text-white font-bold text-lg disabled:opacity-50 hover:bg-orange-600 transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-orange-500/20 border border-orange-500/40 rounded-xl">
                    <p className="text-orange-400 text-sm font-bold mb-1">Demo Credentials:</p>
                    <p className="text-white text-sm">Username: <span className="text-orange-300">admin</span></p>
                    <p className="text-white text-sm">Password: <span className="text-orange-300">admin123</span></p>
                </div>

                <p className="text-gray-400 text-center mt-6 text-sm">
                    <a href="/" className="text-orange-400 hover:underline">← Back to Home</a>
                </p>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Login;
