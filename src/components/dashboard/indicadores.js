export function calcularIndicadores(gastos, ano, mes, hoje = new Date()) {
    function filtrar(anoAlvo, mesAlvo, diaLimite = 31) {
        return gastos.filter((gasto) => {
            const [anoGasto, mesGasto, diaGasto] = gasto.data.split('-').map(Number);
            return anoGasto === anoAlvo && mesGasto === mesAlvo && diaGasto <= diaLimite;
        });
    }

    const somar = (lista) => lista.reduce((total, gasto) => total + Number(gasto.valor), 0);
    const gastosDoMes = filtrar(ano, mes);
    const totalDoMes = somar(gastosDoMes);
    const categorias = new Map();
    for (const gasto of gastosDoMes) {
        categorias.set(gasto.categoria, (categorias.get(gasto.categoria) ?? 0) + Number(gasto.valor));
    }
    const maiorCategoria = [...categorias.entries()].sort((a, b) => b[1] - a[1])[0];

    const anterior = new Date(ano, mes - 2, 1);
    const anoAnterior = anterior.getFullYear();
    const mesAnterior = anterior.getMonth() + 1;
    const ehMesAtual = ano === hoje.getFullYear() && mes === hoje.getMonth() + 1;
    const ultimoDiaAnterior = new Date(anoAnterior, mesAnterior, 0).getDate();
    const limiteAnterior = ehMesAtual ? Math.min(hoje.getDate(), ultimoDiaAnterior) : 31;
    const totalAnterior = somar(filtrar(anoAnterior, mesAnterior, limiteAnterior));
    const totalComparado = ehMesAtual ? somar(filtrar(ano, mes, hoje.getDate())) : totalDoMes;

    return {
        totalDoMes,
        nomeCategoria: maiorCategoria?.[0],
        valorCategoria: maiorCategoria?.[1] ?? 0,
        percentualCategoria: totalDoMes > 0 ? ((maiorCategoria?.[1] ?? 0) / totalDoMes) * 100 : 0,
        variacao: totalAnterior > 0 ? ((totalComparado - totalAnterior) / totalAnterior) * 100 : null,
        ehMesAtual,
        limiteAnterior,
        diferenca: totalComparado - totalAnterior,
    };
}
