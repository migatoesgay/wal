import requests
from bs4 import BeautifulSoup
import json

def fetch_ckpool_data():
    url = "https://solo.ckpool.org/users/bc1q4gp9ycevf88wz8nhej89m4n2w3s760h88845xl"
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Intentamos extraer datos basados en etiquetas comunes de tablas
        # CKPool suele usar tablas donde los encabezados son <th> o etiquetas de texto
        stats = {}
        # Buscamos todas las filas de la tabla
        for row in soup.find_all('tr'):
            cols = row.find_all('td')
            if len(cols) == 2:
                key = cols[0].text.strip().replace(":", "").lower().replace(" ", "_")
                val = cols[1].text.strip()
                stats[key] = val
        
        # Guardamos en stats.json
        with open('stats.json', 'w') as f:
            json.dump(stats, f)
            print("Datos actualizados correctamente.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fetch_ckpool_data()
