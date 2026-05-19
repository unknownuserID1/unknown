import { useState, useRef } from 'react';
import Card from '../../Components/Cardr/Cardr';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

function MMK() {

    // ==========================
    // ESTADOS
    // ==========================
    const [lambda, setLambda] = useState('');
    const [mu, setMu] = useState('');
    const [k, setK] = useState('');
    const [resultado, setResultado] = useState(null);
    const [tituloAnalisis, setTituloAnalisis] = useState('');
    const [analisis, setAnalisis] = useState('');

    const grafica1Ref = useRef(null);
    const grafica2Ref = useRef(null);
    const grafica3Ref = useRef(null);

    // ==========================
    // FACTORIAL
    // ==========================
    const factorial = (n) => {
        let f = 1;
        for (let i = 2; i <= n; i++) {
            f *= i;
        }
        return f;
    };

    // ==========================
    // CALCULAR P0
    // ==========================
    const calcularP0 = (lambda, mu, servidores) => {
        const a = lambda / mu;
        const rho = lambda / (servidores * mu);

        let suma = 0;

        for (let n = 0; n < servidores; n++) {
            suma += Math.pow(a, n) / factorial(n);
        }

        suma +=
            Math.pow(a, servidores) /
            (factorial(servidores) * (1 - rho));

        return 1 / suma;
    };

    // ==========================
    // CALCULAR MODELO M/M/K
    // ==========================
    const calcular = () => {
        const l = parseFloat(lambda);
        const m = parseFloat(mu);
        const servidores = parseInt(k);

        if (!l || !m || !servidores) {
            alert('Complete los valores necesarios');
            return;
        }

        if (servidores <= 0) {
            alert('El número de servidores debe ser mayor que cero');
            return;
        }

        // Condición de estabilidad
        if (l >= servidores * m) {
            alert('El sistema es inestable');
            return;
        }

        const rho = l / (servidores * m);
        const P0 = calcularP0(l, m, servidores);
        const a = l / m;

        // Promedio de clientes en la cola
        const Lq =
            (P0 * Math.pow(a, servidores) * rho) /
            (factorial(servidores) * Math.pow(1 - rho, 2));

        // Promedio de clientes en el sistema
        const L = Lq + a;

        // Tiempo promedio en cola
        const Wq = Lq / l;

        // Tiempo promedio en el sistema
        const W = Wq + (1 / m);

        setResultado({
            L,
            W,
            Lq,
            Wq,
            rho,
            P0
        });
    };

    // ==========================
    // GENERAR DATOS PARA GRAFICAS
    // ==========================
    const generarDatos = () => {
        const m = parseFloat(mu);
        const servidores = parseInt(k);

        if (!m || m <= 0 || !servidores || servidores <= 0) {
            return [];
        }

        const limite = servidores * m;
        let datos = [];

        for (let l = 0.1; l < limite; l += limite / 20) {
            const rho = l / (servidores * m);
            const P0 = calcularP0(l, m, servidores);
            const a = l / m;

            const Lq =
                (P0 * Math.pow(a, servidores) * rho) /
                (factorial(servidores) * Math.pow(1 - rho, 2));

            const Wq = Lq / l;

            datos.push({
                lambda: l.toFixed(2),
                rho,
                Wq,
                P0
            });
        }

        return datos;
    };

    const data = generarDatos();
    // ==========================
    // EXPORTAR PDF
    // ==========================
    const exportarPDF = async () => {
        if (!resultado) {
            alert("Primero debe realizar un cálculo");
            return;
        }

        const doc = new jsPDF('p', 'mm', 'a4');

        // Borde
        doc.rect(10, 10, 190, 277);

        // Título
        doc.setFontSize(20);
        doc.text("Reporte Modelo M/M/K", 55, 20);

        // Datos de entrada
        doc.setFontSize(12);
        doc.text(`Tasa de llegada (Lambda): ${lambda}`, 20, 40);
        doc.text(`Tasa de servicio (Mu): ${mu}`, 20, 50);
        doc.text(`Número de servidores (K): ${k}`, 20, 60);

        // Tabla de resultados
        autoTable(doc, {
            startY: 75,
            head: [['Métrica', 'Resultado']],
            body: [
                ['L - Clientes en el sistema', Math.round(resultado.L)],
                ['W - Tiempo en el sistema', resultado.W.toFixed(2)],
                ['Lq - Clientes en cola', Math.round(resultado.Lq)],
                ['Wq - Tiempo en cola', resultado.Wq.toFixed(2)],
                ['Rho - Utilización', resultado.rho.toFixed(2)],
                ['P0 - Sistema vacío', resultado.P0.toFixed(2)]
            ],
            styles: {
                fontSize: 11,
                cellPadding: 3,
                halign: 'center'
            },
            headStyles: {
                fillColor: [40, 40, 40]
            }
        });

        let y = doc.lastAutoTable.finalY + 15;

        const agregarGrafica = async (ref, titulo, analisisTexto) => {
            if (y > 150) {
                doc.addPage();
                doc.rect(10, 10, 190, 277);
                y = 20;
            }

            const canvas = await html2canvas(ref.current);
            const imgData = canvas.toDataURL('image/png');

            doc.setFillColor(230, 230, 230);
            doc.rect(20, y - 6, 170, 8, 'F');

            doc.setFontSize(14);
            doc.text(titulo, 22, y);

            y += 10;

            doc.addImage(
                imgData,
                'PNG',
                35,
                y,
                140,
                85
            );

            y += 95;

            doc.setFontSize(11);
            doc.text("Análisis:", 20, y);

            y += 8;

            const texto = doc.splitTextToSize(
                analisisTexto,
                165
            );

            doc.text(texto, 20, y);

            y += 30;
        };

        await agregarGrafica(
            grafica1Ref,
            'Grafica de ocupacion del sistema',
            'Esta gráfica muestra qué tan ocupado está el sistema. Cuando el nivel de ocupación se aproxima a 1, el sistema comienza a saturarse y puede colapsar.'
        );

        await agregarGrafica(
            grafica2Ref,
            'Grafica de tiempo de espera',
            'Esta gráfica representa el tiempo promedio que un cliente debe esperar antes de ser atendido. A medida que aumenta la tasa de llegada, el tiempo de espera también aumenta.'
        );

        await agregarGrafica(
            grafica3Ref,
            'Grafica de sistema vacio',
            'Esta gráfica muestra la probabilidad de que el sistema permanezca vacío. Cuando aumentan las llegadas, esta probabilidad disminuye.'
        );

        doc.save("Reporte_MMK.pdf");
    };

    return (
        <>
            <div id='bv'>
                <header>
                    <h1>MODELO M/M/K</h1>
                </header>

                <div className='botonesnav'>
                    <Link to="/">
                        <button id="volver">
                            Volver al inicio
                        </button>
                    </Link>

                    <button onClick={exportarPDF} id='volver'>
                        Exportar PDF
                    </button>
                </div>
            </div>

            <main id='main2'>
                <section id='sect1'>

                    <div id='inputs'>
                        <label>Promedio de llegadas:</label>
                        <input
                            type="number"
                            placeholder="λ"
                            value={lambda}
                            onChange={(e) => {
                                setLambda(e.target.value);
                                setResultado(null);
                            }}
                        />

                        <label>Promedio de solicitudes atendidas por servidor:</label>
                        <input
                            type="number"
                            placeholder="μ"
                            value={mu}
                            onChange={(e) => {
                                setMu(e.target.value);
                                setResultado(null);
                            }}
                        />

                        <label>Número de servidores:</label>
                        <input
                            type="number"
                            placeholder="K"
                            value={k}
                            onChange={(e) => {
                                setK(e.target.value);
                                setResultado(null);
                            }}
                        />

                        <button onClick={calcular}>Calcular</button>
                    </div>

                    <Card
                        id="cardl"
                        titulo="Promedio de clientes en el sistema"
                        valor={resultado ? resultado.L.toFixed(3) : null}
                    />

                    <Card
                        id="cardw"
                        titulo="Tiempo promedio en el sistema"
                        valor={resultado ? resultado.W.toFixed(3) : null}
                    />

                    <Card
                        id="cardlq"
                        titulo="Promedio de clientes en la cola"
                        valor={resultado ? resultado.Lq.toFixed(3) : null}
                    />

                    <Card
                        id="cardwq"
                        titulo="Tiempo promedio que dura en la cola"
                        valor={resultado ? resultado.Wq.toFixed(3) : null}
                    />

                    <Card
                        id="cardrho"
                        titulo="Factor de utilización del sistema"
                        valor={resultado ? resultado.rho.toFixed(3) : null}
                    />

                    <Card
                        id="cardp0"
                        titulo="Probabilidad de que el sistema esté vacío"
                        valor={resultado ? resultado.P0.toFixed(3) : null}
                    />
                </section>

                <section id='sect2'>

                    <div className="grafica" id='grafica1' ref={grafica1Ref}>
                        <div className='btnytitulo'>
                            <h4>Ocupación del sistema (ρ)</h4>
                            <button
                                className='btnanalisis'
                                onClick={() => {
                                    setTituloAnalisis('Análisis de ocupación');
                                    setAnalisis(
                                        'Esta gráfica muestra qué tan ocupado está el conjunto de servidores. Cuando ρ se acerca a 1, el sistema comienza a saturarse y el riesgo de congestión aumenta.'
                                    );
                                }}
                            >
                                Ver análisis
                            </button>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <XAxis
                                    dataKey="lambda"
                                    label={{
                                        value: 'λ',
                                        position: 'bottom',
                                        offset: -5
                                    }}
                                />
                                <YAxis
                                    domain={[0, 1]}
                                    label={{
                                        value: 'ρ',
                                        angle: -90,
                                        position: 'insideLeft'
                                    }}
                                />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="rho"
                                    strokeWidth={3}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grafica" id='grafica2' ref={grafica2Ref}>
                        <div className='btnytitulo'>
                            <h4>Tiempo de espera (Wq)</h4>
                            <button
                                className='btnanalisis'
                                onClick={() => {
                                    setTituloAnalisis('Análisis del tiempo de espera');
                                    setAnalisis(
                                        'Esta gráfica representa el tiempo promedio que un cliente debe esperar antes de ser atendido. A medida que aumenta λ, el tiempo de espera crece debido a la congestión del sistema.'
                                    );
                                }}
                            >
                                Ver análisis
                            </button>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <XAxis
                                    dataKey="lambda"
                                    label={{
                                        value: 'λ',
                                        position: 'bottom',
                                        offset: -5
                                    }}
                                />
                                <YAxis
                                    label={{
                                        value: 'Wq',
                                        angle: -90,
                                        position: 'insideLeft'
                                    }}
                                />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="Wq"
                                    strokeWidth={3}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grafica" id='grafica3' ref={grafica3Ref}>
                        <div className='btnytitulo'>
                            <h4>Probabilidad vacío (P0)</h4>
                            <button
                                className='btnanalisis'
                                onClick={() => {
                                    setTituloAnalisis('Análisis del sistema vacío');
                                    setAnalisis(
                                        'Esta gráfica muestra la probabilidad de que el sistema no tenga clientes. Cuando λ aumenta, el sistema permanece ocupado durante más tiempo y la probabilidad de estar vacío disminuye.'
                                    );
                                }}
                            >
                                Ver análisis
                            </button>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <XAxis
                                    dataKey="lambda"
                                    label={{
                                        value: 'λ',
                                        position: 'bottom',
                                        offset: -5
                                    }}
                                />
                                <YAxis
                                    domain={[0, 1]}
                                    label={{
                                        value: 'P₀',
                                        angle: -90,
                                        position: 'insideLeft'
                                    }}
                                />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="P0"
                                    strokeWidth={3}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grafica info-box" id='analisis'>
                        <h4>
                            {tituloAnalisis || 'Interpretación'}
                            <hr />
                        </h4>

                        <div id='info'>
                            {
                                analisis
                                    ? <p>{analisis}</p>
                                    : <p>Seleccione una gráfica para ver su análisis.</p>
                            }
                        </div>
                    </div>

                </section>
            </main>
        </>
    );
}

export default MMK;