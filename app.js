// Configuración de la API con tu wallet exacta
const WALLET_ADDRESS = 'bc1q4gp9ycevf88wz8nhej89m4n2w3s760h88845xl';
const API_URL = `https://stats.ckpool.org/users/${WALLET_ADDRESS}`;

// Función principal para obtener los datos
async function fetchPoolData() {
    console.log("Conectando directamente con CKPool...");
    const statusElement = document.getElementById('loading-status');
    
    try {
        // Petición directa sin proxies intermedios
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Datos recibidos con éxito:", data);

        // Renderizar los datos en la web
        updateUI(data);

    } catch (error) {
        console.error("Error al obtener los datos de CKPool:", error);
        if (statusElement) {
            statusElement.innerText = `Error de conexión: No se pudieron sincronizar los datos del pool.`;
            statusElement.style.color = "red";
        }
    }
}

// Función para pintar los datos en tu HTML
function updateUI(data) {
    // Ocultar el mensaje de carga si existe
    const statusElement = document.getElementById('loading-status');
    if (statusElement) statusElement.style.display = 'none';

    // 1. Actualizar Hashrates (CKPool suele devolverlos estructurados)
    // Nota: Ajusta los IDs ('hashrate-1m', etc.) según los tengas en tu HTML
    if (document.getElementById('hashrate-1m')) {
        document.getElementById('hashrate-1m').innerText = data.hashrate1m || '0 KH/s';
    }
    if (document.getElementById('hashrate-5m')) {
        document.getElementById('hashrate-5m').innerText = data.hashrate5m || '0 KH/s';
    }
    if (document.getElementById('hashrate-1hr')) {
        document.getElementById('hashrate-1hr').innerText = data.hashrate1hr || '0 KH/s';
    }
    if (document.getElementById('hashrate-1d')) {
        document.getElementById('hashrate-1d').innerText = data.hashrate1d || '0 KH/s';
    }

    // 2. Datos Generales (Shares y Mejor Share)
    if (document.getElementById('best-share')) {
        document.getElementById('best-share').innerText = data.bestshare || '0';
    }
    if (document.getElementById('shares')) {
        document.getElementById('shares').innerText = data.shares || '0';
    }

    // 3. Listado de Workers (Minadores activos)
    const workersContainer = document.getElementById('workers-list');
    if (workersContainer) {
        workersContainer.innerHTML = ''; // Limpiar la lista anterior

        if (data.workers && Object.keys(data.workers).length > 0) {
            Object.keys(data.workers).forEach(workerName => {
                const worker = data.workers[workerName];
                
                // Crear un elemento para cada minador
                const workerRow = document.createElement('div');
                workerRow.className = 'worker-item'; // Puedes darle estilos en tu CSS
                workerRow.innerHTML = `
                    <strong>${workerName}</strong> - 
                    Hashrate: ${worker.hashrate || '0 KH/s'} | 
                    Shares: ${worker.shares || 0} | 
                    Último Share: ${worker.lastshare ? new Date(worker.lastshare * 1000).toLocaleTimeString() : 'Nunca'}
                `;
                workersContainer.appendChild(workerRow);
            });
        } else {
            workersContainer.innerHTML = '<p>No hay minadores activos actualmente.</p>';
        }
    }
}

// Inicializar la carga cuando el navegador esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Primera carga inmediata
    fetchPoolData();

    // Auto-actualización cada 5 minutos (300,000 milisegundos)
    setInterval(fetchPoolData, 300000);
});
