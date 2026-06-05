import requests
import json
from datetime import datetime

url = "https://solo.ckpool.org/users/bc1q4gp9ycevf88wz8nhej89m4n2w3s760h88845xl"
headers = {'User-Agent': 'Mozilla/5.0'}

try:
    response = requests.get(url, headers=headers, timeout=10)
    if response.status_code == 200:
        data = response.json()
        if "worker" in data:
            data["last_updated"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            # Guardamos en la raíz del repositorio
            with open('stats.json', 'w') as f:
                json.dump(data, f, indent=4)
except Exception as e:
    print(f"Error: {e}")
