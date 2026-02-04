import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const API_URL = "https://hackandhit-webiste.onrender.com/api";

const AdminDashboard = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [editTeam, setEditTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateStats, setDateStats] = useState([]);
    const [sizeStats, setSizeStats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        verifyAuth();
    }, []);

    const verifyAuth = async () => {
        try {
            await axios.get(`${API_URL}/admin/verify`, { withCredentials: true });
            fetchData();
        } catch (err) {
            toast.error("Please login to access dashboard");
            setTimeout(() => navigate("/login"), 1000);
        }
    };
    const renderPersonDetails = (title, person) => {
        if (!person) return null;

        return (
            <div className="mt-4 border-t border-orange-500/20 pt-3">
                <h4 className="text-orange-400 font-semibold mb-2">{title}</h4>

                <p><span className="text-orange-300">Name:</span> {person.name}</p>
                <p><span className="text-orange-300">Email:</span> {person.email}</p>
                <p><span className="text-orange-300">Phone:</span> {person.phone}</p>
                <p>
                    <span className="text-orange-300">Residence:</span>{" "}
                    {person.residenceType === "hosteler" ? "Hosteler" : "Day Scholar"}
                </p>

                {person.residenceType === "hosteler" && (
                    <div className="ml-3 mt-2 text-sm text-gray-300">
                        <p>🏨 Hostel: {person.hostelName}</p>
                        <p>👨‍🏫 Warden: {person.wardenName}</p>
                        <p>☎️ Hostel Contact: {person.hostelContact}</p>
                    </div>
                )}
            </div>
        );
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [teamsRes, dateRes, sizeRes] = await Promise.all([
                axios.get(`${API_URL}/teams`, { withCredentials: true }),
                axios.get(`${API_URL}/admin/analytics/registrations`, { withCredentials: true }),
                axios.get(`${API_URL}/admin/analytics/team-sizes`, { withCredentials: true })
            ]);
            setTeams(teamsRes.data?.data || []);
            setDateStats(dateRes.data?.data || []);
            setSizeStats(sizeRes.data?.data || []);
        } catch (err) {
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${API_URL}/admin/logout`, {}, { withCredentials: true });
            toast.success("Logged out");
            setTimeout(() => navigate("/login"), 500);
        } catch (err) {
            toast.error("Logout failed");
        }
    };

    // ---- Bar Chart: Date-wise Registrations ----
    const barData = {
        labels: dateStats.map(d => d._id),
        datasets: [
            {
                label: "Registrations",
                data: dateStats.map(d => d.count),
                backgroundColor: "#FF0A8A",
                borderRadius: 8,
            },
        ],
    };

    // ---- Pie Chart: Team Size Distribution ----
    const pieData = {
        labels: sizeStats.map(s => `${s._id} Members`),
        datasets: [
            {
                data: sizeStats.map(s => s.count),
                backgroundColor: ["#6C4BFF", "#22c55e", "#f59e0b", "#ef4444"],
            },
        ],
    };

    // ---- DELETE ----
    const handleDelete = async (id) => {
        if (!confirm("Delete this team?")) return;
        try {
            await axios.delete(`${API_URL}/teams/${id}`, { withCredentials: true });
            toast.success("Team deleted");
            fetchData();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    // ---- EDIT SAVE ----
    const handleEditSave = async () => {
        try {
            await axios.put(`${API_URL}/teams/${editTeam._id}`, editTeam, { withCredentials: true });
            toast.success("Team updated");
            setEditTeam(null);
            fetchData();
        } catch (err) {
            toast.error("Update failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0633] flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0633] text-white p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold tracking-widest">
                    🏏 ADMIN DASHBOARD
                </h1>
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-orange-500 rounded-full font-bold hover:bg-orange-600 transition"
                >
                    Logout
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-orange-500/20 border border-orange-500/40 p-6 rounded-2xl">
                    <h3 className="text-lg text-orange-300">Total Teams</h3>
                    <p className="text-4xl font-bold text-orange-400">{teams.length}</p>
                </div>
                <div className="bg-orange-500/20 border border-orange-500/40 p-6 rounded-2xl">
                    <h3 className="text-lg text-orange-300">Total Members</h3>
                    <p className="text-4xl font-bold text-orange-400">
                        {teams.reduce((acc, t) => acc + (t.teamSize || 0), 0)}
                    </p>
                </div>
                <div className="bg-orange-500/20 border border-orange-500/40 p-6 rounded-2xl">
                    <h3 className="text-lg text-orange-300">Today's Registrations</h3>
                    <p className="text-4xl font-bold text-orange-400">
                        {dateStats.find(d => d._id === new Date().toISOString().split('T')[0])?.count || 0}
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                <div className="bg-white/10 p-6 rounded-2xl border border-orange-500/30">
                    <h3 className="mb-4 font-bold text-orange-400">📊 Date-wise Registrations</h3>
                    <Bar data={barData} options={{ responsive: true }} />
                </div>

                <div className="bg-white/10 p-6 rounded-2xl border border-orange-500/30">
                    <h3 className="mb-4 font-bold text-orange-400">📈 Team Size Distribution</h3>
                    <div className="max-w-[300px] mx-auto">
                        <Pie data={pieData} />
                    </div>
                </div>
            </div>

            {/* Teams Table */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30">
                <h2 className="text-xl font-bold mb-4">Registered Teams</h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="text-orange-400 text-sm uppercase">
                            <tr>
                                <th className="p-3">Team</th>
                                <th className="p-3">Leader</th>
                                <th className="p-3">Size</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map((team) => (
                                <tr key={team._id} className="hover:bg-white/10 transition">
                                    <td
                                        className="p-3 cursor-pointer font-semibold"
                                        onClick={() => setSelectedTeam(team)}
                                    >
                                        {team.teamname}
                                    </td>
                                    <td className="p-3">{team.leader?.name}</td>
                                    <td className="p-3">{team.teamSize}</td>
                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => setEditTeam(team)}
                                            className="px-3 py-1 bg-orange-500 hover:bg-orange-600 rounded text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(team._id)}
                                            className="px-3 py-1 bg-orange-700 hover:bg-orange-800 rounded text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* EDIT MODAL */}
            {editTeam && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-[#120A3A] p-6 rounded-3xl w-[95%] max-w-lg border border-white/20">
                        <h2 className="text-xl font-bold mb-4">Edit Team</h2>

                        <label className="text-sm text-orange-400">Team Name</label>
                        <input
                            className="w-full p-3 rounded bg-white/10 mb-3"
                            value={editTeam.teamname}
                            onChange={(e) =>
                                setEditTeam({ ...editTeam, teamname: e.target.value })
                            }
                        />

                        <label className="text-sm text-orange-400">Leader Name</label>
                        <input
                            className="w-full p-3 rounded bg-white/10 mb-3"
                            value={editTeam.leader?.name || ""}
                            onChange={(e) =>
                                setEditTeam({
                                    ...editTeam,
                                    leader: { ...editTeam.leader, name: e.target.value },
                                })
                            }
                        />

                        <label className="text-sm text-orange-400">Leader Email</label>
                        <input
                            className="w-full p-3 rounded bg-white/10 mb-3"
                            value={editTeam.leader?.email || ""}
                            onChange={(e) =>
                                setEditTeam({
                                    ...editTeam,
                                    leader: { ...editTeam.leader, email: e.target.value },
                                })
                            }
                        />

                        <button
                            onClick={handleEditSave}
                            className="mt-4 w-full py-3 rounded-full hover:cursor-pointer bg-orange-500 hover:bg-orange-600 font-bold"
                        >
                            SAVE CHANGES
                        </button>

                        <button
                            onClick={() => setEditTeam(null)}
                            className="mt-3 w-full py-3 rounded-full bg-gray-600 hover:bg-gray-700"
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            )}

            {/* VIEW MODAL */}
            {/* VIEW MODAL */}
            {selectedTeam && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setSelectedTeam(null)}
                >
                    <div
                        className="bg-[#120A3A] rounded-3xl p-6 w-[95%] max-w-xl border border-white/20 overflow-y-auto max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-2">
                            {selectedTeam.teamname}
                        </h2>

                        <p className="text-sm text-gray-400 mb-4">
                            Registered on {new Date(selectedTeam.registeredAt).toLocaleString()}
                        </p>

                        {/* Transaction ID */}
                        {selectedTeam.transactionId && (
                            <div className="mb-4 p-3 bg-black/30 rounded">
                                <p className="text-orange-400 font-semibold">💳 Transaction ID</p>
                                <p className="text-white break-all">{selectedTeam.transactionId}</p>
                            </div>
                        )}

                        {/* Leader */}
                        {renderPersonDetails("Leader", selectedTeam.leader)}

                        {/* Members */}
                        {renderPersonDetails("Member 1", selectedTeam.member1)}
                        {renderPersonDetails("Member 2", selectedTeam.member2)}
                        {renderPersonDetails("Member 3", selectedTeam.member3)}

                        <button
                            onClick={() => setSelectedTeam(null)}
                            className="mt-6 w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 font-bold"
                        >
                            CLOSE
                        </button>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default AdminDashboard;
