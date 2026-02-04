import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MOMENTS = ["SIX 🔥", "BOUNDARY 🏏"];

const HOSTELS = [
  "Oori", "Kaari", "Paari", "Adhyaman", "Nelson Mandela", "International Hostel",
  "Agastyhar", "Sannasi A", "Sannasi C", "M-block", "Manoranjithm", "N-block",
  "Began", "ESQ", "Meenakshi", "Kalpana Chawla", "Other"
];

const Form = () => {
  const [formNum, setFormNum] = useState(1);
  const [teamSize, setTeamSize] = useState(2);
  const [loading, setLoading] = useState(false);
  const [moment, setMoment] = useState(null);

  const [form, setForm] = useState({
    teamname: "",
    // Leader
    leaderemail: "", leadername: "", leaderphone: "",
    leadertype: "dayscholar", leaderhostel: "", leaderwarden: "", leaderhostelcontact: "",
    // Member 1
    member1email: "", member1name: "", member1phone: "",
    member1type: "dayscholar", member1hostel: "", member1warden: "", member1hostelcontact: "",
    // Member 2
    member2email: "", member2name: "", member2phone: "",
    member2type: "dayscholar", member2hostel: "", member2warden: "", member2hostelcontact: "",
    // Member 3
    member3email: "", member3name: "", member3phone: "",
    member3type: "dayscholar", member3hostel: "", member3warden: "", member3hostelcontact: "",
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

  // Validation helpers
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const validateMember = (prefix, label) => {
    const name = form[`${prefix}name`];
    const email = form[`${prefix}email`];
    const phone = form[`${prefix}phone`];
    const type = form[`${prefix}type`];
    const hostel = form[`${prefix}hostel`];
    const warden = form[`${prefix}warden`];
    const hostelcontact = form[`${prefix}hostelcontact`];

    if (!name || name.length < 2) {
      toast.error(`${label} name must be at least 2 characters`);
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error(`Please enter a valid ${label} email`);
      return false;
    }
    if (!phoneRegex.test(phone)) {
      toast.error(`${label} phone must be 10 digits`);
      return false;
    }
    if (type === "hosteler") {
      if (!hostel) {
        toast.error(`Please select ${label} hostel`);
        return false;
      }
      if (!warden || warden.length < 2) {
        toast.error(`${label} warden name is required`);
        return false;
      }
      if (!phoneRegex.test(hostelcontact)) {
        toast.error(`${label} hostel contact must be 10 digits`);
        return false;
      }
    }
    return true;
  };

  const validateStep1 = () => {
    if (!form.teamname || form.teamname.length < 3) {
      toast.error("Team name must be at least 3 characters");
      return false;
    }
    return validateMember("leader", "Leader");
  };

  const validateStep2 = () => validateMember("member1", "Member 1");
  const validateStep3 = () => validateMember("member2", "Member 2");
  const validateStep4 = () => validateMember("member3", "Member 3");

  const validateForm = () => {
    if (!validateStep1()) return false;
    if (!validateStep2()) return false;
    if (teamSize >= 3 && !validateStep3()) return false;
    if (teamSize >= 4 && !validateStep4()) return false;
    return true;
  };

  const goToStep = (nextStep) => {
    if (nextStep === 2 && !validateStep1()) return;
    if (nextStep === 3 && !validateStep2()) return;
    if (nextStep === 4 && !validateStep3()) return;
    setFormNum(nextStep);
  };

  const handleSubmit = async () => {
    // Validate before submit
    if (!validateForm()) return;

    // 🔥 SIX / BOUNDARY animation
    setMoment(MOMENTS[Math.floor(Math.random() * MOMENTS.length)]);
    setTimeout(() => setMoment(null), 900);

    setLoading(true);
    try {
      const payload = {
        teamname: form.teamname,
        teamSize,
        // Leader
        leadername: form.leadername, leaderemail: form.leaderemail, leaderphone: form.leaderphone,
        leadertype: form.leadertype, leaderhostel: form.leaderhostel,
        leaderwarden: form.leaderwarden, leaderhostelcontact: form.leaderhostelcontact,
        // Member 1
        member1name: form.member1name, member1email: form.member1email, member1phone: form.member1phone,
        member1type: form.member1type, member1hostel: form.member1hostel,
        member1warden: form.member1warden, member1hostelcontact: form.member1hostelcontact,
        // Member 2
        member2name: form.member2name, member2email: form.member2email, member2phone: form.member2phone,
        member2type: form.member2type, member2hostel: form.member2hostel,
        member2warden: form.member2warden, member2hostelcontact: form.member2hostelcontact,
        // Member 3
        member3name: form.member3name, member3email: form.member3email, member3phone: form.member3phone,
        member3type: form.member3type, member3hostel: form.member3hostel,
        member3warden: form.member3warden, member3hostelcontact: form.member3hostelcontact,
      };

      await axios.post("http://localhost:3000/api/teams", payload);
      toast.success("🏏 Team registered successfully!");
      // Reset form
      setForm({
        teamname: "",
        leaderemail: "", leadername: "", leaderphone: "",
        leadertype: "dayscholar", leaderhostel: "", leaderwarden: "", leaderhostelcontact: "",
        member1email: "", member1name: "", member1phone: "",
        member1type: "dayscholar", member1hostel: "", member1warden: "", member1hostelcontact: "",
        member2email: "", member2name: "", member2phone: "",
        member2type: "dayscholar", member2hostel: "", member2warden: "", member2hostelcontact: "",
        member3email: "", member3name: "", member3phone: "",
        member3type: "dayscholar", member3hostel: "", member3warden: "", member3hostelcontact: "",
      });
      setFormNum(1);
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0B0633] via-[#140A52] to-[#0B0633] flex flex-col items-center">

      {/* 🔥 SIX / BOUNDARY OVERLAY */}
      {moment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="text-6xl sm:text-7xl font-extrabold text-orange-500 animate-bounce">
            {moment}
          </div>
        </div>
      )}

      <h1 className="font-heading text-4xl text-white mt-10 mb-4 text-center tracking-widest">
        🏏 HACK AND HIT
      </h1>

      <svg width="400" height="120" viewBox="0 0 400 120" className="mb-2">
        <path
          ref={pathRef}
          d="M20 100 Q180 20 340 100"
          fill="none"
          stroke="#2E2A66"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          ref={progressRef}
          d="M20 100 Q180 20 340 100"
          fill="none"
          stroke="#f97316"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <text ref={runnerRef} fontSize="36">🏏</text>
        <text x="0" y="105" fontSize="30">⚡</text>
        <text x="330" y="105" fontSize="30">🏆</text>
      </svg>

      <p className="text-orange-400 mb-6 font-semibold">
        {Math.round(progress * 100)}% completed
      </p>

      <form className="flex flex-col bg-white/10 backdrop-blur-xl rounded-2xl p-10 w-[90%] max-w-xl text-white mb-10 border border-orange-500/30 shadow-[0_0_40px_rgba(249,115,22,0.25)]">

        {/* STEP 1 */}
        {formNum === 1 && (
          <>
            <label className="text-sm mb-1 text-orange-400">Team Name</label>
            <input className="p-4 rounded-xl mb-3 w-full bg-black/30 border border-white/20 outline-none focus:border-orange-400" onChange={(e) => setForm({ ...form, teamname: e.target.value })} />

            <label className="text-sm mb-1 text-orange-400">Team Leader Email</label>
            <input className="p-4 rounded-xl mb-3 w-full bg-black/30 border border-white/20 outline-none focus:border-orange-400" onChange={(e) => setForm({ ...form, leaderemail: e.target.value })} />

            <label className="text-sm mb-1 text-orange-400">Team Leader Name</label>
            <input className="p-4 rounded-xl mb-3 w-full bg-black/30 border border-white/20 outline-none focus:border-orange-400" onChange={(e) => setForm({ ...form, leadername: e.target.value })} />

            <label className="text-sm mb-1 text-orange-400">Team Leader Phone</label>
            <input className="p-4 rounded-xl mb-3 w-full bg-black/30 border border-white/20 outline-none focus:border-orange-400" onChange={(e) => setForm({ ...form, leaderphone: e.target.value })} />

            <label className="text-sm mb-1 text-orange-400">Total Team Size</label>
            <select
              className="p-4 rounded-xl mb-4 w-full bg-orange-500 text-white font-bold"
              onChange={(e) => setTeamSize(Number(e.target.value))}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>

            <button
              type="button"
              onClick={() => setFormNum(2)}
              className="rounded-full bg-orange-500 hover:bg-orange-600 p-4 text-white text-lg font-bold"
            >
              Next
            </button>
          </>
        )}

        {/* STEP 2 */}
        {formNum === 2 && teamSize >= 2 && (
          <>
            <label className="text-sm mb-1 text-orange-400">Member 1 Email</label>
            <input className="p-4 rounded-xl mb-3 w-full bg-black/30 border border-white/20 outline-none focus:border-orange-400" onChange={(e) => setForm({ ...form, member1email: e.target.value })} />

            <label className="text-sm mb-1 text-orange-400">Member 1 Name</label>
            <input className="p-4 rounded-xl mb-3 w-full bg-black/30 border border-white/20 outline-none focus:border-orange-400" onChange={(e) => setForm({ ...form, member1name: e.target.value })} />

            <label className="text-sm mb-1 text-orange-400">Member 1 Phone</label>
            <input className="p-4 rounded-xl mb-4 w-full bg-black/30 border border-white/20 outline-none focus:border-orange-400" onChange={(e) => setForm({ ...form, member1phone: e.target.value })} />

            {teamSize === 2 ? (
              <button onClick={handleSubmit} className="rounded-full bg-orange-500 hover:bg-orange-600 p-4 text-white text-lg font-bold">
                Submit
              </button>
            ) : (
              <button onClick={() => setFormNum(3)} className="rounded-full bg-orange-500 hover:bg-orange-600 p-4 text-white text-lg font-bold">
                Next
              </button>
            )}
          </>
        )}

        {/* STEP 3 */}
        {formNum === 3 && teamSize >= 3 && (
          <>
            <label className="text-sm mb-1 text-orange-400">Member 2 Email</label>
            <input className="p-4 rounded-xl mb-3 w-full bg-black/30 border border-white/20 outline-none focus:border-orange-400" onChange={(e) => setForm({ ...form, member2email: e.target.value })} />

            <label className="text-sm mb-1 text-orange-400">Member 2 Name</label>
            <input className="p-4 rounded-xl mb-3 w-full bg-black/30 border border-white/20 outline-none focus:border-orange-400" onChange={(e) => setForm({ ...form, member2name: e.target.value })} />

            <label className="text-sm mb-1 text-orange-400">Member 2 Phone</label>
            <input className="p-4 rounded-xl mb-4 w-full bg-black/30 border border-white/20 outline-none focus:border-orange-400" onChange={(e) => setForm({ ...form, member2phone: e.target.value })} />

            {teamSize === 3 ? (
              <button onClick={handleSubmit} className="rounded-full bg-orange-500 hover:bg-orange-600 p-4 text-white text-lg font-bold">
                Submit
              </button>
            ) : (
              <button onClick={() => setFormNum(4)} className="rounded-full bg-orange-500 hover:bg-orange-600 p-4 text-white text-lg font-bold">
                Next
              </button>
            )}
          </>
        )}

        {/* STEP 4 */}
        {formNum === 4 && teamSize >= 4 && (
          <>
            <label className="text-sm mb-1 text-orange-400">Member 3 Email</label>
            <input className="p-4 rounded-xl mb-3 w-full bg-black/30 border border-white/20 outline-none focus:border-orange-400" onChange={(e) => setForm({ ...form, member3email: e.target.value })} />

            <label className="text-sm mb-1 text-orange-400">Member 3 Name</label>
            <input className="p-4 rounded-xl mb-3 w-full bg-black/30 border border-white/20 outline-none focus:border-orange-400" onChange={(e) => setForm({ ...form, member3name: e.target.value })} />

            <label className="text-sm mb-1 text-orange-400">Member 3 Phone</label>
            <input className="p-4 rounded-xl mb-4 w-full bg-black/30 border border-white/20 outline-none" onChange={(e) => setForm({ ...form, member3phone: e.target.value })} />

            <button onClick={handleSubmit} className="rounded-full bg-green-500 p-4 text-white text-lg font-bold">
              Submit
            </button>
          </>
        )}
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Form;
