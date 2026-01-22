import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { db } from './lib/db';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: "Server rodando!" });
});

db.init()
  .then(() => {
    console.log("Banco conectado!");
    startServer();
  })
  .catch((err) => {
    console.error("Erro:", err);
  });

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
  });
}