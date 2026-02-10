import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MODES = {
  TEST: "test",
  CC_BCC_TEST: "cc-bcc-test",
  LIVE: "live",
};

const AdminMailer = () => {
  const [mode, setMode] = useState(MODES.TEST);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }

    if (mode === MODES.TEST && !testEmail.trim()) {
      toast.error("Test email is required in Test mode");
      return;
    }

    if (mode === MODES.LIVE) {
      const confirm = window.confirm(
        "⚠️ You are about to send a LIVE mass mail to ALL team leaders.\n\nAre you absolutely sure?"
      );
      if (!confirm) return;
    }

    setLoading(true);

    try {
      const payload = {
        mode,
        subject,
        message,
      };

      if (mode === MODES.TEST) {
        payload.testEmail = testEmail;
      }

      const res = await axios.post(
        "https://hack-and-hit-webiste.vercel.app/api/mass-mail",
        payload
      );

      toast.success(
        `Mail sent (${res.data.mode}) to ${res.data.recipientsCount} recipient(s)`
      );

      if (mode !== MODES.LIVE) {
        setMessage("");
        setSubject("");
      }
    } catch (err) {
      toast.error("Failed to send mail");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen bg-[#041323] px-6 py-20 flex justify-center">
        <div className="
          w-full max-w-3xl
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          rounded-2xl
          p-10
          shadow-[0_30px_80px_rgba(0,0,0,0.45)]
        ">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-white text-4xl font-bold">
              Mass Mailer
            </h1>
            <p className="mt-3 text-white/60">
              Send official updates to Hack & Hit participants
            </p>
          </div>

          {/* Mode Switch */}
          <div className="flex gap-3 mb-8">
            {Object.values(MODES).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`
                  flex-1 py-2 rounded-lg text-sm font-semibold transition
                  ${
                    mode === m
                      ? "bg-emerald-500 text-[#041323]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }
                `}
              >
                {m === "test" && "Test"}
                {m === "cc-bcc-test" && "CC / BCC Test"}
                {m === "live" && "Live"}
              </button>
            ))}
          </div>

          {/* Warnings */}
          {mode === MODES.LIVE && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              ⚠️ Live mode will send email to ALL team leaders.
            </div>
          )}

          {mode === MODES.CC_BCC_TEST && (
            <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm">
              🧪 CC/BCC test will send mail ONLY to configured test emails.
            </div>
          )}

          {/* Test Email */}
          {mode === MODES.TEST && (
            <div className="mb-6">
              <label className="text-white/70 text-sm">
                Test Email
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="yourgmail@gmail.com"
                className="
                  mt-2 w-full px-4 py-3 rounded-lg
                  bg-white/10 border border-white/10
                  text-white placeholder:text-white/40
                  outline-none focus:ring-1 focus:ring-emerald-400/30
                "
              />
            </div>
          )}

          {/* Subject */}
          <div className="mb-6">
            <label className="text-white/70 text-sm">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="
                mt-2 w-full px-4 py-3 rounded-lg
                bg-white/10 border border-white/10
                text-white placeholder:text-white/40
                outline-none focus:ring-1 focus:ring-emerald-400/30
              "
              placeholder="Mail subject"
            />
          </div>

          {/* Message */}
          <div className="mb-8">
            <label className="text-white/70 text-sm">
              Message
            </label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="
                mt-2 w-full px-4 py-3 rounded-lg
                bg-white/10 border border-white/10
                text-white placeholder:text-white/40
                outline-none resize-none
                focus:ring-1 focus:ring-emerald-400/30
              "
              placeholder="Write your message here..."
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSend}
            disabled={loading}
            className={`
              w-full py-3 rounded-lg text-lg font-semibold transition
              ${
                loading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98]"
              }
              text-[#041323]
            `}
          >
            {loading ? "Sending..." : "Send Mail"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminMailer;
