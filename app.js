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
        const card = document.createElement('div');
        card.className = 'pool-card';
        card.id = `pool-${index}`;
        card.innerHTML = `
            <h3>${pool.name}</h3>
            <div class="data-line"><strong>Hashrate:</strong> <span class="hashrate">Cargando...</span></div>
            <div class="data-line"><strong>Balance:</strong> <span class="balance">Cargando...</span></div>
            <div class="data-line" style="font-size:0.85rem; color:#ff5252; margin-top:10px;"><span class="error-msg"></span></div>
            <button class="delete-btn" onclick="deletePool(${index})">Eliminar Pool</button>
        `;
        container.appendChild(card);

        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(pool.url)}`;

        fetch(proxyUrl)
            .then(res => {
                if (!res.ok) throw new Error('El proxy no responde.');
                return res.json();
            })
            .then(proxyData => {
                if (!proxyData.contents) throw new Error('El pool no devolvió datos.');
                
                // Intentamos procesar el JSON de forma segura
                let data;
                try {
                    data = JSON.parse(proxyData.contents);
                } catch (e) {
                    // Si falla aquí, es porque el usuario metió una página web HTML en vez de una API JSON
                    throw new Error('❌ Pusiste la URL de la web, no la URL de la API del pool.');
                }
                
                let hashrate = 'No encontrado';
                let balance = 'No encontrado';

                // Buscador de datos en el JSON
                if (data.hashrate !== undefined) hashrate = data.hashrate;
                else if (data.stats?.hashrate !== undefined) hashrate = data.stats.hashrate;
                else if (data.data?.hashrate !== undefined) hashrate = data.data.hashrate;
                else if (data.currentHashrate !== undefined) hashrate = data.currentHashrate;

                if (data.balance !== undefined) balance = data.balance;
                else if (data.stats?.balance !== undefined) balance = data.stats.balance;
                else if (data.data?.balance !== undefined) balance = data.data.balance;
                else if (data.unpaid !== undefined) balance = data.unpaid;

                card.querySelector('.hashrate').innerText = formatHashrate(hashrate);
                card.querySelector('.balance').innerText = formatBalance(balance);
            })
            .catch(err => {
                card.classList.add('error-card');
                card.querySelector('.hashrate').innerText = 'Error';
                card.querySelector('.balance').innerText = 'Error';
                card.querySelector('.error-msg').innerText = err.message;
            });
    });
}

function formatHashrate(hash) {
    if (isNaN(hash) || hash === 'No encontrado') return hash;
    if (hash > 1e9) return (hash / 1e9).toFixed(2) + ' GH/s';
    if (hash > 1e6) return (hash / 1e6).toFixed(2) + ' MH/s';
    if (hash > 1000) return (hash / 1000).toFixed(2) + ' KH/s';
    return hash + ' H/s';
}

function formatBalance(bal) {
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
