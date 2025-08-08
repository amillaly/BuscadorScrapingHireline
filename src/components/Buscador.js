import React, { useState } from 'react';

const Buscador = ({ onBuscar, cargando }) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const manejarBusqueda = (e) => {
    e.preventDefault();
    if (terminoBusqueda.trim() && !cargando) {
      onBuscar(terminoBusqueda);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <form onSubmit={manejarBusqueda} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            placeholder="Buscar trabajos (ej: React, JavaScript, Python)..."
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              cargando ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
            }`}
            disabled={cargando}
          />
        </div>
        <button 
          type="submit" 
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            cargando 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }`}
          disabled={cargando}
        >
          {cargando ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Buscando...
            </div>
          ) : (
            'Buscar Trabajos'
          )}
        </button>
      </form>
      
      {cargando && (
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            El buscador está desactivado durante la búsqueda...
          </p>
        </div>
      )}
    </div>
  );
};

export default Buscador; 