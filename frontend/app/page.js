'use client';

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './config';

export default function Home() {
  const [speaker, setSpeaker] = useState('Manager');
  const [file, setFile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // ⚡ 1. FETCH ACOUSTIC LEDGER DEFENSIVELY
  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/logs`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      
      // Safeguard: Ensure logs state is strictly an array
      if (data && Array.isArray(data.logs)) {
        setLogs(data.logs);
      } else if (Array.isArray(data)) {
        setLogs(data);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error('⚡ Error fetching acoustic logs:', err);
      setLogs([]); // Fallback to empty array to prevent render crashes
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // ⚡ 2. TRANSMIT & TRANSDUCE WAVE
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please attach an audio frequency file (.mp3, .wav, .m4a) first!');
      return;
    }

    setUploading(true);
    setStatusMessage('Transducing acoustic wave into cloud ledger...');

    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('speaker', speaker);

      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMessage('⚡ Wave transduced successfully!');
        setFile(null);
        // Reset file input element
        const fileInput = document.getElementById('audio-file-input');
        if (fileInput) fileInput.value = '';
        fetchLogs(); // Refresh cloud ledger table
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('⚡ Transduction error:', err);
      setStatusMessage(`❌ Transduction link error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* HEADER SECTION */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center pb-8 border-b border-cyan-500/30">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wider text-cyan-400 flex items-center gap-2">
            ⚡ PROJECT RESONANCE-O
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Acoustic-Quantum Transducer & Truth-State Verification Dashboard
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-slate-900 border border-cyan-500/40 rounded-lg">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
            MONGODB ATLAS LIVE
          </span>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INPUT CARD: INGEST ACOUSTIC WAVE */}
        <section className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-6 shadow-xl shadow-cyan-950/20 backdrop-blur-md">
          <h2 className="text-xl font-bold text-cyan-300 mb-6 flex items-center gap-2">
            📡 Ingest Acoustic Wave
          </h2>

          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Subject Speaker
              </label>
              <select
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400 transition"
              >
                <option value="Manager">Manager</option>
                <option value="Nilesh">Nilesh</option>
                <option value="Sakshi">Sakshi</option>
                <option value="Xavier">Xavier</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Audio Frequency File (.mp3, .wav, .m4a)
              </label>
              <input
                id="audio-file-input"
                type="file"
                accept="audio/*"
                onChange={(e) => setFile(e.target.files[0] || null)}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900 transition cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 disabled:bg-slate-800 text-slate-950 font-bold tracking-wider uppercase rounded-lg transition duration-200 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Transducing...
                </>
              ) : (
                'Transmit & Transduce Wave'
              )}
            </button>
          </form>

          {statusMessage && (
            <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-cyan-300 text-center font-mono">
              {statusMessage}
            </div>
          )}
        </section>

        {/* TABLE CARD: ACOUSTIC LEDGER */}
        <section className="lg:col-span-2 bg-slate-900/80 border border-cyan-500/30 rounded-xl p-6 shadow-xl shadow-cyan-950/20 backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
              📊 Acoustic Ledger (MongoDB Cloud Stream)
            </h2>
            <button
              onClick={fetchLogs}
              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-md border border-cyan-500/20 transition"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs font-semibold text-cyan-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Speaker</th>
                  <th className="py-3 px-4">Decibels</th>
                  <th className="py-3 px-4">Truth State</th>
                  <th className="py-3 px-4">Pretense Alert</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {(!Array.isArray(logs) || logs.length === 0) ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-xs uppercase tracking-widest">
                      No acoustic wave telemetry recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log, idx) => (
                    <tr key={log.id || idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">{log.speaker}</td>
                      <td className="py-3.5 px-4 text-cyan-300">{log.decibels} dB</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 text-xs rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          {log.truthState || 'Verified'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 text-xs rounded border ${
                          log.pretenseAlert === 'ELEVATED PRETENSE'
                            ? 'bg-rose-950 text-rose-400 border-rose-500/30'
                            : 'bg-cyan-950 text-cyan-400 border-cyan-500/30'
                        }`}>
                          {log.pretenseAlert || 'CLEAR'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-xs">{log.timestamp}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}