import { useState } from 'react'
import Card from './Components/Card'
import Boton from './Components/Boton/Boton'
import { Link } from 'react-router-dom';
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [abrirModal, setAbrirModal] = useState(false);

  return (
    <>
      <header>
        <h1>TEORIA DE COLAS</h1>
      </header>

      <main id='main1'>
        <Card
          id="que"
          titulo="QUE ES TEORIA DE COLAS"
          info="La teoría de colas es un área de la investigación de operaciones que analiza los sistemas 
        donde los usuarios llegan, esperan y son atendidos. Su propósito es mejorar la eficiencia del 
        servicio, reduciendo tiempos de espera y optimizando el uso de recursos"
        />

        <Card
          id="mm1"
          titulo="MODELO M/M/1"
          info="En la teroria de colas tenemos dos modelos principales entre los cuales el mas 
        basico sería este M/M/1 donde solo existe una estación de servicio, servidor, dependiendo
        del tema que estemos analizando. Tomemos como ejemplo un centro comercial donde muchas personas
        compran pero hay un solo cajero disponible, este modelo puede que no sea eficiente en procesos
        con mucho número de clientes por eso mismo  se aplica esta teoria de colas. "
        />

        <Card
          id="mmk"
          titulo="MODELO M/M/K"
          info="El modelo M/M/K es el mas importante ya que nos permite realizar un analisis mas amplio al darnos
          la opcion de elegir la cantidad de estaciones de servicio (K) al momento de realizar los calculos. Este modelo es
          el mas eficiente donde hay una cantidad de solicitudes o llegada alta ya que permite atender mas a la vez, su desventaja 
          principal es que dependiendo la cantidad de estaciones asi mismo se elevan los costos totales. "
        />

        <Card
          id="fmm1"
          titulo="FORMULAS DEL MODELO M/M/1"
          info={
            <>
              <p>Para este modelo debemos tener en cuenta que el usuario debe indicar el valor de λ
                y μ donde el valor de μ debe ser mayor al de λ para que se pueda considerar en el rango de un sistema estable</p>
              <ul>
                <li>Promedio de personas en el sistema</li>
                L=  λ/(μ-λ)
                <li>Duracion promedio en el sistema</li>
                W=  1/(μ-λ)
                <li>Promedio de personas en la cola</li>
                Lq=  λ^2/(μ(μ-λ))
                <li>Tiempo promedio de espera en la cola</li>
                Wq=  λ/(μ(μ-λ))
                <li>Factor de ocupacion</li>
                ρ=  λ/μ
                <li>Probabilidad de que el sistema este vacio</li>
                P_0= 1-ρ
              </ul>
            </>
          }
        />
<Card
  id="fmmk"
  titulo="FORMULAS DEL MODELO M/M/K"
  info={
    <>
      <p>
        Para este modelo el usuario debe indicar los valores de λ, μ y K, donde
        K representa la cantidad de estaciones de servicio o servidores. Para
        que el sistema sea estable debe cumplirse que λ sea menor que Kμ.
      </p>
      <ul>
        

        <li>Factor de ocupación</li>
        ρ = λ / (Kμ)

        <li>Probabilidad de que el sistema esté vacío</li>
        P₀ = 1 / [
        Σ(n=0 hasta K-1) ((λ/μ)^n / n!) +
        ((λ/μ)^K / (K!(1-ρ)))
        ]

        <li>Promedio de personas en la cola</li>
        Lq = (P₀ (λ/μ)^K ρ) / (K!(1-ρ)^2)

        <li>Promedio de personas en el sistema</li>
        L = Lq + (λ/μ)

        <li>Tiempo promedio de espera en la cola</li>
        Wq = Lq / λ

        <li>Duración promedio en el sistema</li>
        W = Wq + (1/μ)
      </ul>
    </>
  }
/>
      
       
      </main>

      <aside>
        <Link to="/mm1">
          <Boton texto="Calcular M/M/1" />
        </Link>

        <Link to="/mmk">
          <Boton texto="Calcular M/M/K" />
        </Link>
      </aside>


    </>
  )
}

export default App
