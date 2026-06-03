document.addEventListener('DOMContentLoaded', loadPools);
const form = document.getElementById('pool-form');
const container = document.getElementById('pool-container');

// Guardar pool
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

// Renderizar tarjetas
function renderPools() {
    container.innerHTML = '';
    const pools = JSON.parse(localStorage.getItem('myPools') || '[]');
    
    pools.forEach((pool, index) => {
        const div = document.createElement('div');
        div.className = 'pool-card';
        div.innerHTML = `
            <h3>${pool.name}</h3>
            <p><strong>URL:</strong> ${pool.url}</p>
            <button class="delete-btn" onclick="deletePool(${index})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

function deletePool(index) {
    const pools = JSON.parse(localStorage.getItem('myPools'));
    pools.splice(index, 1);
    localStorage.setItem('myPools', JSON.stringify(pools));
    renderPools();
}

function loadPools() { renderPools(); }
