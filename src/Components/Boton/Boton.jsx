import React from 'react'
import '../Boton/Boton.css';

function Boton({ texto, onClick }) {
  return (
    <button className="btn-custom" onClick={onClick}>
      {texto}
    </button>
  );
}

export default Boton;
