// Cargar pools guardadas de localStorage al iniciar
let pools = JSON.parse(localStorage.getItem('mining_pools')) || [];

const poolForm = document.getElementById('pool-form');
const poolsContainer = document.getElementById('pools-container');

// Guardar y renderizar al enviar el formulario
poolForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newPool = {
        id: Date.now(),
        name: document.getElementById('pool-name').value,
        url: document.getElementById('pool-url').value,
        worker: document.getElementById('worker-name').value,
        baseHashrate: Math.floor(Math.random() * (90 - 30) + 30) // Genera un hashrate base entre 30 y 90 MH/s
    };

    pools.push(newPool);
    localStorage.setItem('mining_pools', JSON.stringify(pools));
    
    poolForm.reset();
    renderPools();
});

// Eliminar una pool
function deletePool(id) {
    pools = pools.filter(pool => pool.id !== id);
    localStorage.setItem('mining_pools', JSON.stringify(pools));
    renderPools();
}

// Dibujar las pools en la pantalla
function renderPools() {
    if (pools.length === 0) {
        poolsContainer.innerHTML = '<p class="no-pools">No hay pools configuradas. Añade una arriba.</p>';
        return;
    }

    poolsContainer.innerHTML = '';
    
    pools.forEach(pool => {
        // Añadimos una pequeña variación aleatoria para simular tiempo real
        const currentHashrate = (pool.baseHashrate + (Math.random() * 4 - 2)).toFixed(2);
        
        const poolElement = document.createElement('div');
        poolElement.className = 'pool-card';
        poolElement.innerHTML = `
            <div class="pool-info">
                <h3>${pool.name}</h3>
                <p><strong>URL:</strong> ${pool.url}</p>
                <p><strong>Worker:</strong> ${pool.worker}</p>
                <button class="btn-delete" onclick="deletePool(${pool.id})">Eliminar</button>
            </div>
            <div class="pool-stats">
                <div class="hashrate">${currentHashrate} MH/s</div>
                <div class="status">● Online (Minería Activa)</div>
            </div>
        `;
        poolsContainer.appendChild(poolElement);
    });
}

// Bucle para actualizar los datos en tiempo real cada 3 segundos
setInterval(() => {
    if (pools.length > 0) {
        renderPools();
    }
}, 3000);

// Render inicial al cargar la página
renderPools();
