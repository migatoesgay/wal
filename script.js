let entries = JSON.parse(localStorage.getItem('miners')) || [];

function addEntry() {
    const name = document.getElementById('poolName').value;
    const addr = document.getElementById('walletAddr').value;
    if (name && addr) {
        entries.push({ name, addr });
        localStorage.setItem('miners', JSON.stringify(entries));
        render();
    }
}

function deleteEntry(index) {
    entries.splice(index, 1);
    localStorage.setItem('miners', JSON.stringify(entries));
    render();
}

function render() {
    const list = document.getElementById('minerList');
    list.innerHTML = entries.map((e, i) => `
        <div class="card">
            <strong>${e.name}</strong> - ${e.addr}
            <span class="delete-btn" onclick="deleteEntry(${i})">Eliminar</span>
            <div id="status-${i}">Esperando actualización...</div>
        </div>
    `).join('');
}

// Función para conectar a la API (Ejemplo genérico)
async function updateData() {
    entries.forEach(async (e, i) => {
        const el = document.getElementById(`status-${i}`);
        el.innerText = "Cargando...";
        // Aquí realizarías un fetch a la API de tu pool
        // Ejemplo: fetch(`https://api.pool.com/miner/${e.addr}`)
        setTimeout(() => {
            el.innerText = "Hashrate: 120 MH/s | Balance: 0.05 ETH";
        }, 1000);
    });
}

render();