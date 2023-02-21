import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pg from "pg";
import userRouter from "./routes/UserRoutes.js";
import postRouter from "./routes/PostRoutes.js";
const { Pool } = pg;

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

pool.connect().then(() => app.listen(process.env.PORT || 8000))
.then(() =>
    console.log("CONNECTED TO PORT 8000")
)
.catch((err) => console.log(err));

export default pool
