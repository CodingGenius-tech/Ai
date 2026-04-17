

import express, { urlencoded } from "express"
import {chatAi,generateImage} from "./controller/user.controller.js"
import cors from "cors"
import dotenv from "dotenv"

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: '*'
}))
dotenv.config({
    path: "../.env"
})

app.post("/chat", chatAi)

app.post('/generate-image',generateImage)

app.listen(5000,()=>{
    console.log("server is running on port 5000")
})


