# Buscador de Trabajos - Scraping

Una aplicación web moderna para buscar ofertas de trabajo en Hireline.io con funcionalidades avanzadas de filtrado y visualización.

## 🚀 Características

- **Búsqueda en tiempo real**: Busca ofertas de trabajo por tecnología o habilidad
- **Filtro automático**: Solo muestra ofertas con sueldo visible (descarta "Sueldo oculto")
- **Sistema de pestañas**: Visualiza los resultados de diferentes maneras:
  - **Todos los Resultados**: Lista completa de ofertas encontradas (solo con sueldo visible)
  - **Top Mejores Sueldos**: Las ofertas con mejores salarios (cantidad dinámica)
  - **Top Peores Sueldos**: Las ofertas con salarios más bajos (cantidad dinámica)
- **Cantidad dinámica de resultados**: 
  - 25+ resultados: muestra top 10
  - 20-24 resultados: muestra top 8
  - 12-19 resultados: muestra top 5
  - 5-11 resultados: muestra top 3
  - 3-4 resultados: muestra top 1
- **Diseño responsivo**: Funciona perfectamente en desktop y móvil
- **Interfaz moderna**: Diseño limpio y profesional con Tailwind CSS
- **Información detallada**: Cada oferta incluye título, sueldo, ubicación, tipo de contrato, nivel de inglés y descripción completa

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Web Scraping**: Puppeteer
- **API**: RESTful API para comunicación cliente-servidor

## 📦 Instalación

1. **Clona el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd BuscadorScraping/BuscadorScraping
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

   Esto iniciará tanto el servidor backend (puerto 3002) como el frontend (puerto 3000).

## 🎯 Cómo Usar

1. **Abre tu navegador** y ve a `http://localhost:3000`

2. **Busca ofertas de trabajo**:
   - Escribe el nombre de la tecnología o habilidad que buscas (ej: "React", "JavaScript", "Python")
   - Haz clic en "Buscar Trabajos"
   - Espera mientras el sistema busca las ofertas (puede tomar unos minutos)

3. **Explora los resultados** usando las pestañas:
   - **Todos los Resultados**: Ve todas las ofertas encontradas (solo con sueldo visible)
   - **Top Mejores Sueldos**: Ve las ofertas con mejores salarios (cantidad adaptativa)
   - **Top Peores Sueldos**: Ve las ofertas con salarios más bajos (cantidad adaptativa)

4. **Interactúa con las ofertas**:
   - Haz clic en "Ver descripción completa" para ver toda la información
   - Haz clic en "Ver oferta completa" para ir a la página original de la oferta

## 📊 Información de las Ofertas

Cada oferta de trabajo incluye:

- **Título**: Nombre del puesto
- **Sueldo**: Rango salarial (solo ofertas con sueldo visible)
- **Ubicación**: País y modalidad de trabajo
- **Tiempo**: Tipo de contrato (tiempo completo, parcial, etc.)
- **Inglés**: Nivel de inglés requerido
- **Descripción**: Detalles completos del puesto y requisitos
- **URL**: Enlace directo a la oferta original

## 🔧 Scripts Disponibles

- `npm start`: Inicia solo el frontend
- `npm run server`: Inicia solo el backend
- `npm run dev`: Inicia tanto frontend como backend
- `npm run build`: Construye la aplicación para producción

## 🌐 API Endpoints

- `POST /api/scraping`: Realiza el scraping de ofertas de trabajo
  - Body: `{ "termino": "tecnologia" }`
  - Response: `{ "success": true, "resultados": [...], "total": 15 }`

- `GET /api/test`: Endpoint de prueba
  - Response: `{ "message": "Servidor funcionando correctamente" }`

## ⚠️ Notas Importantes

- El scraping puede tomar varios minutos dependiendo del número de ofertas encontradas
- Asegúrate de tener una conexión estable a internet
- El navegador se abrirá automáticamente durante el scraping (modo no-headless)
- Los resultados se ordenan automáticamente por salario para las pestañas de mejores/peores sueldos
- **Solo se muestran ofertas con sueldo visible**: Las ofertas con "Sueldo oculto" son descartadas automáticamente
- La cantidad de resultados mostrados se adapta automáticamente según el total encontrado

## 🎨 Características de Diseño

- **Diseño responsivo**: Se adapta a diferentes tamaños de pantalla
- **Animaciones suaves**: Transiciones y efectos hover
- **Colores temáticos**: Diferentes colores para cada tipo de información
- **Cards interactivas**: Hover effects y estados activos
- **Interfaz limpia**: Sin iconos, diseño minimalista

## 🔍 Ejemplos de Búsquedas

- "React" - Ofertas de desarrollo con React
- "JavaScript" - Ofertas de desarrollo JavaScript
- "Python" - Ofertas de desarrollo Python
- "Full Stack" - Ofertas de desarrollo full stack
- "DevOps" - Ofertas de DevOps
- "Data Science" - Ofertas de ciencia de datos

## 📱 Compatibilidad

- ✅ Chrome (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móviles

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa los logs del servidor en la consola
2. Asegúrate de que todas las dependencias estén instaladas
3. Verifica que los puertos 3000 y 3002 estén disponibles
4. Comprueba tu conexión a internet

---

¡Disfruta buscando tu próximo trabajo! 🚀 