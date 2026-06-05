import requests
import json
import os
from datetime import datetime

url = "https://solo.ckpool.org/users/bc1q4gp9ycevf88wz8nhej89m4n2w3s760h88845xl"
headers = {'User-Agent': 'Mozilla/5.0'}

print("Iniciando conexión con CKPool...")

try:
    response = requests.get(url, headers=headers, timeout=10)
    print(f"Respuesta recibida. Código de estado: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("JSON parseado correctamente.")
        
        if "worker" in data:
            data["last_updated"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            
            # Guardamos el archivo y verificamos la ruta
            ruta_absoluta = os.path.abspath('stats.json')
            with open(ruta_absoluta, 'w') as f:
                json.dump(data, f, indent=4)
            
            print(f"Archivo guardado exitosamente en: {ruta_absoluta}")
            
            # Verificación final: ¿el archivo tiene contenido?
            tamano = os.path.getsize(ruta_absoluta)
            print(f"Tamaño del archivo guardado: {tamano} bytes")
        else:
            print("Error: El JSON recibido no contiene la clave 'worker'.")
            print("Contenido recibido:", str(data)[:200]) # Imprime parte del JSON
            
    else:
        print(f"Error: El pool respondió con código {response.status_code}")

except Exception as e:
    print(f"Error crítico durante la ejecución: {str(e)}")
