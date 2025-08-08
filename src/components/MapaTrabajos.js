import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para centrar el mapa en la ubicación del usuario
function LocationMarker({ userLocation, trabajos }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 10);
    }
  }, [userLocation, map]);

  return null;
}

// Función para generar ubicaciones aleatorias en México (solo tierra firme)
const generarUbicacionesAleatorias = (cantidad) => {
  const ubicaciones = [];
  
  // Coordenadas aproximadas de México continental (evitando el mar)
  // Latitud: 14.5 a 32.7, Longitud: -118.4 a -86.7
  // Excluir áreas marítimas y penínsulas muy estrechas
  
  const areasTierraFirme = [
    // México continental (área principal - más conservadora)
    { latMin: 16.0, latMax: 32.0, lngMin: -106.0, lngMax: -87.0 },
    // Península de Baja California (más estrecha y conservadora)
    { latMin: 23.0, latMax: 32.0, lngMin: -116.0, lngMax: -111.0 },
    // Península de Yucatán (más estrecha y conservadora)
    { latMin: 18.0, latMax: 21.0, lngMin: -91.0, lngMax: -87.0 },
    // Costa del Pacífico (evitar mar - más conservadora)
    { latMin: 16.0, latMax: 32.0, lngMin: -104.0, lngMax: -98.0 },
    // Costa del Golfo (evitar mar - más conservadora)
    { latMin: 19.0, latMax: 32.0, lngMin: -96.0, lngMax: -91.0 }
  ];
  
  for (let i = 0; i < cantidad; i++) {
    let ubicacionValida = false;
    let intentos = 0;
    const maxIntentos = 100;
    
    while (!ubicacionValida && intentos < maxIntentos) {
      // Seleccionar un área aleatoria de tierra firme
      const area = areasTierraFirme[Math.floor(Math.random() * areasTierraFirme.length)];
      
      const lat = area.latMin + Math.random() * (area.latMax - area.latMin);
      const lng = area.lngMin + Math.random() * (area.lngMax - area.lngMin);
      
      // Verificar que no esté en áreas marítimas específicas
      const esTierraFirme = verificarTierraFirme(lat, lng);
      
      if (esTierraFirme) {
        ubicaciones.push({ lat, lng });
        ubicacionValida = true;
      }
      
      intentos++;
    }
    
    // Si no se encontró ubicación válida después de muchos intentos, usar una ubicación segura
    if (!ubicacionValida) {
      const ubicacionesSeguras = [
        { lat: 19.4326, lng: -99.1332 }, // CDMX
        { lat: 20.6597, lng: -103.3496 }, // Guadalajara
        { lat: 25.6866, lng: -100.3161 }, // Monterrey
        { lat: 21.1619, lng: -86.8515 }, // Cancún
        { lat: 16.8661, lng: -99.8877 }, // Acapulco
        { lat: 25.7617, lng: -80.1918 }, // Miami (como respaldo)
        { lat: 23.6345, lng: -102.5528 }, // Centro de México
        { lat: 27.6648, lng: -81.5158 }, // Florida (como respaldo)
        { lat: 18.2208, lng: -66.5901 }, // Puerto Rico (como respaldo)
        { lat: 19.8968, lng: -155.5828 }  // Hawaii (como respaldo)
      ];
      
      const ubicacionSegura = ubicacionesSeguras[i % ubicacionesSeguras.length];
      ubicaciones.push(ubicacionSegura);
    }
  }
  
  return ubicaciones;
};

// Función para verificar si las coordenadas están en tierra firme
const verificarTierraFirme = (lat, lng) => {
  // Excluir áreas marítimas conocidas
  const areasMaritimas = [
    // Golfo de México
    { latMin: 18.0, latMax: 32.7, lngMin: -97.0, lngMax: -80.0 },
    // Océano Pacífico (costa oeste)
    { latMin: 14.5, latMax: 32.7, lngMin: -118.4, lngMax: -105.0 },
    // Mar de Cortés
    { latMin: 22.5, latMax: 32.7, lngMin: -117.0, lngMax: -110.0 },
    // Caribe (costa este de Yucatán)
    { latMin: 17.5, latMax: 21.5, lngMin: -92.0, lngMax: -86.7 }
  ];
  
  // Verificar si está en área marítima
  for (const area of areasMaritimas) {
    if (lat >= area.latMin && lat <= area.latMax && 
        lng >= area.lngMin && lng <= area.lngMax) {
      return false; // Está en el mar
    }
  }
  
  // Verificar que esté dentro de los límites de México continental
  if (lat < 14.5 || lat > 32.7 || lng < -118.4 || lng > -86.7) {
    return false; // Fuera de México
  }
  
  return true; // Está en tierra firme
};

const MapaTrabajos = ({ trabajos }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Generar ubicaciones aleatorias para los trabajos
  const ubicacionesTrabajos = generarUbicacionesAleatorias(trabajos.length);

  // Centro del mapa en México si no hay ubicación del usuario
  const centerMap = userLocation || { lat: 23.6345, lng: -102.5528 }; // Centro de México

  // Función para generar URL de Google Maps con marcadores (para mapa completo)
  const getGoogleMapsUrl = () => {
    let url = `https://www.google.com/maps?q=${centerMap.lat},${centerMap.lng}&z=${userLocation ? 10 : 5}`;
    
    console.log('Generando URL de Google Maps...');
    console.log('Ubicaciones de trabajos:', ubicacionesTrabajos);
    
    // Agregar marcador de tu ubicación
    if (userLocation) {
      url += `&markers=color:blue|label:TU|${userLocation.lat},${userLocation.lng}`;
      console.log('Marcador de usuario agregado:', userLocation.lat, userLocation.lng);
    }
    
    // Agregar marcadores de trabajos (limitado para evitar URLs muy largas)
    const marcadoresTrabajos = ubicacionesTrabajos.slice(0, 15);
    console.log('Marcadores de trabajos a agregar:', marcadoresTrabajos.length);
    
    marcadoresTrabajos.forEach((ubicacion, index) => {
      url += `&markers=color:green|label:${index + 1}|${ubicacion.lat},${ubicacion.lng}`;
      console.log(`Marcador ${index + 1} agregado:`, ubicacion.lat, ubicacion.lng);
    });
    
    console.log('URL final generada:', url);
    return url;
  };

  const obtenerUbicacion = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    console.log('Iniciando solicitud de geolocalización...');

    if (!navigator.geolocation) {
      const errorMsg = 'La geolocalización no está soportada en este navegador.';
      console.error(errorMsg);
      setLocationError(errorMsg);
      setIsLoadingLocation(false);
      return;
    }

    console.log('navigator.geolocation disponible, solicitando posición...');

    // Primero intentar con alta precisión
    const options = {
      enableHighAccuracy: false, // Cambiar a false para ser menos estricto
      timeout: 30000, // Aumentar a 30 segundos
      maximumAge: 600000, // 10 minutos - usar ubicación en caché si está disponible
    };

    console.log('Opciones de geolocalización:', options);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Ubicación obtenida exitosamente:', position);
        console.log('Precisión:', position.coords.accuracy, 'metros');
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      async (error) => {
        console.error('Error en geolocalización:', error);
        console.error('Código de error:', error.code);
        console.error('Mensaje de error:', error.message);
        
        let errorMessage = 'Error al obtener la ubicación.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso denegado para acceder a la ubicación. Por favor, permite el acceso a la ubicación en tu navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'La información de ubicación no está disponible. Intenta en otro momento.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado. Intenta de nuevo o verifica tu conexión a internet.';
            break;
          default:
            errorMessage = `Error desconocido al obtener la ubicación: ${error.message}`;
        }
        console.error('Mensaje de error final:', errorMessage);
        
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      options
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Cerca de Mí - Mapa de Trabajos
      </h2>

      {/* Botón para obtener ubicación */}
      <div className="mb-6 text-center">
        {!userLocation && !locationError && (
          <div>
            <button
              onClick={obtenerUbicacion}
              disabled={isLoadingLocation}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoadingLocation ? 'Obteniendo ubicación...' : 'Obtener mi ubicación'}
            </button>
            <div className="mt-2 text-xs text-gray-500">
              💡 Permite el acceso a la ubicación cuando tu navegador lo solicite
            </div>
          </div>
        )}
        
        {userLocation && (
          <div className="text-green-600 font-semibold mb-4">
            ✅ Ubicación obtenida: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </div>
        )}
        
        {locationError && (
          <div className="text-red-600 font-semibold mb-4">
            ❌ {locationError}
            <div className="mt-2">
              <button
                onClick={obtenerUbicacion}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mapa con Leaflet y marcadores */}
      <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
        <div className="bg-gray-50 p-2 text-center text-xs text-gray-600 border-b">
          📍 Mapa interactivo con marcadores (tu ubicación y trabajos)
        </div>
        <MapContainer
          center={centerMap}
          zoom={userLocation ? 10 : 5}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <LocationMarker userLocation={userLocation} trabajos={trabajos} />

          {/* Marcador de la ubicación del usuario */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <div className="text-center">
                  <div className="font-bold text-blue-600">Tu ubicación</div>
                  <div className="text-sm text-gray-600">
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Marcadores de los trabajos */}
          {trabajos.map((trabajo, index) => {
            const ubicacion = ubicacionesTrabajos[index];
            return (
              <Marker key={index} position={[ubicacion.lat, ubicacion.lng]}>
                <Popup>
                  <div className="max-w-xs">
                    <h3 className="font-bold text-gray-800 mb-2">{trabajo.titulo}</h3>
                    <p className="text-green-600 font-semibold mb-1">
                      {trabajo.sueldo && trabajo.sueldo.toLowerCase().includes('oculto')
                        ? 'Sueldo oculto'
                        : (trabajo.sueldo || 'No especificado')}
                    </p>
                    <p className="text-gray-600 text-sm mb-1">{trabajo.ubicacionLimpia}</p>
                    <p className="text-gray-500 text-xs mb-1">{trabajo.tiempo}</p>
                    <p className="text-blue-600 text-xs mb-2">{trabajo.ingles}</p>
                    <p className="text-gray-700 text-xs line-clamp-3">
                      {trabajo.descripcionLimpia || 'Sin descripción disponible'}
                    </p>
                    {trabajo.URLPuesto && (
                      <a
                        href={trabajo.URLPuesto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Ver oferta completa →
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Información de depuración temporal */}
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>📊 Trabajos disponibles: {trabajos.length}</p>
        <p>📍 Ubicaciones generadas: {ubicacionesTrabajos.length}</p>
        
      </div>
    </div>
  );
};

export default MapaTrabajos; 