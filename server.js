const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const port = process.env.PORT || 8080;
const DirectoryPath = path.join(__dirname, './public');
const authRouter = require('./src/routers/authRouters.js');
const adminRouter = require('./src/routers/adminRouters.js');
const driverRouter = require('./src/routers/driverRouters.js');
const connect = require("./src/db/connectDB.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const userSocketMap = {};

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static(path.join(__dirname, "./public")));
app.use("/driver", express.static(path.join(__dirname, "./driver")));
app.use("/admin", express.static(path.join(__dirname, "./admin")));

app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/driver', driverRouter);


io.on("connection", (socket) => {

    const { id, role } = socket.handshake.auth;

    if (id && role) {

        if (!userSocketMap[role]) {
            userSocketMap[role] = {};
        }

        userSocketMap[role][id] = socket.id;

        console.log(`User connected with ID: ${id}, Role: ${role}, Socket ID: ${socket.id}`);
    } else {
        console.log("Connection attempt without valid ID or Role.");
        socket.disconnect();
        return;
    }


    socket.emit("welcome", `Welcome ${role} with ID: ${id}`);


    socket.on("disconnect", () => {
        if (id && role && userSocketMap[role]) {
            delete userSocketMap[role][id];
            console.log(`User disconnected with ID: ${id}, Role: ${role}`);
        }
    });

    socket.on("sendMessage", ({ recipientId, recipientRole, message }) => {
		console.log("Send msg ",userSocketMap, recipientId, recipientRole, message)
        if (userSocketMap[recipientRole] && userSocketMap[recipientRole][recipientId]) {
            const recipientSocketId = userSocketMap[recipientRole][recipientId];
            io.to(recipientSocketId).emit("receiveMessage", { from: id, message });
            console.log(`Message sent from ${id} to ${recipientId} (${recipientRole})`);
        } else {
            console.log(`Recipient with ID ${recipientId} and Role ${recipientRole} is not connected.`);
        }
    });

    socket.on("broadcastToRole", ({ targetRole, message }) => {
        if (userSocketMap[targetRole]) {
            Object.values(userSocketMap[targetRole]).forEach((socketId) => {
                io.to(socketId).emit("broadcastMessage", { from: id, message });
            });
            console.log(`Broadcast message sent to all users with Role: ${targetRole}`);
        } else {
            console.log(`No users connected with Role: ${targetRole}`);
        }
    });
});


connect().then(() => {
    try {
        server.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    } catch (err) {
        console.log("Unable to connect to the database due to: ", err);
    }
});
