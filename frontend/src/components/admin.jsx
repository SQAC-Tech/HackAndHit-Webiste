import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const ADMIN_HEADERS = {
    headers: {
        "x-admin-token": "supersecretadmin123",
    },
};

const AdminDashboard = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [editTeam, setEditTeam] = useState(null);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        const res = await axios.get("http://localhost:3000/api/teams");
        setTeams(res.data?.data || []);
    };

    // ---- Analytics ----
    const teamSizes = teams.map((t) => t.teamSize || 0);
    const sizeCount = [2, 3, 4].map(
        (size) => teamSizes.filter((s) => s === size).length
    );

    const barData = {
        labels: ["2 Members", "3 Members", "4 Members"],
        datasets: [
            {
                label: "Teams",
                data: sizeCount,
                backgroundColor: ["#6C4BFF", "#22c55e", "#f59e0b"],
            },
        ],
    };

    const doughnutData = {
        labels: ["2", "3", "4"],
        datasets: [
            {
                data: sizeCount,
                backgroundColor: ["#6C4BFF", "#22c55e", "#f59e0b"],
            },
        ],
    };

    // ---- DELETE ----
    const handleDelete = async (id) => {
        if (!confirm("Delete this team?")) return;
        await axios.delete(
            `http://localhost:3000/api/teams/${id}`,
            ADMIN_HEADERS
        );
        fetchTeams();
    };

    // ---- EDIT SAVE ----
    const handleEditSave = async () => {
        await axios.put(
            `http://localhost:3000/api/teams/${editTeam._id}`,
            editTeam,
            ADMIN_HEADERS
        );
        setEditTeam(null);
        fetchTeams();
    };

    return (
        <div className="min-h-screen bg-[#0B0633] text-white p-6">

            <h1 className="text-4xl font-extrabold tracking-widest mb-8">
                ADMIN DASHBOARD
            </h1>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                    <h3 className="mb-4 font-bold">Teams by Size</h3>
                    <Bar data={barData} />
                </div>

                <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                    <h3 className="mb-4 font-bold">Distribution</h3>
                    <Doughnut data={doughnutData} />
                </div>
            </div>

            {/* Teams Table */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold mb-4">Registered Teams</h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="text-pink-400 text-sm uppercase">
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
                                            className="px-3 py-1 bg-blue-500 rounded text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(team._id)}
                                            className="px-3 py-1 bg-red-500 rounded text-sm"
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

                        <label className="text-sm text-pink-400">Team Name</label>
                        <input
                            className="w-full p-3 rounded bg-white/10 mb-3"
                            value={editTeam.teamname}
                            onChange={(e) =>
                                setEditTeam({ ...editTeam, teamname: e.target.value })
                            }
                        />

                        <label className="text-sm text-pink-400">Leader Name</label>
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

                        <label className="text-sm text-pink-400">Leader Email</label>
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
                            className="mt-4 w-full py-3 rounded-full hover:cursor-pointer bg-pink-500 font-bold"
                        >
                            SAVE CHANGES
                        </button>

                        <button
                            onClick={() => setEditTeam(null)}
                            className="mt-3 w-full py-3 rounded-full bg-gray-600"
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            )}

            {/* VIEW MODAL */}
            {selectedTeam && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setSelectedTeam(null)}
                >
                    <div
                        className="bg-[#120A3A] rounded-3xl p-6 w-[95%] max-w-xl border border-white/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedTeam.teamname}
                        </h2>

                        <p>
                            <span className="text-pink-400">Leader:</span>{" "}
                            {selectedTeam.leader?.name}
                        </p>

                        {["member1", "member2", "member3"].map(
                            (key, i) =>
                                selectedTeam[key] && (
                                    <div key={key} className="mt-4 border-t border-white/10 pt-3">
                                        <p className="text-pink-400 text-sm">
                                            Member {i + 1}
                                        </p>
                                        <p>{selectedTeam[key].name}</p>
                                    </div>
                                )
                        )}

                        <button
                            onClick={() => setSelectedTeam(null)}
                            className="mt-6 w-full py-3 rounded-full hover:cursor-pointer bg-pink-500 font-bold"
                        >
                            CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
