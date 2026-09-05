import dotenv from "dotenv";
dotenv.config({ override: true });

import app from "./app";

const PORT = process.env.PORT || 5000;

console.log(`[startup] JWT_SECRET loaded: ${process.env.JWT_SECRET ? process.env.JWT_SECRET.slice(0, 6) + "..." : "NOT SET — using fallback!"}`);
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));