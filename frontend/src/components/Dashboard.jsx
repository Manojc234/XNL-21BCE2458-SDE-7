import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Replace with your backend WebSocket URL

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on("metrics", (data) => {
      setMetrics((prev) => [...prev, data]);
    });

    socket.on("logs", (log) => {
      setLogs((prev) => [...prev, log]);
    });

    return () => {
      socket.off("metrics");
      socket.off("logs");
    };
  }, []);

  return (
    <div className="container">
      {/* Metrics Dashboard */}
      <div className="card">
        <h2>Real-Time Performance Metrics</h2>
        {metrics.length > 0 ? (
          <ul>
            {metrics.map((m, index) => (
              <li key={index}>Latency: {m.latency} ms</li>
            ))}
          </ul>
        ) : (
          <p>No data available</p>
        )}
      </div>

      {/* Log Viewer */}
      <div className="card">
        <h2>Logs</h2>
        <div className="log-container">
          {logs.length > 0 ? (
            logs.slice(-10).map((log, idx) => (
              <p key={idx}>
                {log.timestamp} - {log.message}
              </p>
            ))
          ) : (
            <p>No logs available</p>
          )}
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="card">
        <h2>Alerts</h2>
        <ul className="alert">
          {metrics.length > 0 && metrics[metrics.length - 1].latency > 300 ? (
            <li>High Latency Detected: {metrics[metrics.length - 1].latency}ms</li>
          ) : (
            <li>No critical alerts</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
