import './Add.scss'
import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom';

function Botao({ gastoEditando }) {
    const [inputCategoria, setInputCategoria] = useState('');
    const [inputCompra, setInputCompra] = useState('');
    const [inputValor, setInputValor] = useState('');
    const [inputData, setInputData] = useState('');
    const [gastoEditandoState, setGastoEditando] = useState(gastoEditando);
    const navigate = useNavigate();

    async function Adicionar(e) {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token');
            const tryAdicionar = await fetch('http://localhost:3000/Adicionar', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ categoria: inputCategoria, compra: inputCompra, valor: inputValor, data: inputData })
            });
            const result = await tryAdicionar.json();
            if (tryAdicionar.ok) {
                alert(result.mensagem);
                setInputCategoria('');
                setInputCompra('');
                setInputValor('');
                setInputData('');
            }
            
            if (result.codigo === 'TOKEN_EXPIRADO' ||
                result.codigo === 'TOKEN_INVALIDO' ||
                result.codigo === 'TOKEN_NAO_FORNECIDO') {

                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            if(!tryAdicionar.ok){
                throw new Error(`Erro HTTP: ${tryAdicionar.status}`);
            }
        } catch (error) {
            alert(error);
        }
    }

    async function submitEditar(e) {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token');
            const tryAdicionar = await fetch(`http://localhost:3000/Editar/${gastoEditandoState._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ categoria: inputCategoria, compra: inputCompra, valor: inputValor, data: inputData })
            });
            const result = await tryAdicionar.json();
            if (tryAdicionar.ok) {
                alert(result.mensagem);
                setInputCategoria('');
                setInputCompra('');
                setInputValor('');
                setInputData('');
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(gastoEditandoState){
            setInputCategoria(gastoEditandoState.categoria);
            setInputCompra(gastoEditandoState.compra);
            setInputValor(gastoEditandoState.valor);
            setInputData(gastoEditandoState.data);
        }
    }, []);

    return (
        <>
            <div class="gasto-card">
                <h2>Adicionar Gasto</h2>
                <form onSubmit={Adicionar}>
                    <div class="form-group">
                        <label>Categoria</label>
                        <select name="categoria" id="categoria" value={inputCategoria} onChange={(e) => setInputCategoria(e.target.value)}>
                            <option value="" disabled selected>Selecione...</option>
                            <option value="Lazer">Lazer</option>
                            <option value="Mercado">Mercado</option>
                            <option value="Transporte">Transporte</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Compra / Local</label>
                        <input type="text" placeholder="Ex: Supermercado Extra" value={inputCompra} onChange={(e) => setInputCompra(e.target.value)} />
                    </div>

                    <div class="form-group">
                        <label>Valor (R$)</label>
                        <input type="number" step="0.01" placeholder="0,00" value={inputValor} onChange={(e) => setInputValor(e.target.value)} />
                    </div>

                    <div class="form-group">
                        <label>Data</label>
                        <input type="date" value={inputData} onChange={(e) => setInputData(e.target.value)} />
                    </div>
                    {gastoEditandoState ? (
                    <button type="submit" class="btn-salvar" onClick={(e) => submitEditar(e)}>Editar Gasto</button>)
                    :
                    (<button type="submit" class="btn-salvar">Adicionar Gasto</button>)}
                </form>
            </div>
        </>
    )
}

export default Botao