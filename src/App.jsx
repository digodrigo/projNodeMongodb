import './App.css'
import dados from './texto.json'
import { useState, useEffect } from 'react'

function App() {

    async function buscar() {
        try {const buscarDados = await fetch('http://localhost:3000', {
            method: "GET"
        })
            const dadosBuscados = await buscarDados.json();
            console.log(dadosBuscados);
            
        } catch {
            console.log("Erro na busca de dados");
        }
    }

    function contadorCategoria() {
        const dadosJsonCompras = dados.compras
        const objQuantidade = {};
        for (let i = 0; i < dadosJsonCompras.length; i++) {     
            const a = dadosJsonCompras[i].categoria;

            if(objQuantidade[a]){
                objQuantidade[a] += 1; //+= incrementa e atribui o novo valor
            }else {
                objQuantidade[a] = 1;
            }
        }

        return (
            <>
            <h1>Lazer: {objQuantidade.Lazer}</h1>
            <h1>Mercado: {objQuantidade.Mercado}</h1>
            <h1>Transporte: {objQuantidade.Mercado}</h1>
            </>
        )
    }

    const dadosJson = dados;
    useEffect(()=>{
        buscar();
        console.log(dadosJson);
    },[])
    return (
        <>
            <div className="container text-center py-4 border-bottom">
                <header className="d-flex justify-content-between">
                    <div>Lorem ipsum</div>
                    <div>dolor sit amet consectetur adipisicing elit.</div>
                </header>
            </div>
            <div className="container">
                <div className="d-flex flex-row justify-content-between py-4">
                    <div className="btn-group" role="group">
                        <button type="button" className="btn btn-outline-secondary">Aba</button>
                        <button type="button" className="btn btn-outline-secondary">Aba</button>
                        <button type="button" className="btn btn-outline-secondary">Aba</button>
                    </div>
                    <div className="input-group" style={{ maxWidth: "280px" }}>
                        <span className="input-group-text bg-white text-muted border-end-0">
                            <i className="bi bi-search"></i>
                        </span>
                        <input type="text" className="form-control border-start-0" aria-label="Buscar"/>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row gap-3">
                    <div className="col border border-secondary p-2">
                        <h1>Gasto do mês</h1>
                        <h2 className='text-align'>{dadosJson.gastoMensal}</h2>
                    </div>

                    <div className="col border border-secondary p-2">
                        <h1>Gasto total</h1>
                        <h2 className='text-align'>{dadosJson.gastoTotal}</h2>
                    </div>

                    <div className="col border border-secondary p-2">
                        <h1>Saldo Atual</h1>
                        <h2 className='text-align'>{dadosJson.saldoAtual}</h2>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row py-4">
                    <div className="col text-center">
                        <h1>Categorias de gasto</h1>
                        {contadorCategoria()}
                    </div>
                    <div className="col text-center">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope='col' className="text-start">#</th>
                                    <th scope='col' className="text-start">Categoria</th>
                                    <th scope='col' className="text-start">Compra</th>
                                    <th scope='col' className="text-start">Valor</th>
                                    <th scope='col' className="text-start">Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dadosJson.compras.map((table)=>
                                    <tr>
                                        <th scope='row'>{table.id}</th>
                                        <td className="text-start">{table.categoria}</td>
                                        <td className="text-start">{table.local}</td>
                                        <td className="text-start">R${table.valor}</td>
                                        <td className="text-start">{table.data}</td>
                                    </tr>                                
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
    }

export default App