const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.PORT.ENV || 3000; // Porta do servidor

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conexão com o MongoDB (usando mongoose)
mongoose.connect('mongodb+srv://linconmatheuslm2012:jZgD5LpT4lgvT42v@cluster0.fovjadh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', () => {
  console.log('Conexão bem-sucedida com o MongoDB.');
});

// Schema e Model do Usuário
const UsuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  cep: String,
  endereco: {
    logradouro: String,
    bairro: String,
    cidade: String,
    estado: String,
  },
});
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Rotas CRUD
app.post('/usuarios', async (req, res) => {
  try {
    const novoUsuario = new Usuario(req.body);
    await novoUsuario.save();
    res.status(201).send(novoUsuario);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.send(usuarios);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).send();
    }
    res.send(usuario);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.patch('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuario) {
      return res.status(404).send();
    }
    res.send(usuario);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).send();
    }
    res.send(usuario);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
