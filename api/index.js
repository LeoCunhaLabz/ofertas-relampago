import express from 'express';
import authRouter from './routes/auth.js';
import postRouter from './routes/post.js';
import uploadRouter from './routes/upload.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { checkAndUpdateOffers } from './scheduleTasks.js';

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin:"http://localhost:3000",
  credentials:true,
  methods:["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders:["Content-Type","Authorization","Access-Control-Allow-Credentials"]
};

// Agendar a tarefa para rodar a cada minuto (ajuste conforme necessário)
checkAndUpdateOffers();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/auth/", authRouter);
app.use("/api/post/", postRouter);
app.use("/api/upload/", uploadRouter);

app.listen(PORT, () => {
  console.log("Server is running on port 8000");
});