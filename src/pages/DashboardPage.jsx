import '../styles/dashboard.scss'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard.jsx';
import Add from '../components/expenses/ExpenseForm.jsx';

function DashboardPage() {
    const [tema, setTema] = useState('light');
    const navigate = useNavigate();
    const [dados, setDados] = useState({});
    const [botaoAtivo, setBotaoAtivo] = useState("dashboard");
    const [gastos, setGastos] = useState();

    const mudarTema = () => {
        setTema((prevTema) => (prevTema === 'light' ? 'dark' : 'light'));
    };

    async function buscar() {
        try {
            const token = localStorage.getItem('token');

            const validarToken = await fetch('http://localhost:3000/dashboard', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (validarToken.status === 401) {
                localStorage.removeItem('token');

                return;
            }

            if (!validarToken.ok) {
                throw new Error(`Erro HTTP: ${validarToken.status}`);
            }

            const resultadoValidacao = await validarToken.json();

            setDados(resultadoValidacao.usuario);

            setGastos(resultadoValidacao.usuario.compras);

        } catch (err) {
            console.log('Erro na busca de dados', err);
        }
    }

    //function contadorCategoria() {
    //     const dadosJsonCompras = dados.compras || [];
    //     const objQuantidade = {};
    //     for (let i = 0; i < dadosJsonCompras.length; i++) {     
    //         const a = dadosJsonCompras[i].categoria;

    //         if(objQuantidade[a]){
    //             objQuantidade[a] += 1;
    //         } else {
    //             objQuantidade[a] = 1;
    //         }
    //     }

    //     return (
    //         <>
    //             <h1>Lazer: {objQuantidade.Lazer || 0}</h1>
    //             <h1>Mercado: {objQuantidade.Mercado || 0}</h1>
    //             <h1>Transporte: {objQuantidade.Transporte || 0}</h1>
    //         </>
    //     );
    // }
    
    useEffect(() => {
        buscar();
    }, []);

    return (
        <div className="dashboard-app-wrapper" data-theme={tema}>
            <div className="app-wrapper">
                <div className="container text-center py-4 border-bottom header-container">
                    <header className="d-flex justify-content-between align-items-center">
                        <div>Olá, {dados.nome}</div>
                        <div>{dados.email}</div>
                        <button onClick={mudarTema} className="btn btn-sm btn-outline-primary theme-toggle-btn">
                            {tema === 'light' ? '🌙 Escuro' : '☀️ Claro'}
                        </button>
                    </header>
                </div>
                <div className="container">
                    <div className="d-flex flex-row justify-content-between py-4 dashboard-toolbar">
                        <div className="btn-group" role="group">
                            <button type="button" className={`btn ${botaoAtivo === 'dashboard' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setBotaoAtivo('dashboard')}>Dashboard</button>
                            <button type="button" className={`btn ${botaoAtivo === 'adicionar' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setBotaoAtivo('adicionar')}>Adicionar gasto</button>
                        </div>
                        {botaoAtivo === 'dashboard' && (
                            <div className="input-group" style={{ maxWidth: "280px" }}>
                                <span className="input-group-text border-end-0 theme-input-icon">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input type="text" className="form-control border-start-0" aria-label="Buscar" />
                            </div>
                        )}
                    </div>
                </div>

                {botaoAtivo === 'dashboard' && <Dashboard arrayGastos={gastos} />}
                {botaoAtivo === 'adicionar' && <Add />}
            </div>
        </div>
    );
}

export default DashboardPage;