import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            codigo: 'TOKEN_NAO_FORNECIDO',
            mensagem: 'Token não fornecido!'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = decoded;

        next();

    } catch (erro) {
        if (erro.name === 'TokenExpiredError') {
            return res.status(401).json({
                codigo: 'TOKEN_EXPIRADO',
                mensagem: 'Sua sessão expirou!'
            });
        }

        if (erro.name === 'JsonWebTokenError') {
            return res.status(401).json({
                codigo: 'TOKEN_INVALIDO',
                mensagem: 'Token inválido!'
            });
        }

        return res.status(500).json({
            codigo: 'ERRO_AUTENTICACAO',
            mensagem: 'Erro ao verificar autenticação.'
        });
    }
}

export default verificarToken;