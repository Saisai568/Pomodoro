const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');

// Serve static files
app.use(express.static(__dirname));

// Store rooms: { roomId: { host: socketId, users: [{id, name, status}] } }
const rooms = {};

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('createRoom', (username) => {
        const roomId = generateRoomId();
        rooms[roomId] = {
            host: socket.id,
            users: [{ id: socket.id, name: username, status: 'READY' }],
            timer: {
                timeLeft: 25 * 60,
                isWorkTime: true,
                isRunning: false,
                interval: null,
                totalFocusTime: 0
            }
        };
        socket.join(roomId);
        socket.emit('roomCreated', { roomId, users: rooms[roomId].users, isHost: true });
        console.log(`Room ${roomId} created by ${username}`);
    });

    socket.on('joinRoom', ({ roomId, username }) => {
        if (rooms[roomId]) {
            rooms[roomId].users.push({ id: socket.id, name: username, status: 'READY' });
            socket.join(roomId);
            
            // Tell the joiner they succeeded
            socket.emit('roomJoined', { 
                roomId, 
                users: rooms[roomId].users, 
                isHost: false,
                timerState: {
                    timeLeft: rooms[roomId].timer.timeLeft,
                    isWorkTime: rooms[roomId].timer.isWorkTime,
                    isRunning: rooms[roomId].timer.isRunning,
                    totalFocusTime: rooms[roomId].timer.totalFocusTime || 0
                }
            });
            
            // Tell everyone else a new user joined
            io.to(roomId).emit('userJoined', { users: rooms[roomId].users });
            console.log(`${username} joined room ${roomId}`);
        } else {
            socket.emit('error', 'Room not found');
        }
    });

    socket.on('hostAction', ({ roomId, action }) => {
        const room = rooms[roomId];
        if (!room || room.host !== socket.id) return;

        const broadcastUpdate = () => {
            io.to(roomId).emit('timerUpdate', {
                timeLeft: room.timer.timeLeft,
                isWorkTime: room.timer.isWorkTime,
                isRunning: room.timer.isRunning,
                totalFocusTime: room.timer.totalFocusTime || 0,
                userCount: room.users.length
            });
        };

        const startRoomTimer = () => {
            if (room.timer.interval) clearInterval(room.timer.interval);
            room.timer.isRunning = true;
            room.timer.interval = setInterval(() => {
                room.timer.timeLeft--;
                
                if (room.timer.isWorkTime) {
                    room.timer.totalFocusTime = (room.timer.totalFocusTime || 0) + 1;
                }

                if (room.timer.timeLeft <= 0) {
                    clearInterval(room.timer.interval);
                    room.timer.interval = null;
                    room.timer.isRunning = false;
                    io.to(roomId).emit('timerEnded', { mode: room.timer.isWorkTime ? 'FOCUS' : 'BREAK' });
                    // Optional: Auto-switch logic could go here, but usually we wait for user input or just stop.
                    // For now, let's just stop at 0.
                } else {
                    // Optimization: Don't emit every second if we want to save bandwidth, 
                    // but for this app, every second ensures sync.
                    broadcastUpdate();
                }
            }, 1000);
            broadcastUpdate();
        };

        switch (action) {
            case 'start':
                if (!room.timer.isRunning) {
                    startRoomTimer();
                }
                break;
            case 'pause':
                if (room.timer.isRunning) {
                    clearInterval(room.timer.interval);
                    room.timer.interval = null;
                    room.timer.isRunning = false;
                    broadcastUpdate();
                }
                break;
            case 'reset':
                if (room.timer.interval) clearInterval(room.timer.interval);
                room.timer.interval = null;
                room.timer.isRunning = false;
                room.timer.isWorkTime = true;
                room.timer.timeLeft = 25 * 60;
                broadcastUpdate();
                break;
            case 'next':
                if (room.timer.interval) clearInterval(room.timer.interval);
                room.timer.isWorkTime = !room.timer.isWorkTime;
                room.timer.timeLeft = room.timer.isWorkTime ? 25 * 60 : 5 * 60;
                startRoomTimer(); // Auto start next session
                break;
        }
    });

    socket.on('updateStatus', ({ roomId, status }) => {
        if (rooms[roomId]) {
            const user = rooms[roomId].users.find(u => u.id === socket.id);
            if (user) {
                user.status = status;
                io.to(roomId).emit('statusUpdated', { users: rooms[roomId].users });
            }
        }
    });

    socket.on('refreshUsers', (roomId) => {
        if (rooms[roomId]) {
            socket.emit('usersRefreshed', { users: rooms[roomId].users });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Find which room the user was in
        for (const roomId in rooms) {
            const room = rooms[roomId];
            
            // Check if host
            if (room.host === socket.id) {
                // Host left, destroy room
                if (room.timer.interval) clearInterval(room.timer.interval);
                io.to(roomId).emit('roomClosed');
                delete rooms[roomId];
                console.log(`Room ${roomId} closed because host left`);
                break;
            }

            // Check if normal user
            const userIndex = room.users.findIndex(u => u.id === socket.id);
            if (userIndex !== -1) {
                room.users.splice(userIndex, 1);
                io.to(roomId).emit('userLeft', { users: room.users });
                console.log(`User left room ${roomId}`);
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
