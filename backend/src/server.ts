import dotenv from "dotenv";
dotenv.config({ override: true }); // override: true ensures .env always wins over system env vars

import app from "./app";

const PORT = process.env.PORT || 5000;
// Debug: confirm JWT_SECRET is loaded (shows first 6 chars only)
console.log(`[startup] JWT_SECRET loaded: ${process.env.JWT_SECRET ? process.env.JWT_SECRET.slice(0, 6) + "..." : "NOT SET — using fallback!"}`);
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));