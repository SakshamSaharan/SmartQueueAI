require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const tokenRoutes = require("./routes/token");
const queueRoutes = require("./routes/queue");
const aiRoutes = require("./routes/ai");
const faceRoutes = require("./routes/face");
const adminRoutes = require("./routes/admin");
const { createModel } = require("./ai/waitTimeModel");

const app = express();
const server = http.createServer(app);

// ──────────────────────────────────────────────
// Socket.io  (realtime)
// ──────────────────────────────────────────────
const { Server } = require("socket.io");

const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Make io available to all route handlers via req.app.get("io")
app.set("io", io);

io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});

// ──────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));       // allow large face descriptors / qr payloads
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (face images etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/face", faceRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        status: "SmartQueue Backend running ✅",
        version: "2.0.0",
        endpoints: [
            "POST /api/auth/register",
            "POST /api/auth/login",
            "POST /api/token/generate",
            "GET  /api/token/all",
            "GET  /api/queue/live",
            "POST /api/queue/update/:id",
            "GET  /api/ai/wait-time",
            "POST /api/face/register-face",
            "POST /api/face/verify-face",
            "GET  /api/admin/dashboard",
            "GET  /api/admin/live-queue",
            "POST /api/admin/call-next",
            "POST /api/admin/complete/:id",
            "DELETE /api/admin/clear"
        ]
    });
});

// ──────────────────────────────────────────────
// Init
// ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

(async () => {
    await connectDB();
    await createModel();        // train TF.js model before accepting requests

    server.listen(PORT, () => {
        console.log(`\n🚀 SmartQueue backend running on http://localhost:${PORT}`);
        console.log(`📡 Socket.io ready for realtime updates`);
    });
})();
