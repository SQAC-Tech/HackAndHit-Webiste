import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MOMENTS = ["SIX 🔥", "BOUNDARY 🏏"];

const HOSTELS = [
  "Oori", "Kaari", "Paari", "Adhyaman", "Nelson Mandela",
  "International Hostel", "Agastyhar", "Sannasi A", "Sannasi C",
  "M-block", "Manoranjithm", "N-block", "Began", "ESQ",
  "Meenakshi", "Kalpana Chawla", "Other"
];

const Form = () => {
  const [formNum, setFormNum] = useState(1);
  const [teamSize, setTeamSize] = useState(2);
  const [loading, setLoading] = useState(false);
  const [moment, setMoment] = useState(null);

  const paymentStep = teamSize + 1;

  const [form, setForm] = useState({
    teamname: "",

    leaderemail: "", leadername: "", leaderphone: "",
    leaderType: "dayscholar", leaderHostel: "", leaderWarden: "", leaderHostelContact: "",

    member1email: "", member1name: "", member1phone: "",
    member1Type: "dayscholar", member1Hostel: "", member1Warden: "", member1HostelContact: "",

    member2email: "", member2name: "", member2phone: "",
    member2Type: "dayscholar", member2Hostel: "", member2Warden: "", member2HostelContact: "",

    member3email: "", member3name: "", member3phone: "",
    member3Type: "dayscholar", member3Hostel: "", member3Warden: "", member3HostelContact: "",

    transactionId: ""
  });

  const PrevButton = () => (
    <button
      type="button"
      onClick={() => setFormNum(p => Math.max(1, p - 1))}
      className="w-full mt-3 bg-gray-600 hover:bg-gray-700 p-4 rounded-full font-bold text-white"
    >
      ← Previous
    </button>
  );

  const renderHostelFields = (prefix) =>
    form[`${prefix}Type`] === "hosteler" && (
      <>
        <label className="text-sm text-orange-300">Hostel</label>
        <select
          className="w-full p-4 mb-3 rounded bg-black/30"
          onChange={e => setForm({ ...form, [`${prefix}Hostel`]: e.target.value })}
        >
          <option value="">Select Hostel</option>
          {HOSTELS.map(h => <option key={h}>{h}</option>)}
        </select>

        <label className="text-sm text-orange-300">Warden Name</label>
        <input
          className="w-full p-4 mb-3 rounded bg-black/30"
          onChange={e => setForm({ ...form, [`${prefix}Warden`]: e.target.value })}
        />

        <label className="text-sm text-orange-300">Hostel Contact</label>
        <input
          className="w-full p-4 mb-4 rounded bg-black/30"
          onChange={e => setForm({ ...form, [`${prefix}HostelContact`]: e.target.value })}
        />
      </>
    );

  const handleSubmit = async () => {
    if (loading) return;

    setMoment(MOMENTS[Math.floor(Math.random() * MOMENTS.length)]);
    setTimeout(() => setMoment(null), 900);

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/teams", {
        teamname: form.teamname,
        teamSize,
        leader: {
          name: form.leadername,
          email: form.leaderemail,
          phone: form.leaderphone,
          type: form.leaderType,
          hostel: form.leaderHostel,
          warden: form.leaderWarden,
          hostelContact: form.leaderHostelContact
        },
        member1: {
          name: form.member1name,
          email: form.member1email,
          phone: form.member1phone,
          type: form.member1Type,
          hostel: form.member1Hostel,
          warden: form.member1Warden,
          hostelContact: form.member1HostelContact
        },
        ...(teamSize >= 3 && {
          member2: {
            name: form.member2name,
            email: form.member2email,
            phone: form.member2phone,
            type: form.member2Type,
            hostel: form.member2Hostel,
            warden: form.member2Warden,
            hostelContact: form.member2HostelContact
          }
        }),
        ...(teamSize === 4 && {
          member3: {
            name: form.member3name,
            email: form.member3email,
            phone: form.member3phone,
            type: form.member3Type,
            hostel: form.member3Hostel,
            warden: form.member3Warden,
            hostelContact: form.member3HostelContact
          }
        }),
        transactionId: form.transactionId
      });

      toast.success("🏏 Team registered successfully!");
      setFormNum(1);
    } catch (err) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const renderMember = (num) => {
    const p = `member${num}`;
    return (
      <>
        {["email", "name", "phone"].map(f => (
          <div key={f} className="flex flex-col mb-4">
            <label className="text-sm text-orange-300">
              Member {num} {f.toUpperCase()}
            </label>
            <input
              className="w-full p-4 rounded bg-black/30"
              onChange={e => setForm({ ...form, [`${p}${f}`]: e.target.value })}
            />
          </div>
        ))}

        <label className="text-sm text-orange-300">Member Type</label>
        <select
          className="w-full p-4 mb-3 rounded bg-black/30"
          onChange={e => setForm({ ...form, [`${p}Type`]: e.target.value })}
        >
          <option value="dayscholar">Day Scholar</option>
          <option value="hosteler">Hosteler</option>
        </select>

        {renderHostelFields(p)}

        <button
          onClick={() => setFormNum(formNum + 1)}
          className="w-full bg-orange-500 p-4 rounded-full font-bold"
        >
          Next
        </button>

        <PrevButton />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0633] via-[#140A52] to-[#0B0633] flex flex-col items-center">
      {moment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-6xl text-orange-500 animate-bounce">{moment}</div>
        </div>
      )}

      <h1 className="text-4xl text-white mt-10 mb-6">🏏 HACK AND HIT</h1>

      <form className="bg-white/10 p-10 rounded-2xl w-[90%] max-w-xl text-white flex flex-col">

        {formNum === 1 && (
          <>
            <label className="text-sm text-orange-300">Team Name</label>
            <input className="w-full p-4 mb-4 rounded bg-black/30"
              onChange={e => setForm({ ...form, teamname: e.target.value })} />

            <label className="text-sm text-orange-300">Leader Email</label>
            <input className="w-full p-4 mb-4 rounded bg-black/30"
              onChange={e => setForm({ ...form, leaderemail: e.target.value })} />

            <label className="text-sm text-orange-300">Leader Name</label>
            <input className="w-full p-4 mb-4 rounded bg-black/30"
              onChange={e => setForm({ ...form, leadername: e.target.value })} />

            <label className="text-sm text-orange-300">Leader Phone</label>
            <input className="w-full p-4 mb-4 rounded bg-black/30"
              onChange={e => setForm({ ...form, leaderphone: e.target.value })} />

            <label className="text-sm text-orange-300">Leader Type</label>
            <select className="w-full p-4 mb-3 rounded bg-black/30"
              onChange={e => setForm({ ...form, leaderType: e.target.value })}>
              <option value="dayscholar">Day Scholar</option>
              <option value="hosteler">Hosteler</option>
            </select>

            {renderHostelFields("leader")}

            <label className="text-sm text-orange-300">Team Size</label>
            <select className="w-full p-4 mb-6 rounded bg-orange-500 text-black font-bold"
              onChange={e => setTeamSize(Number(e.target.value))}>
              <option value={2}>2 Members</option>
              <option value={3}>3 Members</option>
              <option value={4}>4 Members</option>
            </select>

            <button
              onClick={() => setFormNum(2)}
              className="w-full bg-orange-500 p-4 rounded-full font-bold"
            >
              Next
            </button>
          </>
        )}

        {formNum === 2 && renderMember(1)}
        {formNum === 3 && teamSize >= 3 && renderMember(2)}
        {formNum === 4 && teamSize === 4 && renderMember(3)}

        {formNum === paymentStep && (
          <>
            <img src="/QR.jpeg" className="w-40 mx-auto my-6" />

            <label className="text-sm text-orange-300">Transaction ID</label>
            <input
              className="w-full p-4 mb-6 rounded bg-black/30"
              onChange={e => setForm({ ...form, transactionId: e.target.value })}
            />

            <button
            type="submit"
              onClick={handleSubmit}
              className="w-full bg-green-500 p-4 rounded-full font-bold"
            >
              Submit
            </button>

            <PrevButton />
          </>
        )}

      </form>

      <ToastContainer />
    </div>
  );
};

export default Form;
