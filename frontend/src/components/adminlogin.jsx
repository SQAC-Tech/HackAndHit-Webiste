import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://hackandhit-webiste.onrender.com/api";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            toast.error("Enter username & password");
            return;
        }

        try {
            await axios.post(
                `${API_URL}/admin/login`,
                { username, password },
                { withCredentials: true } // 🔥 REQUIRED
            );

            toast.success("Login successful");
            navigate("/admin");
        } catch (err) {
            toast.error(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0633] flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl w-full max-w-sm border border-orange-500/30">
                <h1 className="text-2xl font-extrabold text-white mb-6 text-center">
                    🏏 ADMIN LOGIN
                </h1>

                <input
                    className="w-full p-3 mb-4 rounded bg-white/10 text-white outline-none"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full p-3 mb-6 rounded bg-white/10 text-white outline-none"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 font-bold transition"
                >
                    LOGIN
                </button>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
