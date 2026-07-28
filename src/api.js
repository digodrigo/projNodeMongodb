import http from 'node:http';
import { MongoClient } from 'mongodb';

const port = 3000;
const client = new MongoClient('mongodb://digo_db_user:Mk062K66sekvRsSv@ac-buuure0-shard-00-00.3h2ymoo.mongodb.net:27017,ac-buuure0-shard-00-01.3h2ymoo.mongodb.net:27017,ac-buuure0-shard-00-02.3h2ymoo.mongodb.net:27017/?ssl=true&replicaSet=atlas-10c9p5-shard-0&authSource=admin&appName=Cluster0');

async function iniciarServidor() {
    try{
        await client.connect();
        const db = client.db('projs');
        const colecao = db.collection('projFinanceiro');
        console.log('📦 Conectado ao MongoDB com sucesso!');
        
        const server = http.createServer(async (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');//Precisa do OPTIONS para permitir o preflight request
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'GET') {
                try {
                    const dados = await colecao.find().toArray();
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(dados));
                } catch (erro) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ erro: 'Erro ao buscar dados no banco' }));
                }
            }
        });

        server.listen(port, () => {
            console.log(`🚀 Servidor rodando na porta ${port}`);
        });

    }catch (erro) {
        console.error('❌ Erro ao conectar ao MongoDB:', erro);
        process.exit(1);
    }
}

iniciarServidor()
