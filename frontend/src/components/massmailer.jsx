import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://hackandhit-webiste.onrender.com/api/mass-mail";

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
  const [ccEmails, setCcEmails] = useState("");
  const [bccEmails, setBccEmails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }

    if (mode === MODES.TEST && !testEmail.trim()) {
      toast.error("Test email required");
      return;
    }

    if (mode === MODES.LIVE) {
      if (!window.confirm("Send LIVE mail to ALL participants?")) return;
    }

    setLoading(true);

    try {
      const payload = {
        mode,
        subject,
        message,
      };

      if (mode === MODES.TEST) payload.testEmail = testEmail;

      if (mode === MODES.CC_BCC_TEST) {
        payload.ccEmails = ccEmails.split(",").map(e => e.trim());
        payload.bccEmails = bccEmails.split(",").map(e => e.trim());
      }

      const res = await axios.post(API_URL, payload);

      // 🔥 Live mode: show toast for each sent mail
      if (mode === MODES.LIVE && res.data.sent) {
        res.data.sent.forEach(email => {
          toast.success(`Mail sent → ${email}`);
        });
      } else {
        toast.success("Mail sent successfully");
      }

      setSubject("");
      setMessage("");

    } catch (err) {
      toast.error("Mail sending failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen bg-[#041323] px-6 py-20 flex justify-center">
        <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10">

          <h1 className="text-white text-3xl font-bold mb-6 text-center">
            Mass Mailer
          </h1>

          {/* MODE SWITCH */}
          <div className="flex gap-3 mb-6">
            {Object.values(MODES).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg ${
                  mode === m ? "bg-emerald-500 text-black" : "bg-white/10 text-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {mode === MODES.TEST && (
            <input
              placeholder="Test Email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded bg-white/10 text-white"
            />
          )}

          {mode === MODES.CC_BCC_TEST && (
            <>
              <input
                placeholder="CC Emails (comma separated)"
                value={ccEmails}
                onChange={(e) => setCcEmails(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded bg-white/10 text-white"
              />

              <input
                placeholder="BCC Emails (comma separated)"
                value={bccEmails}
                onChange={(e) => setBccEmails(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded bg-white/10 text-white"
              />
            </>
          )}

          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded bg-white/10 text-white"
          />

          <textarea
            rows={6}
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full mb-6 px-4 py-3 rounded bg-white/10 text-white"
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-emerald-500 text-black font-bold"
          >
            {loading ? "Sending..." : "Send Mail"}
          </button>

        </div>
      </div>
    </>
  );
};

export default AdminMailer;
