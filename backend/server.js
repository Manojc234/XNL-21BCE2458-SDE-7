const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const logger = require('./logger');
const tracer = require('./tracing');
const metrics = require('./metrics');

const app = express();
app.use(express.json());

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// WebSocket Connection
io.on('connection', (socket) => {
    console.log("Client connected via WebSocket");

    // Example: Send test data every 5 seconds
    setInterval(() => {
        const metricsData = { latency: Math.random() * 500, requests: Math.floor(Math.random() * 100) };
        const logData = { timestamp: new Date().toISOString(), message: "New RPC log generated" };

        socket.emit("metrics", metricsData);
        socket.emit("logs", logData);
    }, 5000);

    socket.on('disconnect', () => console.log("Client disconnected"));
});

// Endpoint with logging, tracing, and metrics
app.post('/rpc-endpoint', (req, res) => {
    const span = tracer.startSpan('rpc-call');
    span.log({ event: 'RPC Request', payload: req.body });

    logger.info(`RPC Request: ${JSON.stringify(req.body)}`);

    // Simulate processing
    const response = { result: "success" };
    
    logger.info(`RPC Response: ${JSON.stringify(response)}`);
    span.log({ event: 'RPC Response', payload: response });
    span.finish();

    // Emit log to WebSocket clients
    io.emit("logs", { timestamp: new Date().toISOString(), message: "RPC call processed" });

    res.send(response);
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', metrics.register.contentType);
    res.end(await metrics.register.metrics());
});

// Start server
server.listen(3000, () => console.log('Server running on port 3000'));
