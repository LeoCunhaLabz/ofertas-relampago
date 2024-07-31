import express from 'express';
import authRouter from './routes/auth.js';
import postRouter from './routes/post.js';
import uploadRouter from './routes/upload.js';
import categoryRouter from './routes/category.js';
import checkoutRouter from './routes/checkout.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { checkAndUpdateOffers } from './scheduleTasks.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: [
    "https://167.88.39.189:3000", 
    "https://localhost:3000", 
    "https://ofertarelampago.app.br", 
    "https://www.ofertarelampago.app.br",
    "https://api.ofertarelampago.app.br"
  ],
  credentials:true,
  methods:["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders:["Content-Type","Authorization","Access-Control-Allow-Credentials"],
  preflightContinue: true,
  optionsSuccessStatus: 204
};

// Agendar a tarefa para rodar a cada minuto (ajuste conforme necessário)
checkAndUpdateOffers();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.options('*', cors(corsOptions));

// Middleware para adicionar cabeçalhos CORS em todas as respostas
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use("/api/auth/", authRouter);
app.use("/api/post/", postRouter);
app.use("/api/upload/", uploadRouter);
app.use("/api/category/", categoryRouter);
app.use("/api/checkout/", checkoutRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send(`Aplicação em Node.JS`)
})