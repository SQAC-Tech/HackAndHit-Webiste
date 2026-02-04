import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Form = () => {
  const [formNum, setFormNum] = useState(1);
  const [teamSize, setTeamSize] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    teamname: "",
    leaderemail: "",
    leadername: "",
    leaderphone: "",
    member1email: "",
    member1name: "",
    member1phone: "",
    member2email: "",
    member2name: "",
    member2phone: "",
    member3email: "",
    member3name: "",
    member3phone: "",
  });

  const pathRef = useRef(null);
  const progressRef = useRef(null);
  const runnerRef = useRef(null);

  const activeFields = [
    form.teamname,
    form.leaderemail,
    form.leadername,
    form.leaderphone,
    ...(teamSize >= 2
      ? [form.member1email, form.member1name, form.member1phone]
      : []),
    ...(teamSize >= 3
      ? [form.member2email, form.member2name, form.member2phone]
      : []),
    ...(teamSize >= 4
      ? [form.member3email, form.member3name, form.member3phone]
      : []),
  ];

  const filled = activeFields.filter((v) => v !== "").length;
  const progress = filled / activeFields.length;

  useEffect(() => {
    const path = pathRef.current;
    const progressPath = progressRef.current;
    const runner = runnerRef.current;
    if (!path || !progressPath || !runner) return;

    const length = path.getTotalLength();
    progressPath.style.strokeDasharray = length;
    progressPath.style.strokeDashoffset = length - length * progress;

    const point = path.getPointAtLength(length * progress);
    runner.setAttribute("x", point.x - 12);
    runner.setAttribute("y", point.y + 12);
  }, [progress]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        teamname: form.teamname,
        teamSize,
        leadername: form.leadername,
        leaderemail: form.leaderemail,
        leaderphone: form.leaderphone,
        member1name: form.member1name,
        member1email: form.member1email,
        member1phone: form.member1phone,
        member2name: form.member2name,
        member2email: form.member2email,
        member2phone: form.member2phone,
        member3name: form.member3name,
        member3email: form.member3email,
        member3phone: form.member3phone,
      };

      const res = await axios.post('http://localhost:3000/api/teams', payload);
      toast.success("Team registered successfully!");
      console.log(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#211E4C] flex flex-col items-center">
      <h1 className="font-heading text-4xl text-white mt-10 mb-4 text-center">
        HACK AND HIT
      </h1>

      <svg width="400" height="120" viewBox="0 0 400 120" className="mb-2">
        <path
          ref={pathRef}
          d="M20 100 Q180 20 340 100"
          fill="none"
          stroke="#555"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          ref={progressRef}
          d="M20 100 Q180 20 340 100"
          fill="none"
          stroke="purple"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <text ref={runnerRef} fontSize="36">⚽</text>
        <text x="0" y="105" fontSize="36">🏏</text>
        <text x="330" y="105" fontSize="36">🏆</text>
      </svg>

      <p className="text-white mb-6">
        {Math.round(progress * 100)}% completed
      </p>

      <form className="flex flex-col bg-white/10 rounded-xl p-10 w-[90%] max-w-xl text-white mb-10">

        {formNum === 1 && (
          <>
            <label className="text-lg mb-1">Team Name</label>
            <input
              className="p-4 rounded-xl mb-3 w-full border border-white/10 focus:border-pink-400 outline-none bg-transparent"
              placeholder="Enter your team name"
              onChange={(e) => setForm({ ...form, teamname: e.target.value })}
            />

            <label className="text-lg mb-1">Team Leader Email</label>
            <input
              className="p-4 rounded-xl mb-3 w-full border border-white/10 focus:border-pink-400 outline-none bg-transparent"
              placeholder="Enter your email"
              onChange={(e) => setForm({ ...form, leaderemail: e.target.value })}
            />

            <label className="text-lg mb-1">Team Leader Name</label>
            <input
              className="p-4 rounded-xl mb-3 w-full border border-white/10 focus:border-pink-400 outline-none bg-transparent"
              placeholder="Enter your name"
              onChange={(e) => setForm({ ...form, leadername: e.target.value })}
            />

            <label className="text-lg mb-1">Team Leader Phone Number</label>
            <input
              className="p-4 rounded-xl mb-3 w-full border border-white/10 focus:border-pink-400 outline-none bg-transparent"
              placeholder="Enter your phone number"
              onChange={(e) => setForm({ ...form, leaderphone: e.target.value })}
            />

            <label className="text-lg mb-1">Total Team Size</label>
            <select
              className="p-4 rounded-xl mb-4 w-full bg-pink-400 border border-white/10"
              onChange={(e) => setTeamSize(Number(e.target.value))}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>

            {teamSize === 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-3xl bg-green-500 p-3 text-white text-lg disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setFormNum(2)}
                className="rounded-3xl bg-blue-400 p-3 text-white text-lg"
              >
                Next
              </button>
            )}
          </>
        )}

        {formNum === 2 && teamSize >= 2 && (
          <>
            <label className="text-lg mb-1">Member 1 Email</label>
            <input
              className="p-4 rounded-xl mb-3 w-full border border-white/10 focus:border-pink-400 outline-none bg-transparent"
              onChange={(e) =>
                setForm({ ...form, member1email: e.target.value })
              }
            />

            <label className="text-lg mb-1">Member 1 Name</label>
            <input
              className="p-4 rounded-xl mb-3 w-full border border-white/10 focus:border-pink-400 outline-none bg-transparent"
              onChange={(e) =>
                setForm({ ...form, member1name: e.target.value })
              }
            />

            <label className="text-lg mb-1">Member 1 Phone</label>
            <input
              className="p-4 rounded-xl mb-4 w-full border border-white/10 focus:border-pink-400 outline-none bg-transparent"
              onChange={(e) =>
                setForm({ ...form, member1phone: e.target.value })
              }
            />

            {teamSize === 2 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-3xl bg-green-500 p-3 text-white text-lg disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setFormNum(3)}
                className="rounded-3xl bg-blue-400 p-3 text-white text-lg"
              >
                Next
              </button>
            )}
            <button
              type="button"
              onClick={() => setFormNum(1)}
              className="rounded-3xl bg-gray-400 p-3 text-white text-lg mt-3"
            >
              Previous
            </button>
          </>
        )}

        {formNum === 3 && teamSize >= 3 && (
          <>
            <label className="text-lg mb-1">Member 2 Email</label>
            <input
              className="p-4 rounded-xl mb-3 w-full border border-white/10 focus:border-pink-400 outline-none bg-transparent"
              onChange={(e) =>
                setForm({ ...form, member2email: e.target.value })
              }
            />

            <label className="text-lg mb-1">Member 2 Name</label>
            <input
              className="p-4 rounded-xl mb-3 w-full border border-white/10 focus:border-pink-400 outline-none bg-transparent"
              onChange={(e) =>
                setForm({ ...form, member2name: e.target.value })
              }
            />

            <label className="text-lg mb-1">Member 2 Phone</label>
            <input
              className="p-4 rounded-xl mb-4 w-full border border-white/10 focus:border-pink-400 outline-none bg-transparent"
              onChange={(e) =>
                setForm({ ...form, member2phone: e.target.value })
              }
            />

            {teamSize === 3 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-3xl bg-green-500 p-3 text-white text-lg disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setFormNum(4)}
                className="rounded-3xl bg-blue-400 p-3 text-white text-lg"
              >
                Next
              </button>
            )}
            <button
              type="button"
              onClick={() => setFormNum(2)}
              className="rounded-3xl bg-gray-400 p-3 text-white text-lg mt-3"
            >
              Previous
            </button>
          </>
        )}

        {formNum === 4 && teamSize >= 4 && (
          <>
            <label className="text-lg mb-1">Member 3 Email</label>
            <input
              className="p-4 rounded-xl mb-3 w-full border border-white/10 focus:border-pink-400 outline-none bg-transparent"
              onChange={(e) =>
                setForm({ ...form, member3email: e.target.value })
              }
            />

            <label className="text-lg mb-1">Member 3 Name</label>
            <input
              className="p-4 rounded-xl mb-3 w-full border border-white/10 focus:border-pink-400 outline-none bg-transparent"
              onChange={(e) =>
                setForm({ ...form, member3name: e.target.value })
              }
            />

            <label className="text-lg mb-1">Member 3 Phone</label>
            <input
              className="p-4 rounded-xl mb-4 w-full border border-white/10 focus:border-pink-400 outline-none bg-transparent"
              onChange={(e) =>
                setForm({ ...form, member3phone: e.target.value })
              }
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-3xl bg-green-500 p-3 text-white text-lg disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => setFormNum(3)}
              className="rounded-3xl bg-gray-400 p-3 text-white text-lg mt-3"
            >
              Previous
            </button>
          </>
        )}

      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Form;
