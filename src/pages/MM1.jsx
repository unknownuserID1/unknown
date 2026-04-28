import { useState } from 'react';
import '../pages/MM1.css'
import Card from '../Components/Cardr/Cardr'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

function MM1() {
    const [lambda, setLambda] = useState('');
    const [mu, setMu] = useState('');
    const [resultado, setResultado] = useState(null);

    const calcular = () => {
        const l = parseFloat(lambda);
        const m = parseFloat(mu);

        if (!l || !m) {
            alert("Complete los valores necesarios");
            return;
        }

        if (m <= l) {
            alert("El sistema es inestable");
            return;
        }

        const L = l / (m - l);
        const W = 1 / (m - l);
        const Lq = (l * l) / (m * (m - l));
        const Wq = l / (m * (m - l));
        const rho = l / m;
        const P0 = 1 - rho;

        setResultado({ L, W, Lq, Wq, rho, P0 });
    };

    const generarDatos = () => {
        const m = parseFloat(mu);
        if (!m || m <= 0) return [];

        let datos = [];

        for (let l = 0.1; l < m; l += m / 20) {
            const rho = l / m;
            const Wq = l / (m * (m - l));
            const P0 = 1 - rho;

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

    return (
        <>
            <header>
                <h1>Modelo M/M/1</h1>
            </header>


            <main id='main2'>
                <section id='sect1'>

                    <div id='inputs'>
                        <label>Promedio de llegadas:</label>
                        <input
                            type="number"
                            placeholder="λ"
                            value={lambda}
                            onChange={(e) => setLambda(e.target.value)}
                        />
                        <label>Promedio de solicitudes atendidas:</label>
                        <input
                            type="number"
                            placeholder="μ"
                            value={mu}
                            onChange={(e) => setMu(e.target.value)}
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
                        titulo="Tiempo promedio  en el sistema"
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
                        titulo="Factor de utilización del servidor"
                        valor={resultado ? resultado.rho.toFixed(3) : null}
                    />

                    <Card
                        id="cardp0"
                        titulo="Probabilidad de que el sistema esté vacío"
                        valor={resultado ? resultado.P0.toFixed(3) : null}
                    />

                </section>

                <section id='sect2'>

                   
                    <div className="grafica" id='grafica1'>
                        <h4>Ocupación del sistema (ρ)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <XAxis dataKey="lambda" />
                                <YAxis domain={[0, 1]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="rho" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                   
                    <div className="grafica" id='grafica2'>
                        <h4>Tiempo de espera (Wq)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <XAxis dataKey="lambda" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="Wq" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                   
                    <div className="grafica" id='grafica3'>
                        <h4>Probabilidad de sistema vacío (P₀)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <XAxis dataKey="lambda" />
                                <YAxis domain={[0, 1]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="P0" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                
                    <div className="grafica info-box" id='analisis'>
                        <h4>Interpretación</h4>
                        <p><strong>ρ:</strong> qué tan ocupado está el sistema</p>
                        <p><strong>Wq:</strong> cuánto espera un cliente</p>
                        <p><strong>P₀:</strong> qué tan vacío está el sistema</p>
                        <hr />
                        <p>👉 Si ρ se acerca a 1 → el sistema colapsa</p>
                    </div>

                </section>
            </main>

        </>

    );
}

export default MM1;
