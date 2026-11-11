
import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';

function Grafico({ arrayGastos = [] }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const categorias = {
            Lazer: 0,
            Mercado: 0,
            Transporte: 0,
            Outros: 0
        };

        for (let i = 0; i < arrayGastos.length; i++) {
            const categoria = arrayGastos[i].categoria;

            if (Object.hasOwn(categorias, categoria)) {
                categorias[categoria]++;
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
    }, [arrayGastos]);

    return (
        <div style={{ height: '400px', position: 'relative' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default Grafico;
