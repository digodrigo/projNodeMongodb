import '../../styles/dashboard.scss'
import { useState, useEffect } from 'react'
import Add from '../expenses/ExpenseForm.jsx';
import Grafico from './Grafico.jsx';
import TabelaDashboard from './TabelaDashboard.jsx';
import { calcularIndicadores } from './indicadores.js';
import {jwtDecode} from 'jwt-decode';
import {useNavigate} from 'react-router-dom';

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const percentual = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

function Dashboard({ arrayGastos = [] }) {
    const [mesSelecionado, setMesSelecionado] = useState(() => new Date().getMonth() + 1);
    const [anoSelecionado, setAnoSelecionado] = useState(() => new Date().getFullYear());
    const indicadores = calcularIndicadores(arrayGastos, anoSelecionado, mesSelecionado);
    const anosDisponiveis = [...new Set([
        new Date().getFullYear(),
        ...arrayGastos.map((gasto) => Number(gasto.data.split('-')[0]))
    ])].sort((a, b) => b - a);
    const [gastoEditando, setGastoEditando] = useState(null);
    const navigate = useNavigate();

    function handleEdit(gasto) {
        console.log('Editar gasto:', gasto);
        setGastoEditando(gasto);
    }

    function handleFiltro(coluna) {
        setFiltro((anterior) => ({
            coluna,
            crescente: anterior.coluna === coluna ? !anterior.crescente : true
        }));
        setPaginaAtual(1);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);

            const tempoRestante = decodedToken.exp * 1000 - Date.now();

            if (tempoRestante <= 0) {
                localStorage.removeItem('token');
                navigate('/');
                return;
            }

            const temporizador = setTimeout(() => {
                localStorage.removeItem('token');
                navigate('/');
            }, tempoRestante);

            return () => clearTimeout(temporizador);

        } catch (erro) {
            localStorage.removeItem('token');
            navigate('/');
        }
    }, [navigate]);

    return (
        <>
            {gastoEditando ? (
                <Add gastoEditando={gastoEditando} />
            ) : (
                <>
                    <div className="container">
                        <div className="indicadores-grid">
                            <section className="border p-3 theme-card indicador-card" aria-labelledby="titulo-total">
                                <h1 id="titulo-total">Gastos do mês</h1>
                                <div className="indicadores-periodo">
                                    <label>
                                        Mês
                                        <select value={mesSelecionado} onChange={(e) => setMesSelecionado(Number(e.target.value))}>
                                            {meses.map((mes, index) => <option key={mes} value={index + 1}>{mes}</option>)}
                                        </select>
                                    </label>
                                    <label>
                                        Ano
                                        <select value={anoSelecionado} onChange={(e) => setAnoSelecionado(Number(e.target.value))}>
                                            {anosDisponiveis.map((ano) => <option key={ano} value={ano}>{ano}</option>)}
                                        </select>
                                    </label>
                                </div>
                                <h2 className="text-center">{moeda.format(indicadores.totalDoMes)}</h2>
                                <p className="indicador-detalhe">Período dos três indicadores: {meses[mesSelecionado - 1]} de {anoSelecionado}</p>
                            </section>
                            <section className="border p-3 theme-card indicador-card" aria-labelledby="titulo-categoria">
                                <h1 id="titulo-categoria">Categoria com maior gasto</h1>
                                {indicadores.nomeCategoria ? (
                                    <>
                                        <h2 className="text-center">{indicadores.nomeCategoria}</h2>
                                        <p className="indicador-detalhe">{moeda.format(indicadores.valorCategoria)} · {percentual.format(indicadores.percentualCategoria)}% do mês</p>
                                    </>
                                ) : <p className="indicador-detalhe">Sem despesas no período</p>}
                            </section>
                            <section className="border p-3 theme-card indicador-card" aria-labelledby="titulo-comparacao">
                                <h1 id="titulo-comparacao">Comparação com o mês anterior</h1>
                                {indicadores.variacao === null ? (
                                    <p className="indicador-detalhe">Sem base de comparação no mês anterior</p>
                                ) : (
                                    <>
                                        <h2 className="text-center">
                                            {indicadores.variacao > 0 ? '↑ ' : indicadores.variacao < 0 ? '↓ ' : ''}
                                            {percentual.format(Math.abs(indicadores.variacao))}%
                                        </h2>
                                        <p className="indicador-detalhe">
                                            {indicadores.diferenca === 0 ? 'Mesmo valor' : moeda.format(Math.abs(indicadores.diferenca)) + (indicadores.diferenca > 0 ? ' a mais' : ' a menos')}
                                        </p>
                                    </>
                                )}
                                <p className="indicador-detalhe">
                                    {indicadores.ehMesAtual ? 'Mês atual até hoje; mês anterior até o dia ' + indicadores.limiteAnterior + '.' : 'Comparação entre meses completos.'}
                                </p>
                            </section>
                        </div>
                    </div>

                    <div className="container pb-4">
                        <div className="row py-4 dashboard-content">
                            <div className="col text-center theme-card p-3">
                                <h1>Categorias de gasto</h1>
                                <Grafico arrayGastos={arrayGastos} mesSelecionado={mesSelecionado} ano={anoSelecionado} />
                            </div>
                            <div className="col text-center">
                                <div className="table-scroll">
                                    <TabelaDashboard
                                        arrayGastos={arrayGastos}
                                        mesSelecionado={mesSelecionado}
                                        ano={anoSelecionado}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Dashboard
