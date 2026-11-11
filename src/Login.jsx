import { useState } from 'react'
import "./Login.scss"
import {Link, useNavigate} from 'react-router-dom';

function Login (){

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    async function Logar(e) {
        e.preventDefault()
        try {
            const tryLogin = await fetch('http://localhost:3000/Login', {
                method:"POST",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({email: login, senha})
            });
            const result = await tryLogin.json();           
            if(tryLogin.ok) {
                localStorage.setItem('token', result.token);
                alert(result.mensagem);
                navigate('/dashboard');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const provedores = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];

    const obterSugestao = () => {
        if (!login || !login.includes('@')) return "";

        const [user, dominio] = login.split('@');

        // Se o usuário ainda não começou a digitar o domínio (ex: "nome@"), sugere o primeiro da lista
        if (!dominio) {
            return `${user}@${provedores[0]}`;
        }

        // Procura um provedor que comece com o que o usuário já digitou após o @
        const provedorEncontrado = provedores.find(prov => 
            prov.toLowerCase().startsWith(dominio.toLowerCase())
        );

        if (provedorEncontrado) {
            return `${user}@${provedorEncontrado}`;
        }

        return "";
    };

    const sugestao = obterSugestao();

    const tratarKeyDown = (e) => {
        if(e.key === 'Tab' && !e.shiftKey && sugestao && sugestao !== login) {
            e.preventDefault();
            setLogin(sugestao);
        }
    }

    return (
        <>
            <div className="form-wrapper">
                <form onSubmit={Logar}>
                    <p className="tituloLogin">Login</p>
                    <div className="divInput">
                        <input 
                            type="text" 
                            name="emailDisabled" 
                            id="emailDisabled" 
                            value={sugestao} 
                            readOnly
                            tabIndex={-1}
                            aria-hidden="true"
                        />
                        <input 
                            type="text" 
                            name="email" 
                            id="emailDefault" 
                            placeholder="E-mail" 
                            value={login} 
                            onChange={(e) => setLogin(e.target.value)} 
                            onKeyDown={tratarKeyDown} 
                            required
                        />                          
                    </div>
                    <div className="divInput">
                        <input type="password" name="senha" id="senha" placeholder="Senha" onChange={(e)=> setSenha(e.target.value)} required/>
                    </div>
                    <button type="submit">Logar</button>
                    <p>Não tem uma conta? <Link to="/cadastrar">crie sua conta aqui</Link></p>
                </form>            
            </div>
        </>
    ) 
}

export default Login
