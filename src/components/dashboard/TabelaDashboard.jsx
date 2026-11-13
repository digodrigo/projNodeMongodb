import { useEffect, useState } from 'react';
import Paginacao from './Paginacao.jsx';

function TabelaDashboard({ arrayGastos = [], mesSelecionado, ano }) {

    const [filtro, setFiltro] = useState({
        coluna: null,
        crescente: true
    });

    const [paginaAtual, setPaginaAtual] = useState(1);

    const gastosPorPagina = 5;
    // A lista acompanha os dados da API, sem depender de um clique para aparecer.
    const gastoExibido = [...arrayGastos];
    if (filtro.coluna) {
        gastoExibido.sort((a, b) => {
            if (a[filtro.coluna] > b[filtro.coluna]) return filtro.crescente ? -1 : 1;
            if (a[filtro.coluna] < b[filtro.coluna]) return filtro.crescente ? 1 : -1;
            return 0;
        });
    }

    const totalPaginas = Math.ceil(gastoExibido.length / gastosPorPagina);
    const paginaExibida = Math.min(paginaAtual, Math.max(1, totalPaginas));

    const indiceInicial = (paginaExibida - 1) * gastosPorPagina;
    const indiceFinal = indiceInicial + gastosPorPagina;

    const gastosExibidos = gastoExibido.slice(
        indiceInicial,
        indiceFinal
    );

    useEffect(() => {
        console.log('arrayGastos:', arrayGastos);
        console.log('mesSelecionado:', mesSelecionado);
        console.log('ano:', ano);
        const gastoExibido1 = [];
        for (let i = 0; i < arrayGastos.length; i++) {
            if (Number(arrayGastos[i].data.split('-')[0]) === ano && Number(arrayGastos[i].data.split('-')[1]) === mesSelecionado) {
                console.log("teste Tabela", arrayGastos[i]);
                gastoExibido1.push(arrayGastos[i]);
            }
        }

    }, [arrayGastos, mesSelecionado, ano]);
    return (
        <>
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
                paginaAtual={paginaExibida}
                totalPaginas={totalPaginas}
                setPaginaAtual={setPaginaAtual}
            />
        </>
    )
}

export default TabelaDashboard;