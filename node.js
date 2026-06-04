// Servidor simple con Express
const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(cors()); // Esto permite que tu web acceda a los datos

app.get('/datos-mineria', async (req, res) => {
    try {
        // Obtenemos los datos del pool
        const response = await axios.get('https://bch.solomining.io/address-stats.php?a=qr23d7d2waqnfmjk9c5t3jvqwz69wpy70uv65fs5pq');
        
        // Aquí procesas el HTML recibido para extraer los valores (esto es un ejemplo)
        // Como el pool devuelve HTML, podrías usar cheerio para parsearlo
        const data = {
            hashrate: "1.25 TH/s", // Extraído del HTML
            workers: 3,            // Extraído del HTML
            timestamp: new Date().toLocaleTimeString()
        };
        
        res.json(data);
    } catch (error) {
        res.status(500).send("Error al obtener datos");
    }
});

app.listen(3000, () => console.log('Proxy corriendo en puerto 3000'));
