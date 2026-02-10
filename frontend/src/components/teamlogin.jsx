import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const TeamLogin = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const normalizePhone = (value) => value.replace(/\D/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.get(
        "https://hack-and-hit-webiste.vercel.app/api/teamleader-basic"
      );

      const teams = res.data.data;

      const normalizedInputEmail = email.trim().toLowerCase();
      const normalizedInputPhone = normalizePhone(phone);

      const matchedTeam = teams.find((team) => {
        const teamEmail = team.leader.email?.toLowerCase();
        const teamPhone = normalizePhone(team.leader.phone || "");

        return (
          teamEmail === normalizedInputEmail &&
          teamPhone === normalizedInputPhone
        );
      });

      if (!matchedTeam) {
        toast.error("Invalid leader credentials", {
          position: "top-center",
          autoClose: 2500,
        });
        setLoading(false);
        return;
      }

      // Save team session
      localStorage.setItem(
        "team",
        JSON.stringify({
          teamname: matchedTeam.teamname,
          leader: matchedTeam.leader,
        })
      );

      toast.success(`Welcome, ${matchedTeam.leader.name}!`, {
        position: "top-center",
        autoClose: 1500,
      });

      // ✅ REDIRECT TO PPT PAGE
      setTimeout(() => {
        navigate("/ppt-submit");
      }, 200);

    } catch (err) {
      toast.error("Server error. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen w-full bg-[#041323] relative overflow-hidden flex items-center justify-center px-6">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px]" />
        </div>

        {/* Card */}
        <div
          className="
            relative z-10
            w-full max-w-md
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-2xl
            px-10 py-12
            shadow-[0_30px_80px_rgba(0,0,0,0.45)]
          "
        >
          <div className="text-center mb-10">
            <h1 className="text-white text-4xl font-bold">
              Team Login
            </h1>
            <p className="mt-3 text-white/60">
              Only team leaders can log in
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/70">
                Team Leader Email
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="leader@example.com"
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/10 border border-white/10
                  text-white placeholder:text-white/40
                  outline-none transition
                  focus:border-emerald-400/60
                  focus:ring-1 focus:ring-emerald-400/30
                "
                required
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/70">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Leader's Phone Number"
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/10 border border-white/10
                  text-white placeholder:text-white/40
                  outline-none transition
                  focus:border-emerald-400/60
                  focus:ring-1 focus:ring-emerald-400/30
                "
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                mt-4 w-full py-3 rounded-lg
                text-[#041323] font-semibold text-lg
                transition
                ${
                  loading
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98]"
                }
              `}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default TeamLogin;
