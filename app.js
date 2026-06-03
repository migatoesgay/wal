document.addEventListener('DOMContentLoaded', loadPools);
const form = document.getElementById('pool-form');
const container = document.getElementById('pool-container');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('pool-name').value;
    const url = document.getElementById('pool-url').value;
    
    const pools = JSON.parse(localStorage.getItem('myPools') || '[]');
    pools.push({ name, url });
    localStorage.setItem('myPools', JSON.stringify(pools));
    
    form.reset();
    renderPools();
});

function renderPools() {
    container.innerHTML = '';
    const pools = JSON.parse(localStorage.getItem('myPools') || '[]');
    
    if (pools.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; width: 100%;">No hay pools añadidos. Añade uno arriba usando la URL de su API.</p>';
        return;
    }
    
    pools.forEach((pool, index) => {
        const card = document.createElement('div');
        card.className = 'pool-card';
        card.id = `pool-${index}`;
        card.innerHTML = `
            <h3>${pool.name}</h3>
            <div class="data-line"><strong>Hashrate (1h):</strong> <span class="hashrate" style="color: #00e676;">Cargando...</span></div>
            <div class="data-line"><strong>Métrica/Estado:</strong> <span class="balance" style="color: #00e676;">Cargando...</span></div>
            <div class="data-line" style="font-size:0.85rem; color:#ff5252; margin-top:10px; background: rgba(255,82,82,0.1); padding: 5px; border-radius:4px; display:none;" class="error-box"><span class="error-msg"></span></div>
            <button class="delete-btn" onclick="deletePool(${index})">Eliminar Pool</button>
        `;
        container.appendChild(card);

        // Llamamos a la función encargada de consultar los proxies de forma inteligente
        fetchWithFallback(pool.url, card);
    });
}

// Función con sistema de respaldo (Fallback) si un proxy falla
async function fetchWithFallback(poolUrl, card) {
    const errorBox = card.querySelector('.error-msg').parentElement;
    
    // Lista de proxies públicos disponibles
    const proxyUrl1 = `https://api.allorigins.win/get?url=${encodeURIComponent(poolUrl)}&nocache=${Date.now()}`;
    const proxyUrl2 = `https://corsproxy.io/?${encodeURIComponent(poolUrl)}`;

    // INTENTO 1: Con AllOrigins
    try {
        const res = await fetch(proxyUrl1);
        if (!res.ok) throw new Error("Proxy 1 saturado");
        const proxyData = await res.json();
        if (!proxyData.contents) throw new Error("Datos vacíos");
        
        const data = JSON.parse(proxyData.contents);
        procesarDatosPool(data, card);
        return; // Éxito, salimos de la función
    } catch (err) {
        console.warn("Proxy 1 falló, intentando Proxy de respaldo...", err.message);
    }

    // INTENTO 2: Con CorsProxy (Respaldo automático si el primero falla)
    try {
        const res = await fetch(proxyUrl2);
        if (!res.ok) throw new Error("El proxy de respaldo también falló.");
        const data = await res.json(); // CorsProxy devuelve el JSON directo, sin envolverlo
        
        procesarDatosPool(data, card);
    } catch (err) {
        // Si ambos fallan, mostramos el error en pantalla
        card.classList.add('error-card');
        card.querySelector('.hashrate').innerText = '❌ Error';
        card.querySelector('.balance').innerText = '❌ Inalcanzable';
        card.querySelector('.error-msg').innerText = "Ningún proxy de red responde. Inténtalo de nuevo en unos minutos o verifica la URL.";
        errorBox.style.display = 'block';
    }
}

// Procesa el JSON extraído del pool
function procesarDatosPool(data, card) {
    const errorBox = card.querySelector('.error-msg').parentElement;
    
    if (data.error) {
        throw new Error(`El pool dice: "${data.error}". Tu minero podría estar inactivo.`);
    }

    let hashrate = 'No encontrado';
    let balance = 'No encontrado';

    // --- PROCESADOR CKPOOL ---
    if (data.hashrate1hr !== undefined) {
        hashrate = data.hashrate1hr || '0 H/s';
        balance = data.bestshare !== undefined ? `Best Share: ${Number(data.bestshare).toLocaleString()}` : 'Solo Pool';
    } 
    // --- PROCESADOR GENERAL ---
    else {
        if (data.hashrate !== undefined) hashrate = formatGenericHashrate(data.hashrate);
        else if (data.stats?.hashrate !== undefined) hashrate = formatGenericHashrate(data.stats.hashrate);
        
        if (data.balance !== undefined) balance = formatGenericBalance(data.balance);
        else if (data.stats?.balance !== undefined) balance = formatGenericBalance(data.stats.balance);
    }

    card.querySelector('.hashrate').innerText = hashrate;
    card.querySelector('.balance').innerText = balance;
    card.classList.remove('error-card');
    errorBox.style.display = 'none';
}

function formatGenericHashrate(hash) {
    if (isNaN(hash) || hash === 'No encontrado') return hash;
    if (hash > 1e9) return (hash / 1e9).toFixed(2) + ' GH/s';
    if (hash > 1e6) return (hash / 1e6).toFixed(2) + ' MH/s';
    if (hash > 1000) return (hash / 1000).toFixed(2) + ' KH/s';
    return hash + ' H/s';
}

function formatGenericBalance(bal) {
    if (isNaN(bal) || bal === 'No encontrado') return bal;
    if (bal > 1000000) return (bal / 1e8).toFixed(5); 
    return bal;
}

function deletePool(index) {
    const pools = JSON.parse(localStorage.getItem('myPools'));
    pools.splice(index, 1);
    localStorage.setItem('myPools', JSON.stringify(pools));
    renderPools();
}

function loadPools() { renderPools(); }
