import {useState} from 'react';
import "./Login.scss"
import {Link, useNavigate} from 'react-router-dom';

function Cadastrar (){
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');

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

    async function Cadastrar(e) {
        e.preventDefault()
        try {
            const tryCadastrar = await fetch('http://localhost:3000/cadastrar', {
                method:"POST",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({email: login, nome: nome, senha: senha})
            });
            const result = await tryCadastrar.json();
            if(tryCadastrar.ok) {
                alert(result.mensagem);
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="form-wrapper">
                <form onSubmit={Cadastrar}>
                    <p className="tituloLogin">Cadastrar</p>
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
                        <input type="text" name="nome" id="nome" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </div>
                    <div className="divInput">
                        <input type="password" name="senha" id="senha" placeholder="Senha" onChange={(e)=> setSenha(e.target.value)} required/>
                    </div>
                    <button type="submit">Cadastrar</button>
                    <p>Já tem uma conta? <Link to="/">Faça login aqui</Link></p>
                </form>            
            </div>
        </>
    )
}

export default Cadastrar
