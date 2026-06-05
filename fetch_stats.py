import requests
import json

# Esta es la URL que devuelve directamente el JSON de tu minero
# Cambia 'TU_DIRECCION_BTC' por la tuya
USER_ADDRESS = "bc1q4gp9ycevf88wz8nhej89m4n2w3s760h88845xl"
url = f"https://solo.ckpool.org/users/{USER_ADDRESS}.json"

def update_stats():
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            # Guardamos los datos reales en stats.json
            with open('stats.json', 'w') as f:
                json.dump(data, f, indent=4)
            print("Datos obtenidos correctamente de la API JSON.")
        else:
            print(f"Error al obtener datos: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_stats()
