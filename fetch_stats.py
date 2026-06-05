import requests
import json

# Esta es la URL que CKPool usa para mostrar los datos de los usuarios en formato de texto plano
# Cambia 'TU_DIRECCION_BTC' por la tuya.
USER_ADDRESS = "bc1q4gp9ycevf88wz8nhej89m4n2w3s760h88845xl"
url = f"https://solo.ckpool.org/users/{USER_ADDRESS}"

def update_stats():
    try:
        # Usamos un header para que el servidor crea que somos un navegador real
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        response = requests.get(url, headers=headers)
        
        # Como no es JSON, tenemos que buscar el texto específico en el HTML devuelto
        # Vamos a extraer los valores buscando las etiquetas de texto
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Buscamos la tabla de estadísticas
        data = {}
        # CKPool muestra las stats en una tabla simple
        for row in soup.find_all('tr'):
            cols = row.find_all('td')
            if len(cols) == 2:
                key = cols[0].text.strip().replace(":", "").lower().replace(" ", "_")
                val = cols[1].text.strip()
                data[key] = val
        
        # Guardamos el resultado en stats.json
        with open('stats.json', 'w') as f:
            json.dump(data, f, indent=2)
            
    except Exception as e:
        print(f"Error al conectar con CKPool: {e}")

if __name__ == "__main__":
    update_stats()
