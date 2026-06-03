// Añadir entry guardando la URL de la API
function addEntry() {
    const name = document.getElementById('poolName').value;
    const apiUrl = document.getElementById('apiUrl').value;
    const addr = document.getElementById('walletAddr').value;
    
    if (name && apiUrl && addr) {
        entries.push({ name, apiUrl, addr });
        localStorage.setItem('miners', JSON.stringify(entries));
        render();
    }
}

// Función actualizada para consultar la API real
async function updateData() {
    entries.forEach(async (e, i) => {
        const el = document.getElementById(`status-${i}`);
        el.innerText = "Consultando...";
        
        try {
            // Construimos la URL: URL Base + Wallet
            const response = await fetch(`${e.apiUrl}${e.addr}`);
            const data = await response.json();
            
            // Ajusta esto según el formato de JSON de tu pool (ej: data.hashrate, data.balance)
            el.innerHTML = `Hashrate: ${data.hashrate} | Balance: ${data.balance}`;
        } catch (error) {
            el.innerText = "Error al conectar con la API";
        }
    });
}
