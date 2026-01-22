console.log("Iniciando servidor...");

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ message: "Backend funcionando perfeitamente! 🚀" });
});

app.post('/generate-pdf', (req, res) => {
    res.json({ message: "Aqui será gerado o PDF" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});