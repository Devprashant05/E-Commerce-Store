import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import healthRoute from "./routes/healthcheck.route.js";
import productRoute from './routes/product.route.js'

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(
    express.urlencoded({
        limit: "16kb",
        extended: true,
    })
);
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

app.use("/api/health", healthRoute);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoute);

export default app;
