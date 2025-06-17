import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

type Log = {
  id: number;
  timestamp: string;
  level: "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  service: string;
  message: string;
};

const ALL_LEVELS: Log["level"][] = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"];

function levelStyles(level: Log["level"]) {
  switch (level) {
    case "DEBUG": return "bg-gray-50 border-gray-200 text-gray-700";
    case "INFO": return "bg-blue-50 border-blue-200 text-blue-800";
    case "WARNING": return "bg-yellow-50 border-yellow-200 text-yellow-800";
    case "ERROR": return "bg-red-50 border-red-200 text-red-800";
    case "CRITICAL": return "bg-purple-50 border-purple-200 text-purple-800";
    default: return "bg-white border-gray-100";
  }
}

function levelBadge(level: Log["level"]) {
  switch (level) {
    case "DEBUG": return "text-gray-600";
    case "INFO": return "text-blue-600";
    case "WARNING": return "text-yellow-700";
    case "ERROR": return "text-red-600";
    case "CRITICAL": return "text-purple-700";
    default: return "";
  }
}

function serviceBadge(service: string) {
  switch (service) {
    case "frontend": return "bg-green-100 text-green-800";
    case "collection.views": return "bg-indigo-100 text-indigo-800";
    default: return "bg-gray-100 text-gray-700";
  }
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<Log["level"] | "ALL">("ALL");

  useEffect(() => {
    let isMounted = true;
    const fetchLogs = async () => {
      const res = await fetch("http://localhost:8000/api/logs/?ordering=-timestamp&limit=100");
      if (!isMounted) return;
      if (res.ok) {
        setLogs(await res.json());
      }
      setLoading(false);
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    return () => {
      fetch("http://localhost:8000/api/logs/", {
        method: "DELETE",
      }).catch((err) => {
        console.error("Failed to clear logs on unmount", err);
      });
    };
  }, []);

  const filteredLogs = selectedLevel === "ALL"
    ? logs
    : logs.filter(log => log.level === selectedLevel);

  if (loading) return <p className="p-4">Loading logs…</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <button
        onClick={() => window.history.back()}
        className="flex items-center space-x-2 text-gray-600"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Logs</h1>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value as any)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="ALL">All Levels</option>
          {ALL_LEVELS.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <ul className="space-y-3">
        {filteredLogs.map((log) => (
          <li
            key={log.id}
            className={`p-4 rounded-md border shadow-sm flex flex-col ${levelStyles(log.level)}`}
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded font-medium text-xs ${serviceBadge(log.service)}`}>
                  {log.service}
                </span>
                <span className="text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <span className={`text-xs font-semibold ${levelBadge(log.level)}`}>
                {log.level}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">
              {log.message}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
