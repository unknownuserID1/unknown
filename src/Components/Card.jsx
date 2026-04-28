import React from 'react'
import './Card.css';

function Card({ titulo, info, id}) {
  return (
    <div id={id} className="card mi-card cu">
      <div className="card-body">
        <h5 className="card-title titulo">{titulo}</h5>
          <hr />
        <div className="card-text">{info}</div>
      </div>
    </div>
  );
}

export default Card
