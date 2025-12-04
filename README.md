# Zen Focus | Cyberpunk Pomodoro Timer

A minimal, aesthetic, and feature-rich Pomodoro timer with a Cyberpunk Zen vibe. Built with Node.js and Socket.io, it features real-time multiplayer study rooms, synchronized timers, Lofi Girl integration, and hydration reminders.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)

## ✨ Features

### 🍅 Core Timer
- **Classic Pomodoro:** Default 25-minute focus sessions and 5-minute breaks.
- **Cyberpunk Aesthetics:** Glassmorphism UI, neon glows, and subtle glitch effects.
- **Audio Feedback:** Custom generated sound effects for start, pause, and alarms (no external assets needed).
- **Dynamic Themes:** 
  - Automatically switches color schemes between "Focus" (Blue/Purple) and "Break" (Green/Teal) modes.
  - **Custom Themes:** Choose from Cyberpunk, Sunset, Ocean, or Forest styles via the palette menu.

### 🎧 Immersive Experience
- **Lofi Mode:** One-click integration with the Lofi Girl YouTube stream for a video background.
- **Minimize UI:** Hide the main controls to focus purely on the background and timer.

### 💧 Health & Wellness
- **Water Reminder:** Built-in hydration tracker. Set your interval (e.g., every 30 mins) and amount to get audio alerts.

### 🌐 Multiplayer Study Room
- **Real-time Sync:** Create or join a room with friends. The timer is synchronized server-side, so everyone sees the exact same countdown.
- **Host Controls:** The room creator (Host) controls the timer (Start/Pause/Reset) for everyone.
- **Live Status:** See who is in the room and their current status (FOCUS / BREAK).
- **Shared Progress:** "Total Focus" time is synchronized across the room.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Animations, Glassmorphism), Vanilla JavaScript.
- **Backend:** Node.js, Express.
- **Real-time Communication:** Socket.io (WebSockets).
- **APIs:** YouTube IFrame API (for Lofi mode), Web Audio API (for sound effects).

## 🚀 Installation & Local Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Saisai568/Pomodoro.git
    cd Pomodoro
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the server**
    ```bash
    node server.js
    # or
    npm start
    ```

4.  **Access the app**
    Open your browser and visit `http://localhost:3000`.

## ☁️ Deployment

This project is ready to be deployed on platforms like **Render**, **Heroku**, or **Railway**.

**Deploying to Render:**
1.  Push your code to a GitHub repository.
2.  Create a new **Web Service** on Render.
3.  Connect your repository.
4.  Set the **Build Command** to `npm install`.
5.  Set the **Start Command** to `node server.js`.
6.  Deploy!

## 📖 Usage Guide

### Basic Timer
1.  Click **Start** to begin the 25-minute focus session.
2.  When time is up, an alarm will sound.
3.  Click **Next** to switch to a 5-minute break.

### Using the Study Room
1.  Open the **Left Sidebar** (click the 🌐 icon).
2.  **Create a Room:** Enter your username and click "Create Room". Share the 6-character code with friends.
3.  **Join a Room:** Enter your username and the Room Code, then click "Join Room".
4.  **Sync:** If the user list looks incorrect, click the small "↻ Sync" button to refresh.

### Customizing
- **Theme:** Click the 🎨 icon in the top-left to change the color scheme.
- **Water:** Open the **Right Sidebar** (click the 💧 icon) to set hydration reminders.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Saisai568/Pomodoro/issues).

## 📝 License

This project is licensed under the ISC License.
