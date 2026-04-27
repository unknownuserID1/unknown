import React from 'react'
import './Card.css';

function Card({ titulo, info, id}) {
  return (
    <div id={id} className="card mi-card cu">
      <div className="card-body">
        <h5 className="card-title titulo">{titulo}</h5>
          <hr />
        <p className="card-text">{info}</p>
      </div>
    </div>
  );
}

export default Card
