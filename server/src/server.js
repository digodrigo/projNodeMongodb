import './config/env.js';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import verificarToken from './middleware/verificarToken.js';


const app = express();
const port = 3000;


const client = new MongoClient(process.env.MONGO_URI, {serverSelectionTimeoutMS: 5000, connectTimeoutMS: 10000, socketTimeoutMS: 45000, maxPoolSize: 10, wtimeoutMS: 2500, retryWrites: true});

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`🚀 Servidor rodando com Express na porta ${port}`);
});

app.post('/Login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        await client.connect();
        const db = client.db('projs');
        const colecao = db.collection('projFinanceiro');

        const usuario = await colecao.findOne({ email: email });
        if (!usuario) {
            return res.status(401).json({ mensagem: "E-mail ou senha inválidos!" });
        }

        const [saltDoBanco, hashDoBanco] = usuario.senha.split(':');

        const hashTeste = crypto.scryptSync(senha, saltDoBanco, 64).toString('hex');

        if (hashTeste !== hashDoBanco) {
            return res.status(401).json({ mensagem: "E-mail ou senha inválidos!" });
        }

        const token = jwt.sign({
            id: usuario._id,
            email: usuario.email
        }, process.env.JWT_SECRET, { expiresIn: '5000s' });

        res.status(200).json({
            token: token,
            mensagem: "Login realizado com sucesso!"
        });
    } catch (erro) {
        console.error('Erro na consulta:', erro);
        res.status(500).json({ erro: 'Erro ao buscar dados no banco' });
    }
});

app.post('/cadastrar', async (req, res) => {
    try {
        const { email, nome, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
        }

        await client.connect();
        const db = client.db('projs');
        const colecao = db.collection('projFinanceiro');

        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.scryptSync(senha, salt, 64).toString('hex');
        const senhaSegura = `${salt}:${hash}`;

        const dados = await colecao.insertOne({
            email,
            nome,
            senha: senhaSegura,
            dataCadastro: new Date()
        });

        res.status(201).json({ mensagem: 'Cadastro realizado com sucesso' });

    } catch (erro) {
        console.error('Erro na consulta:', erro);
        res.status(500).json({ erro: 'Erro ao buscar dados no banco' });
    }
});

app.get('/dashboard', verificarToken, async (req, res) => {
    try {
        await client.connect();
        const db = client.db('projs');
        const colecao = db.collection('projFinanceiro');

        const usuario = await colecao.findOne({ _id: new ObjectId(req.usuario.id) });
        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado!" });
        }

        res.status(200).json({ usuario });
    } catch (err) {
        console.error('Erro ao consultar o dashboard:', err);

        return res.status(500).json({
            codigo: 'ERRO_INTERNO',
            mensagem: 'Erro ao buscar os dados do usuário.'
        });
    }
});

app.post('/Adicionar', verificarToken, async (req, res) => {
    try {

        const { categoria, compra, valor, data } = req.body;

        await client.connect();

        const db = client.db('projs');
        const colecao = db.collection('projFinanceiro');

        const novoGasto = {
            _id: new ObjectId(),
            categoria,
            compra,
            valor: Number(valor),
            data
        };

        const resultado = await colecao.updateOne(
            { _id: new ObjectId(req.usuario.id) },
            { $push: { compras: novoGasto } }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                codigo: 'USUARIO_NAO_ENCONTRADO',
                mensagem: 'Usuário não encontrado!'
            });
        }

        res.status(201).json({ mensagem: 'Gasto adicionado com sucesso' });

    } catch (erro) {
        console.error('Erro na consulta:', erro);
        return res.status(500).json({
            codigo: 'ERRO_INTERNO',
            mensagem: 'Erro interno ao adicionar gasto.'
        });
    }
});

app.put('/Editar/:id', verificarToken, async (req, res) => {
    try {
        const { categoria, compra, valor, data } = req.body;

        await client.connect();
        const db = client.db('projs');
        const colecao = db.collection('projFinanceiro');

        const gastoId = new ObjectId(req.params.id);

        const resultado = await colecao.updateOne(
            { 
                _id: new ObjectId(req.usuario.id), 
                "compras._id": gastoId },
            { 
                $set: { 
                    "compras.$.categoria": categoria, 
                    "compras.$.compra": compra, 
                    "compras.$.valor": Number(valor), 
                    "compras.$.data": data 
                } }
        );

        res.status(201).json({ mensagem: 'Gasto editado com sucesso' });
    } catch (erro) {
        console.error('Erro ao editar gasto:', erro);

        return res.status(500).json({
            codigo: 'ERRO_INTERNO',
            mensagem: 'Erro interno ao editar gasto.'
        });
    }
});
