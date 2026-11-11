import './App.scss'
import { useState, useEffect } from 'react'
import Add from './Add';
import Grafico from './components/Dashboard/grafico';
import Paginacao from './components/Dashboard/paginacao';
import {jwtDecode} from 'jwt-decode';
import {useNavigate} from 'react-router-dom';

function Dashboard({ arrayGastos }) {
    const [mesSelecionado, setMesSelecionado] = useState();
    const [gastoTotalMes, setGastoTotalMes] = useState();
    const [gastoEditando, setGastoEditando] = useState(null);
    const [filtro, setFiltro] = useState({
        coluna: null,
        crescente: true
    });
    const [gastoExibido, setGastoExibido] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);

    const gastosPorPagina  = 5;
    const totalPaginas = Math.ceil(gastoExibido.length / gastosPorPagina);

    const indiceInicial = (paginaAtual - 1) * gastosPorPagina;
    const indiceFinal = indiceInicial + gastosPorPagina;

    const gastosExibidos = gastoExibido.slice(
        indiceInicial,
        indiceFinal
    );

    const navigate = useNavigate();

    function calcularGastoTotal(paramArrayGastos) {
        if (!paramArrayGastos || paramArrayGastos.length === 0) {
            return 0;
        }

        return paramArrayGastos.reduce((total, gasto) => total + gasto.valor, 0);
    }

    function handleMes(e) {
        const mesEscolhido = e.target.value;
        setMesSelecionado(mesEscolhido);
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];


        const arrayFiltrado = [];
        for (let i = 0; i < arrayGastos.length; i++) {
            const dataBanco = arrayGastos[i].data.split('-')[1];
            console.log(meses[dataBanco - 1]);

            console.log(mesEscolhido);

            if (meses[dataBanco - 1] === mesEscolhido) {
                arrayFiltrado.push(arrayGastos[i]);
                console.log(arrayFiltrado);
            }
        }
        setGastoTotalMes(calcularGastoTotal(arrayFiltrado));
    }

    function handleEdit(gasto) {
        console.log('Editar gasto:', gasto);
        setGastoEditando(gasto);
    }

    function handleFiltro(coluna) {
        const arrayGastosCopy = [...arrayGastos];
        const novoFiltro = {
            coluna: coluna,
            crescente: filtro.coluna === coluna ? !filtro.crescente : true
        };
        if (novoFiltro.coluna === coluna){
            if(novoFiltro.crescente) {
                arrayGastosCopy.sort((a, b) => {
                    if (a[coluna] > b[coluna]) return -1;
                    if (a[coluna] < b[coluna]) return 1;
                    return 0;
                });
                setGastoExibido(arrayGastosCopy);
            } else {
                arrayGastosCopy.sort((a, b) => {
                    if (a[coluna] > b[coluna]) return 1;
                    if (a[coluna] < b[coluna]) return -1;
                    return 0;
                });
                setGastoExibido(arrayGastosCopy);
            }
        }
        console.log('Array de gastos ordenado:', arrayGastosCopy);
        console.log('Novo filtro:', novoFiltro);
        setFiltro(novoFiltro);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);

            const tempoRestante = decodedToken.exp * 1000 - Date.now();

            if (tempoRestante <= 0) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const temporizador = setTimeout(() => {
                localStorage.removeItem('token');
                navigate('/login');
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
                        <div className="row gap-3">
                            <div className="col border p-2 theme-card">
                                <h1>Selecione o mês:
                                    <select name="mes" id="mes" value={mesSelecionado} onChange={(e) => handleMes(e)} class="select-transparente">
                                        <option value="" disabled selected>Selecione...</option>
                                        <option value="Janeiro">Janeiro</option>
                                        <option value="Fevereiro">Fevereiro</option>
                                        <option value="Março">Março</option>
                                        <option value="Abril">Abril</option>
                                        <option value="Maio">Maio</option>
                                        <option value="Junho">Junho</option>
                                        <option value="Julho">Julho</option>
                                        <option value="Agosto">Agosto</option>
                                        <option value="Setembro">Setembro</option>
                                        <option value="Outubro">Outubro</option>
                                        <option value="Novembro">Novembro</option>
                                        <option value="Dezembro">Dezembro</option>
                                    </select>
                                </h1>
                                <h2 className='text-center'>{gastoTotalMes?.toFixed(2)}</h2>
                            </div>

                            <div className="col border p-2 theme-card">
                                <h1>Gasto total</h1>
                                <h2 className='text-center'>{calcularGastoTotal().toFixed(2)}</h2>
                            </div>

                            <div className="col border p-2 theme-card">
                                <h1>Saldo Atual</h1>
                                <h2 className='text-center'>{ }</h2>
                            </div>
                        </div>
                    </div>

                    <div className="container pb-4">
                        <div className="row py-4">
                            <div className="col text-center theme-card p-3">
                                <h1>Categorias de gasto</h1>
                                <Grafico arrayGastos={arrayGastos} />
                            </div>
                            <div className="col text-center">
                                <table className="table theme-table">
                                    <thead>
                                        <tr>
                                            <th scope='col' className="text-start" onClick={() => handleFiltro('id')}>#</th>
                                            <th scope='col' className="text-start" onClick={() => handleFiltro('categoria')}>
                                                Categoria{filtro.coluna === 'categoria' ? (filtro.crescente ? (<i class="bi bi-arrow-bar-down"></i>) : (<i class="bi bi-arrow-bar-up"></i>)) : null}
                                            </th>
                                            <th scope='col' className="text-start" onClick={() => handleFiltro('compra')}>
                                                Compra{filtro.coluna === 'compra' ? (filtro.crescente ? (<i class="bi bi-arrow-bar-down"></i>) : (<i class="bi bi-arrow-bar-up"></i>)) : null}
                                            </th>
                                            <th scope='col' className="text-start" onClick={() => handleFiltro('valor')}>
                                                Valor{filtro.coluna === 'valor' ? (filtro.crescente ? (<i class="bi bi-arrow-bar-down"></i>) : (<i class="bi bi-arrow-bar-up"></i>)) : null}
                                            </th>
                                            <th scope='col' className="text-start" onClick={() => handleFiltro('data')}>
                                                Data{filtro.coluna === 'data' ? (filtro.crescente ? (<i class="bi bi-arrow-bar-down"></i>) : (<i class="bi bi-arrow-bar-up"></i>)) : null}
                                            </th>
                                            <th scope='col' className="text-start">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gastosExibidos && gastosExibidos.map((gasto, index) => (
                                            <tr key={index}>
                                                <td className="text-start">{index + 1}</td>
                                                <td className="text-start">{gasto.categoria}</td>
                                                <td className="text-start">{gasto.compra}</td>
                                                <td className="text-start">R$ {gasto.valor.toFixed(2)}</td>
                                                <td className="text-start">{new Date(gasto.data).toLocaleDateString()}</td>
                                                <td className="text-start">
                                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(gasto)}>Editar</button>
                                                    <button className="btn btn-sm btn-outline-danger"><i class="bi bi-trash3-fill"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Paginacao
                                    paginaAtual={paginaAtual}
                                    totalPaginas={totalPaginas}
                                    setPaginaAtual={setPaginaAtual}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Dashboard