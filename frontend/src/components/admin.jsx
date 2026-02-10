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

const API_URL = "https://hack-and-hit-webiste.vercel.app//api";

const AdminDashboard = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateStats, setDateStats] = useState([]);
    const [sizeStats, setSizeStats] = useState([]);
    const [filter, setFilter] = useState("ALL");

    const navigate = useNavigate();

    // ================= FETCH =================
    const fetchData = async () => {
        try {
            const [teamsRes, dateRes, sizeRes] = await Promise.all([
                axios.get(`${API_URL}/teams`, { withCredentials: true }),
                axios.get(`${API_URL}/admin/analytics/registrations`, { withCredentials: true }),
                axios.get(`${API_URL}/admin/analytics/team-sizes`, { withCredentials: true }),
            ]);

            setTeams(teamsRes.data.data || []);
            setDateStats(dateRes.data.data || []);
            setSizeStats(sizeRes.data.data || []);
        } catch {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ================= ROUND UPDATE =================
    const updateRound = async (teamId, round) => {
        try {
            await axios.patch(
                `${API_URL}/teams/${teamId}/round`,
                { round },
                { withCredentials: true }
            );

            setTeams(prev =>
                prev.map(t =>
                    t._id === teamId ? { ...t, [round]: true } : t
                )
            );

            toast.success(`${round.toUpperCase()} marked`);
        } catch {
            toast.error("Round update failed");
        }
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!confirm("Delete this team?")) return;
        try {
            await axios.delete(`${API_URL}/teams/${id}`, { withCredentials: true });
            setTeams(prev => prev.filter(t => t._id !== id));
            toast.success("Team deleted");
        } catch {
            toast.error("Delete failed");
        }
    };

    // ================= FILTER =================
    const displayedTeams = teams.filter(t => {
        if (filter === "PPT") return t.pptSubmitted;
        if (filter === "MAIL") return t.mailSent;
        if (filter === "R1") return t.round1;
        if (filter === "R2") return t.round2;
        if (filter === "R3") return t.round3;
        return true;
    });

    // ================= CHARTS =================
    const barData = {
        labels: dateStats.map(d => d._id),
        datasets: [{
            label: "Registrations",
            data: dateStats.map(d => d.count),
            backgroundColor: "#FF0A8A",
            borderRadius: 8,
        }],
    };

    const pieData = {
        labels: sizeStats.map(s => `${s._id} Members`),
        datasets: [{
            data: sizeStats.map(s => s.count),
            backgroundColor: ["#6C4BFF", "#22c55e", "#f59e0b", "#ef4444"],
        }],
    };

    // ================= PERSON DETAILS =================
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0633] flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0633] text-white p-6">

            {/* FILTERS */}
            <div className="flex gap-3 mb-6">
                {["ALL", "PPT", "MAIL", "R1", "R2", "R3"].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold
              ${filter === f ? "bg-orange-500 text-black" : "bg-white/10 hover:bg-white/20"}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* Total Teams */}
                <div className="bg-orange-500/20 border border-orange-500/40 p-6 rounded-2xl">
                    <h3 className="text-lg text-orange-300">Total Teams</h3>
                    <p className="text-4xl font-bold text-orange-400">
                        {teams.length}
                    </p>
                </div>

                {/* Total Members */}
                <div className="bg-orange-500/20 border border-orange-500/40 p-6 rounded-2xl">
                    <h3 className="text-lg text-orange-300">Total Members</h3>
                    <p className="text-4xl font-bold text-orange-400">
                        {teams.reduce((acc, t) => acc + (t.teamSize || 0), 0)}
                    </p>
                </div>

                {/* Today's Registrations */}
                <div className="bg-orange-500/20 border border-orange-500/40 p-6 rounded-2xl">
                    <h3 className="text-lg text-orange-300">Today's Registrations</h3>
                    <p className="text-4xl font-bold text-orange-400">
                        {
                            dateStats.find(
                                d => d._id === new Date().toISOString().split("T")[0]
                            )?.count || 0
                        }
                    </p>
                </div>

            </div>


            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                <div className="bg-white/10 p-6 rounded-xl">
                    <Bar data={barData} />
                </div>

                <div className="bg-white/10 p-6 rounded-xl flex justify-center">
                    <div className="w-[320px]">
                        <Pie data={pieData} />
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white/10 rounded-xl p-6">
                <table className="w-full border-separate border-spacing-y-3">
                    <thead className="text-orange-400">
                        <tr>
                            <th>Team</th>
                            <th>Leader</th>
                            <th>Size</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayedTeams.map(team => (
                            <tr key={team._id} className="bg-white/5">
                                <td
                                    className="p-3 font-semibold cursor-pointer hover:text-orange-400"
                                    onClick={() => setSelectedTeam(team)}
                                >
                                    {team.teamname}
                                </td>
                                <td className="p-3">{team.leader?.name}</td>
                                <td className="p-3">{team.teamSize}</td>

                                <td className="p-3 flex flex-wrap gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs
                    ${team.pptSubmitted ? "bg-green-500 text-black" : "bg-red-500"}`}>
                                        PPT
                                    </span>

                                    <span className={`px-3 py-1 rounded-full text-xs
                    ${team.mailSent ? "bg-pink-500 text-black" : "bg-red-500"}`}>
                                        MAIL
                                    </span>

                                    {["round1", "round2", "round3"].map((r, i) => (
                                        <button
                                            key={r}
                                            disabled={team[r]}
                                            onClick={() => updateRound(team._id, r)}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${team[r]
                                                    ? ["bg-blue-500", "bg-orange-500", "bg-purple-500"][i]
                                                    : "bg-white/10 hover:bg-white/20"}`}
                                        >
                                            {r.toUpperCase()}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handleDelete(team._id)}
                                        className="px-3 py-1 bg-orange-700 hover:bg-orange-800 rounded text-xs"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
                            Registered on{" "}
                            {new Date(selectedTeam.registeredAt).toLocaleString()}
                        </p>

                        {selectedTeam.transactionId && (
                            <div className="mb-4 p-3 bg-black/30 rounded">
                                <p className="text-orange-400 font-semibold">💳 Transaction ID</p>
                                <p className="text-white break-all">
                                    {selectedTeam.transactionId}
                                </p>
                            </div>
                        )}

                        {/* PPT SUBMISSION */}
                        <div className="mb-4 p-3 bg-black/30 rounded">
                            <p className="text-orange-400 font-semibold">📑 PPT Submission</p>

                            {selectedTeam.pptSubmitted && selectedTeam.pptLink ? (
                                <a
                                    href={selectedTeam.pptLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 underline break-all hover:text-emerald-300"
                                >
                                    Open Submitted PPT
                                </a>
                            ) : (
                                <p className="text-red-400 text-sm">
                                    PPT not submitted
                                </p>
                            )}
                        </div>

                        {renderPersonDetails("Leader", selectedTeam.leader)}
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

            <ToastContainer />
        </div>
    );
};

export default AdminDashboard;
