import { useState } from "react";

import api from "./services/api";

import Header from "./components/Header";
import Footer from "./components/Footer";
import EvidenceCard from "./components/EvidenceCard";
import HistorySidebar from "./components/HistorySidebar";

import { exportPDF } from "./utils/pdfExport";

function App() {

  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [history, setHistory] = useState(() => {

    return JSON.parse(localStorage.getItem("truthlens")) || [];

  });

  const analyze = async () => {

    if (!text.trim()) return;

    setLoading(true);

    try {

      const res = await api.post("/predict", {
  text,
});

      setResult(res.data);

      const updated = [

        {
          text,
          ...res.data,
        },

        ...history,

      ].slice(0, 5);

      setHistory(updated);

      localStorage.setItem(
        "truthlens",
        JSON.stringify(updated)
      );

    } catch (err) {
  console.error("FULL ERROR:", err);

  if (err.response) {
    console.log("Status:", err.response.status);
    console.log("Data:", err.response.data);
  } else if (err.request) {
    console.log("No response received:", err.request);
  } else {
    console.log("Error:", err.message);
  }

  alert("Request failed. Check the browser console (F12).");
}

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">

      <div className="absolute w-96 h-96 rounded-full bg-cyan-500/20 blur-[150px] top-0 left-0"></div>

      <div className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-[150px] bottom-0 right-0"></div>

      <div className="relative container mx-auto p-8">

        <Header />

        <div className="grid lg:grid-cols-4 gap-8">

          <div className="lg:col-span-1">

            <HistorySidebar

              history={history}

              onSelect={(item) => {

                setText(item.text);

                setResult(item);

              }}

            />

          </div>

          <div className="lg:col-span-3">

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

              <textarea

                value={text}

                onChange={(e) => setText(e.target.value)}

                rows={8}

                className="w-full rounded-2xl bg-slate-900 p-5 outline-none border border-slate-700 focus:border-cyan-400 transition"

                placeholder="Paste a news article or claim here..."

              />

              <div className="text-right mt-2 text-gray-400">

                {text.length} characters

              </div>

              <button

                disabled={loading}

                onClick={analyze}

                className="mt-6 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition"

              >

                {loading

                  ? "Analyzing..."

                  : "Analyze"}

              </button>

            </div>

            {result && (

              <div className="mt-8 bg-white/5 rounded-3xl p-8 backdrop-blur-xl border border-white/10">

                <h2 className="text-3xl font-bold">

                  {result.prediction === "Fake"

                    ? "❌ Fake"

                    : "✅ Real"}

                </h2>

                <p className="mt-3 text-cyan-300 text-xl">

                  Confidence

                </p>

                <div className="w-full bg-slate-700 rounded-full h-5 mt-3">

                  <div

                    className="bg-gradient-to-r from-cyan-400 to-purple-500 h-5 rounded-full"

                    style={{

                      width: `${result.confidence}%`,

                    }}

                  ></div>

                </div>

                <p className="mt-3">

                  {result.confidence} %

                </p>

                <button

                  onClick={() =>

                    exportPDF(result, text)

                  }

                  className="mt-5 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700"

                >

                  Download Report

                </button>

                <h3 className="mt-10 text-2xl font-bold">

                  Why did the AI predict this?

                </h3>

                <div className="space-y-5 mt-6">

                  {result.evidence.map((item, i) => (

                    <EvidenceCard

                      key={i}

                      text={item}

                      index={i}

                    />

                  ))}

                </div>

              </div>

            )}

          </div>

        </div>

        <Footer />

      </div>

    </div>

  );

}

export default App;