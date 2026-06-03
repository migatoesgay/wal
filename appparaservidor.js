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
    
    pools.forEach((pool, index) => {
        // 1. Creamos la tarjeta con estado "Cargando..."
        const card = document.createElement('div');
        card.className = 'pool-card';
        card.id = `pool-${index}`;
        card.innerHTML = `
            <h3>${pool.name}</h3>
            <div class="data-line"><strong>Hashrate:</strong> <span class="hashrate">Cargando...</span></div>
            <div class="data-line"><strong>Balance Pendiente:</strong> <span class="balance">Cargando...</span></div>
            <button class="delete-btn" onclick="deletePool(${index})">Eliminar Pool</button>
        `;
        container.appendChild(card);

        // 2. Consultamos al servidor Proxy para obtener los datos reales sin bloqueos de CORS
        fetch(`/api/pool-data?url=${encodeURIComponent(pool.url)}`)
            .then(res => {
                if (!res.ok) throw new Error('Error en respuesta del servidor');
                return res.json();
            })
            .then(data => {
                // Buscador inteligente de datos comunes en APIs de minería
                const hashrate = data.hashrate || data.currentHashrate || (data.stats && data.stats.hashrate) || (data.data && data.data.hashrate) || 'No detectado';
                const balance = data.balance || data.unpaid || (data.stats && data.stats.balance) || (data.data && data.data.balance) || 'No detectado';

                card.querySelector('.hashrate').innerText = formatHashrate(hashrate);
                card.querySelector('.balance').innerText = balance;
            })
            .catch(err => {
                card.classList.add('error-card');
                card.querySelector('.hashrate').innerText = 'Offline/Error';
                card.querySelector('.balance').innerText = 'Inalcanzable';
                console.error(err);
            });
    });
}

// Formateador simple de Hashes si vienen en números enteros crudos
function formatHashrate(hash) {
    if (isNaN(hash)) return hash;
    if (hash > 1000000000) return (hash / 1000000000).toFixed(2) + ' GH/s';
    if (hash > 1000000) return (hash / 1000000).toFixed(2) + ' MH/s';
    if (hash > 1000) return (hash / 1000).toFixed(2) + ' KH/s';
    return hash + ' H/s';
}

function deletePool(index) {
    const pools = JSON.parse(localStorage.getItem('myPools'));
    pools.splice(index, 1);
    localStorage.setItem('myPools', JSON.stringify(pools));
    renderPools();
}

function loadPools() { renderPools(); }
