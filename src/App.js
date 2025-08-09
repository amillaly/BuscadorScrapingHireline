import React, { useState } from 'react';
import Buscador from './components/Buscador';
import ListaTrabajos from './components/ListaTrabajos';
import MapaTrabajos from './components/MapaTrabajos';

function App() {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [pestañaActiva, setPestañaActiva] = useState('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [busquedaCompletada, setBusquedaCompletada] = useState(false);

  const buscarTrabajos = async (termino) => {
    if (!termino.trim()) return;
    
    setCargando(true);
    setError('');
    setResultados([]);
    setPestañaActiva('todos');
    setTerminoBusqueda(termino);
    setBusquedaCompletada(false);
    
    try {
      // Detectar automáticamente si estamos en desarrollo local o en producción
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isDevelopment 
        ? 'http://localhost:3002/api/scraping'
        : 'https://buscadorscrapinghireline.onrender.com/api/scraping'; // URL de Render
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ termino }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResultados(data.resultados);
        setBusquedaCompletada(true);
      } else {
        setError(data.error || 'Error al realizar la búsqueda');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

  const nuevaBusqueda = () => {
    setResultados([]);
    setError('');
    setPestañaActiva('todos');
    setTerminoBusqueda('');
    setBusquedaCompletada(false);
  };

  // Función para extraer el valor numérico del sueldo
  const extraerValorSueldo = (sueldo) => {
    if (!sueldo || sueldo === 'No especificado') return 0;
    
    const numeros = sueldo.match(/\d+/g);
    if (numeros && numeros.length > 0) {
      return parseInt(numeros[0]);
    }
    return 0;
  };

  // Filtrar ofertas con sueldo visible (por si alguna se cuela)
  const ofertasConSueldoVisible = (resultados || []).filter(trabajo => {
    if (!trabajo || !trabajo.sueldo) return false;
    const sueldoLimpio = trabajo.sueldo.toLowerCase().replace(/\s+/g, '');
    return sueldoLimpio !== '' && !sueldoLimpio.includes('oculto');
  });

  // Ordenar trabajos por sueldo
  const trabajosOrdenados = [...ofertasConSueldoVisible].sort((a, b) => {
    const sueldoA = extraerValorSueldo(a.sueldo);
    const sueldoB = extraerValorSueldo(b.sueldo);
    return sueldoB - sueldoA; // Orden descendente
  });

  // Función para determinar cuántos resultados mostrar según el total de ofertas con sueldo visible
  const obtenerCantidadAMostrar = (total) => {
    if (total >= 25) return 10;
    if (total >= 20) return 8;
    if (total >= 12) return 5;
    if (total >= 5) return 3;
    return 1;
  };

  const cantidadAMostrar = obtenerCantidadAMostrar(ofertasConSueldoVisible.length);
  const mejoresSueldos = trabajosOrdenados.slice(0, cantidadAMostrar);
  const peoresSueldos = trabajosOrdenados.slice(-cantidadAMostrar).reverse();

  const renderizarContenido = () => {
    switch (pestañaActiva) {
      case 'todos':
        return <ListaTrabajos trabajos={resultados || []} />;
      case 'cerca':
        return <MapaTrabajos trabajos={resultados || []} />;
      case 'mejores':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
              Top {cantidadAMostrar} - Mejores Sueldos
            </h2>
            <div className="space-y-4">
              {mejoresSueldos.map((trabajo, index) => (
                <div key={index} className="border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-800">{trabajo.titulo}</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-green-600 font-bold text-lg mb-2">{trabajo.sueldo}</p>
                  <p className="text-gray-600 mb-2">{trabajo.ubicacionLimpia}</p>
                  <p className="text-gray-500 text-sm mb-2">{trabajo.tiempo}</p>
                  <p className="text-blue-600 text-sm mb-3">{trabajo.ingles}</p>
                  <p className="text-gray-700 text-sm line-clamp-3">{trabajo.descripcionLimpia}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'peores':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
              Top {cantidadAMostrar} - Sueldos Más Bajos
            </h2>
            <div className="space-y-4">
              {peoresSueldos.map((trabajo, index) => (
                <div key={index} className="border border-orange-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-800">{trabajo.titulo}</h3>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-orange-600 font-bold text-lg mb-2">{trabajo.sueldo}</p>
                  <p className="text-gray-600 mb-2">{trabajo.ubicacionLimpia}</p>
                  <p className="text-gray-500 text-sm mb-2">{trabajo.tiempo}</p>
                  <p className="text-blue-600 text-sm mb-3">{trabajo.ingles}</p>
                  <p className="text-gray-700 text-sm line-clamp-3">{trabajo.descripcionLimpia}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Si no hay búsqueda completada, mostrar solo el buscador
  if (!busquedaCompletada && !cargando && (!resultados || resultados.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-center">Buscador de Trabajos</h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <Buscador onBuscar={buscarTrabajos} cargando={cargando} />
          
          {cargando && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Buscando ofertas de trabajo...</p>
              <p className="text-sm text-gray-500">Esto puede tomar unos minutos</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>{error}</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Página de resultados
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Buscador de Trabajos</h1>
            <button
              onClick={nuevaBusqueda}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Nueva Búsqueda
            </button>
          </div>
          {terminoBusqueda && (
            <p className="text-center mt-2 text-blue-100">
              Resultados para: <span className="font-semibold">{terminoBusqueda}</span>
            </p>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {cargando && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Buscando ofertas de trabajo...</p>
            <p className="text-sm text-gray-500">Esto puede tomar unos minutos</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {resultados && resultados.length > 0 && (
          <div className="mt-8">
            {/* Pestañas */}
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-lg shadow-md p-1">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setPestañaActiva('todos')}
                    className={`px-6 py-3 rounded-md font-medium transition-all ${
                      pestañaActiva === 'todos'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    Todos los Resultados ({resultados ? resultados.length : 0})
                  </button>
                  <button
                    onClick={() => setPestañaActiva('mejores')}
                    className={`px-6 py-3 rounded-md font-medium transition-all ${
                      pestañaActiva === 'mejores'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    Top {cantidadAMostrar} Mejores Sueldos
                  </button>
                  <button
                    onClick={() => setPestañaActiva('peores')}
                    className={`px-6 py-3 rounded-md font-medium transition-all ${
                      pestañaActiva === 'peores'
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    Top {cantidadAMostrar} Peores Sueldos
                  </button>
                  <button
                    onClick={() => setPestañaActiva('cerca')}
                    className={`px-6 py-3 rounded-md font-medium transition-all ${
                      pestañaActiva === 'cerca'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    Cerca de Mí
                  </button>
                </div>
              </div>
            </div>

            {/* Contenido de las pestañas */}
            <div className="mt-6">
              {renderizarContenido()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 