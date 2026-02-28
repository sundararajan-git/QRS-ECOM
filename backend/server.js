import "dotenv/config"
import connectDB from "./config/db.js"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import { errorHandler, notFound } from "./middlewares/error.middleware.js"
import apiRoutes from "./routes/index.js"
connectDB()

const app = express()
const PORT = process.env.PORT || 8080
const whitelist = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
].filter(Boolean)

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin) || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(helmet())
app.use("/api", apiRoutes)

app.get("/", (req, res) => {
    res.send("Hello world");
});


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log("server running on " + PORT)
})
