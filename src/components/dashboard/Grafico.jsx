
import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';

function Grafico({ arrayGastos = [], mesSelecionado, ano }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;  

        console.log('arrayGastos:', arrayGastos);
        console.log('mesSelecionado:', mesSelecionado);
        console.log('ano:', ano);

        const categorias = {
            Lazer: 0,
            Mercado: 0,
            Transporte: 0,
            Outros: 0
        };

        for (let i = 0; i < arrayGastos.length; i++) {
            if(Number(arrayGastos[i].data.split('-')[0]) === ano && Number(arrayGastos[i].data.split('-')[1]) === mesSelecionado) {
                const categoria = arrayGastos[i].categoria;

                if (Object.hasOwn(categorias, categoria)) {
                    categorias[categoria]++;
                    console.log({
                        data: arrayGastos[i].data,
                        categoria,
                        quantidadeAcumulada: categorias[categoria]
                    });
                }
            }
        }

        const grafico = new Chart(chartRef.current, {
            type: 'doughnut',
            data: {
                labels: ['Lazer', 'Mercado', 'Transporte', 'Outros'],
                datasets: [{
                    label: 'Quantidade de gastos',
                    data: [
                        categorias.Lazer,
                        categorias.Mercado,
                        categorias.Transporte,
                        categorias.Outros
                    ],
                    backgroundColor: [
                        '#4e79a7',
                        '#f28e2b',
                        '#59a14f',
                        '#e15759'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        return () => {
            grafico.destroy();
        };
    }, [arrayGastos, mesSelecionado]);

    return (
        <div style={{ height: '400px', position: 'relative' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default Grafico;
