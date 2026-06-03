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

        const errorBox = card.querySelector('.error-msg').parentElement;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(pool.url)}&nocache=${Date.now()}`;

        fetch(proxyUrl)
            .then(res => {
                if (!res.ok) throw new Error('El proxy AllOrigins no responde (Error de red).');
                return res.json();
            })
            .then(proxyData => {
                if (!proxyData.contents) throw new Error('El proxy no pudo leer los datos del pool.');
                
                let data;
                try {
                    data = JSON.parse(proxyData.contents);
                } catch (e) {
                    throw new Error('El pool devolvió una página web (HTML) en lugar de datos de API (JSON).');
                }
                
                // Si la API del pool responde pero trae un mensaje de error interno
                if (data.error) {
                    throw new Error(`El pool dice: "${data.error}". (Si usas CKPool, esto pasa si tu billetera no está minando activamente en este momento).`);
                }

                let hashrate = 'No encontrado';
                let balance = 'No encontrado';

                // --- PROCESADOR CKPOOL ---
                if (data.hashrate1hr !== undefined) {
                    hashrate = data.hashrate1hr || '0 H/s';
                    balance = data.bestshare !== undefined ? `Best Share: ${Number(data.bestshare).toLocaleString()}` : 'Solo Pool';
                } 
                // --- PROCESADOR GENERAL (Otros pools) ---
                else {
                    if (data.hashrate !== undefined) hashrate = formatGenericHashrate(data.hashrate);
                    else if (data.stats?.hashrate !== undefined) hashrate = formatGenericHashrate(data.stats.hashrate);
                    
                    if (data.balance !== undefined) balance = formatGenericBalance(data.balance);
                    else if (data.stats?.balance !== undefined) balance = formatGenericBalance(data.stats.balance);
                }

                card.querySelector('.hashrate').innerText = hashrate;
                card.querySelector('.balance').innerText = balance;
            })
            .catch(err => {
                card.classList.add('error-card');
                card.querySelector('.hashrate').innerText = '❌ Error';
                card.querySelector('.balance').innerText = '❌ Inalcanzable';
                card.querySelector('.error-msg').innerText = err.message;
                errorBox.style.display = 'block';
            });
    });
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
