const express = require('express');
const cors = require('cors');
const { realizarScraping } = require('./src/services/scrapingService');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para realizar scraping
app.post('/api/scraping', async (req, res) => {
    try {
        const { termino } = req.body;
        
        if (!termino || termino.trim().length < 3) {
            return res.status(400).json({ 
                error: 'El término de búsqueda debe tener al menos 3 caracteres' 
            });
        }

        console.log('Recibida solicitud de scraping para:', termino);
        
        const resultadoScraping = await realizarScraping(termino);
        
        res.json({ 
            success: true, 
            resultados: resultadoScraping.todasLasOfertas,
            total: resultadoScraping.total
        });
        
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ 
            error: 'Error al realizar el scraping',
            message: error.message 
        });
    }
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'build')));

// Ruta para servir el frontend React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Para Vercel (si se necesita)
module.exports = app; 