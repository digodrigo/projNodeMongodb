import './Paginacao.scss';

function Paginacao({ paginaAtual, totalPaginas, setPaginaAtual }) {
    return (
        <nav className="paginacao" aria-label="Navegação de páginas">
            <button
                className="paginacao-btn paginacao-anterior"
                onClick={() => setPaginaAtual(paginaAtual - 1)}
                disabled={paginaAtual <= 1}
            >
                &lsaquo; Anterior
            </button>

            <div className="paginacao-numeros">
                {Array.from({ length: totalPaginas }, (_, index) => {
                    const pagina = index + 1;

                    return (
                        <button
                            key={pagina}
                            className={`paginacao-btn ${
                                paginaAtual === pagina ? 'ativo' : ''
                            }`}
                            onClick={() => setPaginaAtual(pagina)}
                            aria-current={
                                paginaAtual === pagina ? 'page' : undefined
                            }
                        >
                            {pagina}
                        </button>
                    );
                })}
            </div>

            <button
                className="paginacao-btn paginacao-proxima"
                onClick={() => setPaginaAtual(paginaAtual + 1)}
                disabled={paginaAtual >= totalPaginas}
            >
                Próxima &rsaquo;
            </button>
        </nav>
    );
}

export default Paginacao;