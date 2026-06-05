import requests
import json
from datetime import datetime

# Esta es la URL de la API del pool de minería, que sí devuelve datos JSON reales
url = "https://solo.ckpool.org/users/bc1q4gp9ycevf88wz8nhej89m4n2w3s760h88845xl.json"
headers = {'User-Agent': 'Mozilla/5.0'}

try:
    response = requests.get(url, headers=headers, timeout=10)
    if response.status_code == 200:
        data = response.json()
        data["last_updated"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        
        with open('stats.json', 'w') as f:
            json.dump(data, f, indent=4)
        print("Datos actualizados correctamente.")
    else:
        print(f"Error: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")
