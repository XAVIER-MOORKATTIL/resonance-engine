'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Activity, ShieldCheck, AlertTriangle, Upload, RefreshCw, Radio } from 'lucide-react';
import { API_BASE_URL } from './config';

export default function ResonanceDashboard() {
  const [file, setFile] = useState(null);
  const [speaker, setSpeaker] = useState('Manager');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [latestTelemetry, setLatestTelemetry] = useState(null);

  // Fetch logged wave telemetry from MongoDB Atlas
  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/logs`);
      const json = await res.json();
      if (json.success) {
        setLogs(json.data);
      }
    } catch (err) {
      console.error("❌ Transduction Link Error:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Auto-refresh telemetry every 5s
    return () => clearInterval(interval);
  }, []);

  // Handle file ingestion
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("⚡ Please select an audio wave file first!");

    setLoading(true);
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('speaker', speaker);

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        setLatestTelemetry(json.telemetry);
        setFile(null);
        fetchLogs();
      } else {
        alert(json.message || "Transduction rejected!");
      }
    } catch (err) {
      alert("❌ Electrical discharge error during upload!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-400 font-mono p-6">
      {/* Header Banner */}
      <header className="border-b border-cyan-800 pb-4 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-cyan-300 flex items-center gap-3">
            <Zap className="text-yellow-400 animate-pulse" size={32} />
            PROJECT RESONANCE-O
          </h1>
          <p className="text-sm text-cyan-600 mt-1">
            Acoustic-Quantum Transducer & Truth-State Verification Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-cyan-700 px-4 py-2 rounded-lg">
          <Radio className="text-emerald-400 animate-ping" size={18} />
          <span className="text-xs text-emerald-400 font-bold">MONGODB ATLAS LIVE</span>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Wave Ingestion Module */}
        <div className="bg-slate-900/80 border border-cyan-800 p-6 rounded-xl shadow-lg shadow-cyan-950">
          <h2 className="text-xl font-bold text-cyan-200 mb-4 flex items-center gap-2">
            <Upload className="text-cyan-400" size={20} />
            Ingest Acoustic Wave
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs text-cyan-500 uppercase mb-2">Subject Speaker</label>
              <select
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-700 rounded-lg p-3 text-cyan-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="Manager">Manager</option>
                <option value="Sakshi">Sakshi</option>
                <option value="Nilesh">Nilesh</option>
                <option value="Xavier">Xavier</option>
                <option value="Vinayak">Vinayak</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-cyan-500 uppercase mb-2">Audio Frequency File (.mp3, .wav, .m4a)</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full bg-slate-950 border border-cyan-700 rounded-lg p-2 text-xs text-cyan-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-cyan-900 file:text-cyan-200 hover:file:bg-cyan-800 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-700/50"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
              {loading ? "Transducing Signal..." : "Transmit & Transduce Wave"}
            </button>
          </form>

          {/* Telemetry Gauge Display */}
          {latestTelemetry && (
            <div className="mt-6 bg-slate-950 border border-cyan-600 p-4 rounded-lg">
              <h3 className="text-xs font-bold text-yellow-400 mb-2 flex items-center gap-1">
                <Activity size={16} /> LATEST SIGNAL TELEMETRY
              </h3>
              <div className="text-xs space-y-1 text-slate-300">
                <p><span className="text-cyan-500">Peak Resonance:</span> {latestTelemetry.peakDecibel}</p>
                <p><span className="text-cyan-500">Transduced Power:</span> <span className="text-yellow-400 font-bold">{latestTelemetry.transducedVoltage}</span></p>
                <p><span className="text-cyan-500">Truth State:</span> <span className="text-emerald-400">{latestTelemetry.verificationStatus}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: MongoDB Live Telemetry Ledger */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-cyan-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-cyan-200 flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={22} />
              Acoustic Ledger (MongoDB Cloud Stream)
            </h2>
            <button
              onClick={fetchLogs}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3 py-1.5 rounded border border-cyan-700 flex items-center gap-1"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cyan-800 text-cyan-500 uppercase bg-slate-950/60">
                  <th className="p-3">Speaker</th>
                  <th className="p-3">Decibels</th>
                  <th className="p-3">Truth State</th>
                  <th className="p-3">Pretense Alert</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-slate-500">
                      No acoustic streams recorded in cloud memory yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-800/50 transition">
                      <td className="p-3 font-bold text-cyan-300">{log.speaker}</td>
                      <td className="p-3 text-yellow-400 font-bold">{log.peakDecibel} dB</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                          log.verificationStatus === 'Verifiable Reality'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                            : 'bg-yellow-950 text-yellow-400 border border-yellow-700'
                        }`}>
                          {log.verificationStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        {log.timepassDetected ? (
                          <span className="text-red-400 font-bold flex items-center gap-1">
                            <AlertTriangle size={14} /> ALERT ("TIME-PASS")
                          </span>
                        ) : (
                          <span className="text-slate-500">CLEAR</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}