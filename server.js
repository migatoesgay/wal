const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir los archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Endpoint Proxy: Tu frontend le pedirá datos a este endpoint, y este consultará al pool
app.get('/api/pool-data', async (req, res) => {
    const poolUrl = req.query.url;
    
    if (!poolUrl) {
        return res.status(400).json({ error: 'Falta la URL de la API del pool' });
    }

    try {
        // Hacemos la petición desde el servidor (Bypassea CORS por completo)
        const response = await fetch(poolUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Mining Dashboard Proxy)' }
        });

        if (!response.ok) {
            throw new Error(`Error del pool: ${response.status}`);
        }

        const data = await response.json();
        res.json(data); // Devolvemos los datos limpios al frontend
    } catch (error) {
        res.status(500).json({ error: 'No se pudo obtener datos del pool: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en: http://localhost:${PORT}`);
});
