import React, { useState } from 'react';

const ListaTrabajos = ({ trabajos }) => {
  const [descripcionesExpandidas, setDescripcionesExpandidas] = useState({});

  const toggleDescripcion = (index) => {
    setDescripcionesExpandidas(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (trabajos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-xl">No se encontraron trabajos</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Todos los Resultados ({trabajos.length})
      </h2>
      
      <div className="space-y-6">
        {trabajos.map((trabajo, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-gray-50">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-xl text-gray-800 flex-1 mr-4">
                {trabajo.titulo || 'Sin título'}
              </h3>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                #{index + 1}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 font-medium">Sueldo</div>
                <div className="text-green-700 font-bold text-lg">
                  {trabajo.sueldo && trabajo.sueldo.toLowerCase().includes('oculto')
                    ? 'Sueldo oculto'
                    : (trabajo.sueldo || 'No especificado')}
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 font-medium">Ubicación</div>
                <div className="text-blue-700 font-semibold">{trabajo.ubicacionLimpia || 'No especificada'}</div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 font-medium">Tiempo</div>
                <div className="text-purple-700 font-semibold">{trabajo.tiempo || 'No especificado'}</div>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 font-medium">Inglés</div>
                <div className="text-orange-700 font-semibold">{trabajo.ingles || 'No especificado'}</div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-600 font-medium">Descripción</div>
                <button 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  onClick={() => toggleDescripcion(index)}
                >
                  {descripcionesExpandidas[index] ? 'Ver menos' : 'Ver descripción completa'}
                </button>
              </div>
              <div className={`text-gray-700 leading-relaxed ${
                descripcionesExpandidas[index] 
                  ? 'max-h-none' 
                  : 'max-h-24 overflow-hidden'
              }`}>
                {trabajo.descripcionLimpia || 'Sin descripción disponible'}
              </div>
              {!descripcionesExpandidas[index] && (
                <div className="text-blue-600 text-sm mt-2 cursor-pointer" onClick={() => toggleDescripcion(index)}>
                  ...ver más
                </div>
              )}
            </div>
            
            {trabajo.URLPuesto && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <a 
                  href={trabajo.URLPuesto} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Ver oferta completa
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaTrabajos; 