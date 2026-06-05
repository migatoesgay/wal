import requests
import json
from datetime import datetime  # Importamos la librería para manejar fechas

url = "https://solo.ckpool.org/users/bc1q4gp9ycevf88wz8nhej89m4n2w3s760h88845xl.json"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

try:
    response = requests.get(url, headers=headers, timeout=10)
    if response.status_code == 200:
        data = response.json()
        
        # Validación y adición de fecha/hora
        if "worker" in data:
            # Obtenemos la fecha y hora actual en formato legible
            data["last_updated"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            
            with open('stats.json', 'w') as f:
                json.dump(data, f, indent=4)
            print(f"Datos actualizados: {data['last_updated']}")
        else:
            print("Datos recibidos pero no contienen 'worker'. Ignorando.")
    else:
        print(f"Error de conexión: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")
