import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";

const HOSTELS = [
  "Oori",
  "Kaari",
  "Paari",
  "Adhyaman",
  "Nelson Mandela",
  "International Hostel",
  "Agastyhar",
  "Sannasi A",
  "Sannasi C",
  "M-block",
  "Manoranjithm",
  "N-block",
  "Began",
  "ESQ",
  "Meenakshi",
  "Kalpana Chawla",
  "Other",
];

const Form = () => {
  const navigate = useNavigate();
  const [formNum, setFormNum] = useState(1);
  const [teamSize, setTeamSize] = useState(2);
  const [loading, setLoading] = useState(false);

  const paymentStep = teamSize + 1;

  const [form, setForm] = useState({
    teamname: "",

    leaderemail: "",
    leadername: "",
    leaderphone: "",
    leaderType: "dayscholar",
    leaderHostel: "",
    leaderWarden: "",
    leaderHostelContact: "",

    member1email: "",
    member1name: "",
    member1phone: "",
    member1Type: "dayscholar",
    member1Hostel: "",
    member1Warden: "",
    member1HostelContact: "",

    member2email: "",
    member2name: "",
    member2phone: "",
    member2Type: "dayscholar",
    member2Hostel: "",
    member2Warden: "",
    member2HostelContact: "",

    member3email: "",
    member3name: "",
    member3phone: "",
    member3Type: "dayscholar",
    member3Hostel: "",
    member3Warden: "",
    member3HostelContact: "",

    transactionId: "",
  });

  const PrevButton = () => (
    <button
      type="button"
      onClick={() => setFormNum((p) => Math.max(1, p - 1))}
      className="w-full mt-3 bg-gray-600 p-4 rounded-full font-bold text-white"
    >
      ← Previous
    </button>
  );

  const renderHostelFields = (prefix) =>
    form[`${prefix}Type`] === "hosteler" && (
      <>
        <label className="text-sm text-orange-300">Hostel</label>
        <select
          name={`${prefix}Hostel`}
          autoComplete="off"
          className="w-full p-4 mb-3 rounded bg-black/30"
          value={form[`${prefix}Hostel`]}
          onChange={(e) =>
            setForm({ ...form, [`${prefix}Hostel`]: e.target.value })
          }
        >
          <option value="">Select Hostel</option>
          {HOSTELS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        <label className="text-sm text-orange-300">Warden Name</label>
        <input
          type="text"
          name={`${prefix}Warden`}
          autoComplete="name"
          className="w-full p-4 mb-3 rounded bg-black/30"
          value={form[`${prefix}Warden`]}
          onChange={(e) =>
            setForm({ ...form, [`${prefix}Warden`]: e.target.value })
          }
        />

        <label className="text-sm text-orange-300">Hostel Contact</label>
        <input
          type="tel"
          name={`${prefix}HostelContact`}
          autoComplete="tel"
          inputMode="numeric"
          className="w-full p-4 mb-4 rounded bg-black/30"
          value={form[`${prefix}HostelContact`]}
          onChange={(e) =>
            setForm({ ...form, [`${prefix}HostelContact`]: e.target.value })
          }
        />
      </>
    );

  const renderMember = (num) => {
    const p = `member${num}`;
    const isLastMember = num === teamSize - 1;

    return (
      <>
        <label className="text-sm text-orange-300">Member {num} Email</label>
        <input
          type="email"
          name={`${p}email`}
          autoComplete="email"
          className="w-full p-4 mb-4 rounded bg-black/30"
          value={form[`${p}email`]}
          onChange={(e) => setForm({ ...form, [`${p}email`]: e.target.value })}
        />

        <label className="text-sm text-orange-300">Member {num} Name</label>
        <input
          type="text"
          name={`${p}name`}
          autoComplete="name"
          className="w-full p-4 mb-4 rounded bg-black/30"
          value={form[`${p}name`]}
          onChange={(e) => setForm({ ...form, [`${p}name`]: e.target.value })}
        />

        <label className="text-sm text-orange-300">Member {num} Phone</label>
        <input
          type="tel"
          name={`${p}phone`}
          autoComplete="tel"
          inputMode="numeric"
          className="w-full p-4 mb-4 rounded bg-black/30"
          value={form[`${p}phone`]}
          onChange={(e) => setForm({ ...form, [`${p}phone`]: e.target.value })}
        />

        <label className="text-sm text-orange-300">Member Type</label>
        <select
          name={`${p}Type`}
          autoComplete="off"
          className="w-full p-4 mb-3 rounded bg-black/30"
          value={form[`${p}Type`]}
          onChange={(e) =>
            setForm({
              ...form,
              [`${p}Type`]: e.target.value,
              ...(e.target.value === "dayscholar" && {
                [`${p}Hostel`]: "",
                [`${p}Warden`]: "",
                [`${p}HostelContact`]: "",
              }),
            })
          }
        >
          <option value="dayscholar">Day Scholar</option>
          <option value="hosteler">Hosteler</option>
        </select>

        {renderHostelFields(p)}

        <button
          type="button"
          onClick={() => setFormNum(isLastMember ? paymentStep : formNum + 1)}
          className="w-full bg-orange-500 p-4 rounded-full font-bold"
        >
          Next
        </button>

        <PrevButton />
      </>
    );
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const inputs = document.querySelectorAll("input, select");
      const syncedForm = { ...form };

      inputs.forEach((el) => {
        if (el.name && el.value) {
          syncedForm[el.name] = el.value;
        }
      });

      if (!syncedForm.transactionId) {
        toast.error("Transaction ID is required");
        setLoading(false);
        return;
      }

      await axios.post("https://hack-and-hit-webiste.vercel.app/api/teams", {
        teamname: syncedForm.teamname,
        teamSize,
        leader: {
          name: syncedForm.leadername,
          email: syncedForm.leaderemail,
          phone: syncedForm.leaderphone,
          type: syncedForm.leaderType,
          hostel: syncedForm.leaderHostel,
          warden: syncedForm.leaderWarden,
          hostelContact: syncedForm.leaderHostelContact,
        },
        member1: {
          name: syncedForm.member1name,
          email: syncedForm.member1email,
          phone: syncedForm.member1phone,
          type: syncedForm.member1Type,
          hostel: syncedForm.member1Hostel,
          warden: syncedForm.member1Warden,
          hostelContact: syncedForm.member1HostelContact,
        },
        ...(teamSize >= 3 && {
          member2: {
            name: syncedForm.member2name,
            email: syncedForm.member2email,
            phone: syncedForm.member2phone,
            type: syncedForm.member2Type,
            hostel: syncedForm.member2Hostel,
            warden: syncedForm.member2Warden,
            hostelContact: syncedForm.member2HostelContact,
          },
        }),
        ...(teamSize === 4 && {
          member3: {
            name: syncedForm.member3name,
            email: syncedForm.member3email,
            phone: syncedForm.member3phone,
            type: syncedForm.member3Type,
            hostel: syncedForm.member3Hostel,
            warden: syncedForm.member3Warden,
            hostelContact: syncedForm.member3HostelContact,
          },
        }),
        transactionId: syncedForm.transactionId,
      });

      toast.success("🏏 Team registered successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0633] flex flex-col items-center">
      <h1 className="text-4xl text-white mt-10 mb-6">🏏 HACK AND HIT</h1>

      <form className="bg-white/10 p-10 rounded-2xl w-[90%] max-w-xl text-white">
        {formNum === 1 && (
          <>
            <label className="text-sm text-orange-300">Team Name</label>
            <input
              type="text"
              name="teamname"
              autoComplete="organization"
              className="w-full p-4 mb-4 rounded bg-black/30"
              value={form.teamname}
              onChange={(e) => setForm({ ...form, teamname: e.target.value })}
            />

            <label className="text-sm text-orange-300">Leader Email</label>
            <input
              type="email"
              name="leaderemail"
              autoComplete="email"
              className="w-full p-4 mb-4 rounded bg-black/30"
              value={form.leaderemail}
              onChange={(e) =>
                setForm({ ...form, leaderemail: e.target.value })
              }
            />

            <label className="text-sm text-orange-300">Leader Name</label>
            <input
              type="text"
              name="leadername"
              autoComplete="name"
              className="w-full p-4 mb-4 rounded bg-black/30"
              value={form.leadername}
              onChange={(e) => setForm({ ...form, leadername: e.target.value })}
            />

            <label className="text-sm text-orange-300">Leader Phone</label>
            <input
              type="tel"
              name="leaderphone"
              autoComplete="tel"
              inputMode="numeric"
              className="w-full p-4 mb-4 rounded bg-black/30"
              value={form.leaderphone}
              onChange={(e) =>
                setForm({ ...form, leaderphone: e.target.value })
              }
            />

            <label className="text-sm text-orange-300">Leader Type</label>
            <select
              name="leaderType"
              className="w-full p-4 mb-3 rounded bg-black/30"
              value={form.leaderType}
              onChange={(e) =>
                setForm({
                  ...form,
                  leaderType: e.target.value,
                  ...(e.target.value === "dayscholar" && {
                    leaderHostel: "",
                    leaderWarden: "",
                    leaderHostelContact: "",
                  }),
                })
              }
            >
              <option value="dayscholar">Day Scholar</option>
              <option value="hosteler">Hosteler</option>
            </select>

            {renderHostelFields("leader")}

            <label className="text-sm text-orange-300">Team Size</label>
            <select
              className="w-full p-4 mb-6 rounded bg-orange-500 text-black font-bold"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
            >
              <option value={2}>2 Members</option>
              <option value={3}>3 Members</option>
              <option value={4}>4 Members</option>
            </select>

            <button
              type="button"
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
              type="text"
              name="transactionId"
              autoComplete="off"
              className="w-full p-4 mb-6 rounded bg-black/30"
              value={form.transactionId}
              onChange={(e) =>
                setForm({ ...form, transactionId: e.target.value })
              }
            />

            <button
              type="button"
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
