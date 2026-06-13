require("dotenv").config();
const express = require("express");
const cors = require("cors");

const usuarioRoutes = require("./routes/usuarioRoutes");
const albumRoutes = require("./routes/albumRoutes");
const artistaRoutes = require("./routes/artistaRoutes");
const cancionRoutes = require("./routes/cancionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const listaRoutes = require("./routes/listaRoutes");
const searchRoutes = require("./routes/searchRoutes");
const chartRoutes = require("./routes/chartRoutes");

const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/albums", albumRoutes);
app.use("/artistas", artistaRoutes);
app.use("/canciones", cancionRoutes);
app.use("/reviews", reviewRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/listas", listaRoutes);
app.use("/search", searchRoutes);
app.use("/chart", chartRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    error: 'Recurso no encontrado',
    message: `La ruta ${req.method} ${req.originalUrl} no está implementada en este servidor.`
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
