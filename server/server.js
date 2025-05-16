import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import connectCloudinary from "./configs/cloudinary.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

const app = express();

// 🔐 Stripe Webhooks must come BEFORE express.json()
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// 🌐 CORS Setup - Allow frontend from Vite (port 5174)
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));

// 🧠 JSON body parser (after Stripe raw parser)
app.use(express.json());

// 🔐 Clerk middleware (for protected routes)
app.use(clerkMiddleware());

// 📡 Clerk Webhooks
app.use("/api/clerk", clerkWebhooks);

// ✅ Routes
app.get("/", (req, res) => res.send("API is working"));
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

// 🚀 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
