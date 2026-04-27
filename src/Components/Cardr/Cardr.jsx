import './Cardr.css';
function Cardr({ id, titulo, valor }) {
  return (
    <div id={id} className="card mi-card cu">
      <div className="card-body">
        <h5 className="card-title titulo">{titulo}</h5>
        <hr />
        <p className="card-text valor">
          {valor !== undefined ? valor : "Sin calcular"}
        </p>
      </div>
    </div>
  );
}

export default Cardr;